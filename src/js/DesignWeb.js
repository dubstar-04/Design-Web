import '../css/DesignWeb.css';
import React, { Component } from 'react';
// import core from npm package
import {Core} from '@design-core/core';

// package and test core locally via npm link:
// npm run link-core   — links local Design-Core into this project
// npm run unlink-core — restores the published npm package

// use local core for development
//import {Core} from '../js/Design-Core/core/core/core.js';

// Previously used CDN
//import {Core} from "https://cdn.jsdelivr.net/gh/dubstar-04/Design-Core/core/core/core.js"

import Headerbar from './components/headerbar.js';
import Canvas from './components/canvas.js';
import Commandline from './components/commandline.js';
import Toolbar from './components/toolbar.js';
import Popover from './components/popover.js';
import PopoverMenuItem from './components/popoverMenuItem.js';
import StyleSwitcher from './components/styleSwitcher.js';

import {saveAs} from 'file-saver'
import AboutWindow from './components/aboutWindow.js';
import ShortcutsWindow from './components/shortcutsWindow.js';
import SideKick from './components/sideKick.js';
import PropertiesPanel from './components/propertiesPanel.js';
import LayersPanel from './components/layersPanel.js';
import SettingsPanel from './components/settingsPanel.js';
import TextStylePanel from './components/textStylePanel.js';
import Toast from './components/toast.js';
import SaveDialog from './components/saveDialog.js';
import ConfirmationDialog from './components/confirmationDialog.js';

