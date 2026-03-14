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
import LayersWindow from './components/layersWindow.js';
import AboutWindow from './components/aboutWindow.js';
import SidePanel from './components/sidePanel.js';

export default class DesignWeb extends Component{
  constructor(){
    super()
    this.core = new Core()
    this.state = {mousePos: '', sidePanelOpen: false}

    this.popoverRef = React.createRef();
    this.layersWindowRef = React.createRef();
    this.aboutWindowRef = React.createRef();
    this.propertiesPanelRef = React.createRef();
    this._propertiesPanelContent = null;
    this._paintDebounceTimer = null;

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
      const text = reader.result;
      console.log(text)
      this.core.openFile(text);
    };

    reader.readAsText(file);
  }

  /**
   * save current canvas as dxf file
   */
  handleSaveFile(){
    this.popoverRef.current.close()
    console.log('Save File');
    const dxfData = this.core.saveFile()

    console.log(dxfData)

    var blob = new Blob([dxfData], {
      type: "text/plain;"
    });

    saveAs(blob, "design.dxf");
  }

  handleExportFile(){
    this.popoverRef.current.close()
    console.log('Export File');
  }

  showLayersWindow(){
    this.popoverRef.current.close()
    this.layersWindowRef.current.toggleVisibility()
  }

  showAboutWindow(){
    this.popoverRef.current.close()
    this.aboutWindowRef.current.toggleVisibility()
  }

  showPropertiesPanel(){
    this.popoverRef.current.close()
    this.propertiesPanelRef.current.toggleVisibility()
  }

  onPanelOpenChange(isOpen){
    this.setState({ sidePanelOpen: isOpen })
  }

  render () {
    return <div className={`DesignWeb${this.state.sidePanelOpen ? ' sidepanel-open' : ''}`}>

      <LayersWindow core={this.core} ref={this.layersWindowRef} />
      <AboutWindow ref={this.aboutWindowRef} />
      <SidePanel
        onOpenChange={this.onPanelOpenChange.bind(this)}
        ref={this.propertiesPanelRef}
        tabs={[
          { id: 'properties', label: 'Properties', content: <PropertiesPanel core={this.core} ref={(el) => { this._propertiesPanelContent = el; }} /> },
          { id: 'layers', label: 'Layers', content: null },
          { id: 'settings', label: 'Settings', content: null },
        ]}
      />
      <Popover ref={this.popoverRef} >
        <PopoverMenuItem action={this.handleOpenFile.bind(this)} title="Open" />
        <PopoverMenuItem action={this.handleSaveFile.bind(this)} title="Save" />
        <PopoverMenuItem action={this.handleExportFile.bind(this)} title="Export" />
        <PopoverMenuItem action={this.showLayersWindow.bind(this)} title="Layers" />
        <PopoverMenuItem action={this.showPropertiesPanel.bind(this)} title="Properties" />
        <PopoverMenuItem action={this.showAboutWindow.bind(this)} title="About" />
      </Popover>

      <Headerbar core={this.core} popover={this.popoverRef} />
      <Canvas
        core={this.core}
        mousePosCallback={this.updateMousePos.bind(this)}
        onPaint={this.handleCanvasPaint.bind(this)}
        sidePanelOpen={this.state.sidePanelOpen}
      />
      <Toolbar core={this.core} style="left" type='Entity' />
      <Toolbar core={this.core} style="right" type='Tool' />
      <Commandline core={this.core} mousePos={this.state.mousePos} />

    </div>
  };
}
