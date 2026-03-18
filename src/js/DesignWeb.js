import '../css/DesignWeb.css';
import React, { Component } from 'react';

// use local core npm for development
// 1. clone design-core into js
// 2. cd src/js
// 3. npm link ./Design-core
// 4. npm unlink ./Design-core
//import {Core} from '@design-core/core';

// Use CDN for production - Consider a npm package?
import {Core} from "https://cdn.jsdelivr.net/gh/dubstar-04/Design-Core/core/core/core.js"

import Headerbar from './components/headerbar.js';
import Canvas from './components/canvas.js';
import Commandline from './components/commandline.js';
import Toolbar from './components/toolbar.js';
import Popover from './components/popover.js';
import PopoverMenuItem from './components/popoverMenuItem.js';

import {saveAs} from 'file-saver'
import AboutWindow from './components/aboutWindow.js';
import SideKick from './components/sideKick.js';
import PropertiesPanel from './components/propertiesPanel.js';
import LayersPanel from './components/layersPanel.js';
import SettingsPanel from './components/settingsPanel.js';
import TextStylePanel from './components/textStylePanel.js';
import Toast from './components/toast.js';
import SaveDialog from './components/saveDialog.js';

export default class DesignWeb extends Component{
  constructor(){
    super()
    this.core = this.createCore();
    this.state = {mousePos: '', sideKickOpen: false, toasts: [], currentFilename: null}

    this.popoverRef = React.createRef();
    this.aboutWindowRef = React.createRef();
    this.sideKickRef = React.createRef();
    this.saveDialogRef = React.createRef();
    this.propertiesPanelContent = null;

    this.boundBeforeUnload = this.handleBeforeUnload.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.boundBeforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.boundBeforeUnload);
  }

  createCore() {
    const core = new Core();
    core.propertyManager.setPropertyCallbackFunction(this.handlePropertyChange.bind(this));
    core.setExternalNotifyCallbackFunction(this.showToast.bind(this));
    core.settings.canvasbackgroundcolour = { r: 30, g: 30, b: 30 };
    core.settings.gridcolour = { r: 120, g: 120, b: 120 };
    return core;
  }

  showToast(message) {
    const id = Date.now();
    this.setState((prev) => ({ toasts: [...prev.toasts, { id, message }] }));
    setTimeout(() => {
      this.setState((prev) => ({ toasts: prev.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  }

  handleBeforeUnload(e) {
    if (this.core.scene.stateManager.isModified) {
      e.preventDefault();
    }
  }

  /**
   * Set the mouse position
   * @param {string} mousePos
   */
  updateMousePos(mousePos){
    this.setState({ mousePos: mousePos });
  }

  handleOpenFile(e){
    this.popoverRef.current.close()

    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('multiple', 'multiple');
    fileSelector.addEventListener('change', this.openFile.bind(this))
    fileSelector.click();

  }

  openFile(e){
    const fileSelector = e.target
    const file = fileSelector.files && fileSelector.files[0]

    const reader = new FileReader();
    reader.onload = () => {
      const name = file.name.replace(/\.dxf$/i, '');
      this.core = this.createCore();
      this.setState({ currentFilename: name }, () => {
        this.core.openFile(reader.result);
      });
    };

    reader.readAsText(file);
  }

  downloadDxf(filename) {
    const blob = new Blob([this.core.saveFile()], { type: 'text/plain;' });
    saveAs(blob, filename);
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
      <SaveDialog onSave={this.downloadDxf.bind(this)} ref={this.saveDialogRef} />
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
        <PopoverMenuItem action={this.handleOpenFile.bind(this)} title="Open" />
        <PopoverMenuItem action={this.handleSaveFile.bind(this)} title="Save" />
        <PopoverMenuItem action={this.handleSaveAsFile.bind(this)} title="Save As" />
        <PopoverMenuItem action={this.handleOpenHelp.bind(this)} title="Help" />
        <PopoverMenuItem action={this.showAboutWindow.bind(this)} title="About" />
      </Popover>

      <Headerbar core={this.core} popover={this.popoverRef} />
      <Canvas
        core={this.core}
        mousePosCallback={this.updateMousePos.bind(this)}
        onHelp={this.handleOpenHelp.bind(this)}
        onSave={this.handleSaveFile.bind(this)}
        onSaveAs={this.handleSaveAsFile.bind(this)}
        onShortcut={(tab) => this.sideKickRef.current.openTab(tab)}
        sideKickOpen={this.state.sideKickOpen}
      />
      <Toolbar core={this.core} style="left" type='Entity' />
      <Toolbar core={this.core} style="right" type='Tool' />
      <Commandline core={this.core} mousePos={this.state.mousePos} />
      <Toast toasts={this.state.toasts} />

    </div>
  };
}