export default class DesignWeb extends Component{
  constructor(){
    super()
    this.core = this.createCore();
    // Resolve initial style from a previous choice, defaulting to following the OS preference
    const storedStyle = localStorage.getItem('design-web-theme');
    const initialStyle = storedStyle || 'system';
    this.state = {mousePos: '', sideKickOpen: false, toasts: [], currentFilename: null, isModified: false, style: initialStyle}

    this.popoverRef = React.createRef();
    this.aboutWindowRef = React.createRef();
    this.shortcutsWindowRef = React.createRef();
    this.sideKickRef = React.createRef();
    this.saveDialogRef = React.createRef();
    this.confirmOpenRef = React.createRef();
    this.propertiesPanelContent = null;

    this.boundBeforeUnload = this.handleBeforeUnload.bind(this);
    this.boundVisibilityChange = this.handleVisibilityChange.bind(this);
    this.boundSystemStyleChange = this.handleSystemStyleChange.bind(this);
    this.systemStyleQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    // Restore drawing from sessionStorage if available (e.g. after tab discard)
    this.restoreSession();

    this.applyStyle(initialStyle);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.boundBeforeUnload);
    document.addEventListener('visibilitychange', this.boundVisibilityChange);
    this.systemStyleQuery?.addEventListener('change', this.boundSystemStyleChange);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.boundBeforeUnload);
    document.removeEventListener('visibilitychange', this.boundVisibilityChange);
    this.systemStyleQuery?.removeEventListener('change', this.boundSystemStyleChange);
  }

  // Re-sync the canvas colours when the OS preference changes while following the system style
  // (CSS elements already update automatically via light-dark(), but canvas colours are plain JS values)
  handleSystemStyleChange() {
    if (this.state.style === 'system') {
      this.applyStyle('system');
    }
  }

  // Sync the CSS style and the canvas colours (which CSS can't reach) together
  applyStyle(style) {
    if (style === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', style);
    }
    localStorage.setItem('design-web-theme', style);

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = style === 'dark' || (style === 'system' && prefersDark);
    this.core.settings.canvasbackgroundcolour = isDark ? { r: 30, g: 30, b: 30 } : { r: 250, g: 250, b: 250 };
    this.core.settings.gridcolour = isDark ? { r: 120, g: 120, b: 120 } : { r: 190, g: 190, b: 190 };
    this.core.canvas.requestPaint();
  }

  setStyle(style) {
    this.setState({ style }, () => this.applyStyle(style));
  }

  createCore() {
    const core = new Core();
    core.propertyManager.setPropertyCallbackFunction(this.handlePropertyChange.bind(this));
    core.setExternalNotifyCallbackFunction(this.showToast.bind(this));
    core.scene.stateManager.setStateCallbackFunction(() => {
      this.setState({ isModified: core.scene.stateManager.isModified });
    });

    // Set snap tracking colour to match the CSS accent color
    const accentHex = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    const accentMatch = accentHex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (accentMatch) {
      core.settings.accentcolour = {
        r: parseInt(accentMatch[1], 16),
        g: parseInt(accentMatch[2], 16),
        b: parseInt(accentMatch[3], 16),
      };
    }

    return core;
  }

  showToast(message) {
    const id = Date.now();
    this.setState((prev) => ({ toasts: [...prev.toasts, { id, message }] }));
  }

  removeToast(id) {
    this.setState((prev) => ({ toasts: prev.toasts.filter((t) => t.id !== id) }));
  }

  handleBeforeUnload(e) {
    this.saveSession();
    if (this.core.scene.stateManager.isModified) {
      e.preventDefault();
    }
  }

  handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      this.saveSession();
    }
  }

  saveSession() {
    try {
      const dxf = this.core.saveFile();
      sessionStorage.setItem('design-session-dxf', dxf);
      sessionStorage.setItem('design-session-filename', this.state.currentFilename || '');
      sessionStorage.setItem('design-session-modified', this.core.scene.stateManager.isModified ? '1' : '0');
    } catch {
      // sessionStorage may be full or unavailable
    }
  }

  restoreSession() {
    try {
      const dxf = sessionStorage.getItem('design-session-dxf');
      if (!dxf) return;

      const filename = sessionStorage.getItem('design-session-filename') || null;
      const wasModified = sessionStorage.getItem('design-session-modified') === '1';

      this.core.openFile(dxf);

      // Update initial state (called from constructor, before mount)
      Object.assign(this.state, {
        currentFilename: filename || null,
        isModified: wasModified,
      });

      if (wasModified) {
        this.core.scene.stateManager.stateChanged(true);
      }

      sessionStorage.removeItem('design-session-dxf');
      sessionStorage.removeItem('design-session-filename');
      sessionStorage.removeItem('design-session-modified');
    } catch {
      // restore failed — start fresh
    }
  }

  /**
   * Set the mouse position
   * @param {string} mousePos
   */
  updateMousePos(mousePos){
    this.setState({ mousePos: mousePos });
  }

  confirmOrRun(action) {
    if (this.core.scene.stateManager.isModified) {
      this.confirmAction = action;
      this.confirmOpenRef.current.show();
    } else {
      action();
    }
  }

  handleNewFile() {
    this.popoverRef.current.close();
    this.confirmOrRun(() => {
      this.core = this.createCore();
      this.applyStyle(this.state.style);
      this.setState({ currentFilename: null, isModified: false });
      this.core.notify('New Design Created');
    });
  }

  handleOpenFile() {
    this.popoverRef.current.close();
    this.confirmOrRun(() => {
      const fileSelector = document.createElement('input');
      fileSelector.setAttribute('type', 'file');
      fileSelector.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const name = file.name.replace(/\.dxf$/i, '');
          this.core = this.createCore();
          this.applyStyle(this.state.style);
          this.setState({ currentFilename: name, isModified: false }, () => {
            this.core.openFile(reader.result);
          });
        };
        reader.readAsText(file);
      });
      fileSelector.click();
    });
  }

  downloadDxf(filename) {
    const blob = new Blob([this.core.saveFile()], { type: 'text/plain;' });
    saveAs(blob, filename);
    this.core.scene.stateManager.stateChanged(false);
    this.core.notify('File Saved');
    // Remember the stem (without extension) for next save
    this.setState({ currentFilename: filename.replace(/\.dxf$/i, '') });
  }

  handleSaveFile(){
    this.popoverRef.current.close();
    if (this.state.currentFilename) {
      // Filename already known — download directly
      this.downloadDxf(`${this.state.currentFilename}.dxf`);
    } else {
      // No filename yet — prompt the user
      this.saveDialogRef.current.show(null);
    }
  }

  handleSaveAsFile(){
    this.popoverRef.current.close();
    // Always prompt, pre-populated with the current filename
    this.saveDialogRef.current.show(this.state.currentFilename);
  }

  handleExportFile(){
    this.popoverRef.current.close()
    console.log('Export File');
  }

  handleOpenHelp(){
    this.popoverRef.current.close()
    window.open('https://design-app.readthedocs.io/en/latest/index.html', '_blank', 'noopener,noreferrer')
  }

  showAboutWindow(){
    this.popoverRef.current.close()
    this.aboutWindowRef.current.toggleVisibility()
  }

  showShortcutsWindow(){
    this.popoverRef.current.close()
    this.shortcutsWindowRef.current.toggleVisibility()
  }

  showSideKick(){
    this.popoverRef.current.close()
    this.sideKickRef.current.toggleVisibility()
  }

  onSideKickOpenChange(isOpen){
    this.setState({ sideKickOpen: isOpen })
  }

  handlePropertyChange(){
    if (this.propertiesPanelContent) {
      this.propertiesPanelContent.reload();
    }
  }

  render () {
    return <div className={`DesignWeb${this.state.sideKickOpen ? ' sidekick-open' : ''}`}>

      <AboutWindow ref={this.aboutWindowRef} />
      <ShortcutsWindow ref={this.shortcutsWindowRef} />
      <SaveDialog onSave={this.downloadDxf.bind(this)} ref={this.saveDialogRef} />
      <ConfirmationDialog
        confirmLabel="Continue"
        message="Unsaved changes will be permanently lost."
        onConfirm={() => this.confirmAction?.()}
        ref={this.confirmOpenRef}
        title="Unsaved Changes"
      />
      <SideKick
        onOpenChange={this.onSideKickOpenChange.bind(this)}
        ref={this.sideKickRef}
        tabs={[
          { id: 'properties', label: 'Properties', content: <PropertiesPanel core={this.core} ref={(el) => { this.propertiesPanelContent = el; }} /> },
          { id: 'layers', label: 'Layers', content: <LayersPanel core={this.core} /> },
          { id: 'styles', label: 'Text Styles', content: <TextStylePanel core={this.core} /> },
          { id: 'settings', label: 'Settings', content: <SettingsPanel core={this.core} /> },
        ]}
      />
      <Popover ref={this.popoverRef} >
        <StyleSwitcher onChange={this.setStyle.bind(this)} style={this.state.style} />
        <div className="popover-separator" />
        <PopoverMenuItem action={this.handleNewFile.bind(this)} title="New" />
        <PopoverMenuItem action={this.handleOpenFile.bind(this)} title="Open" />
        <PopoverMenuItem action={this.handleSaveFile.bind(this)} title="Save" />
        <PopoverMenuItem action={this.handleSaveAsFile.bind(this)} title="Save As" />
        <PopoverMenuItem action={this.handleOpenHelp.bind(this)} title="Help" />
        <PopoverMenuItem action={this.showShortcutsWindow.bind(this)} title="Shortcuts" />
        <PopoverMenuItem action={this.showAboutWindow.bind(this)} title="About" />
      </Popover>

      <Headerbar core={this.core} isModified={this.state.isModified} popover={this.popoverRef} />
      <Canvas
        core={this.core}
        mousePosCallback={this.updateMousePos.bind(this)}
        onHelp={this.handleOpenHelp.bind(this)}
        //onNew={this.handleNewFile.bind(this)}
        onOpen={this.handleOpenFile.bind(this)}
        onSave={this.handleSaveFile.bind(this)}
        onSaveAs={this.handleSaveAsFile.bind(this)}
        onShortcut={(tab) => this.sideKickRef.current.openTab(tab)}
        onShortcuts={this.showShortcutsWindow.bind(this)}
        sideKickOpen={this.state.sideKickOpen}
      />
      <Toolbar core={this.core} style="left" type='Entity' />
      <Toolbar core={this.core} style="right" type='Tool' />
      <Commandline core={this.core} mousePos={this.state.mousePos} />
      <Toast removeToast={this.removeToast.bind(this)} toasts={this.state.toasts} />

    </div>
  };
}
