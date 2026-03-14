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

export default class DesignWeb extends Component{
  constructor(){
    super()
    this.core = new Core()
    this.state = {mousePos: '', sideKickOpen: false}

    this.popoverRef = React.createRef();
    this.aboutWindowRef = React.createRef();
    this.sideKickRef = React.createRef();
    this._propertiesPanelContent = null;

    this.core.propertyManager.setPropertyCallbackFunction(this.handlePropertyChange.bind(this));
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
    if (this._propertiesPanelContent) {
      this._propertiesPanelContent.reload();
    }
  }

  render () {
    return <div className={`DesignWeb${this.state.sideKickOpen ? ' sidekick-open' : ''}`}>

      <AboutWindow ref={this.aboutWindowRef} />
      <SideKick
        onOpenChange={this.onSideKickOpenChange.bind(this)}
        ref={this.sideKickRef}
        tabs={[
          { id: 'properties', label: 'Properties', content: <PropertiesPanel core={this.core} ref={(el) => { this._propertiesPanelContent = el; }} /> },
          { id: 'layers', label: 'Layers', content: <LayersPanel core={this.core} /> },
          { id: 'settings', label: 'Settings', content: null },
        ]}
      />
      <Popover ref={this.popoverRef} >
        <PopoverMenuItem action={this.handleOpenFile.bind(this)} title="Open" />
        <PopoverMenuItem action={this.handleSaveFile.bind(this)} title="Save" />
        {/* <PopoverMenuItem action={this.handleExportFile.bind(this)} title="Export" /> */}
        <PopoverMenuItem action={this.showSideKick.bind(this)} title="Side Kick" />
        <PopoverMenuItem action={this.showAboutWindow.bind(this)} title="About" />
      </Popover>

      <Headerbar core={this.core} popover={this.popoverRef} />
      <Canvas
        core={this.core}
        mousePosCallback={this.updateMousePos.bind(this)}
        sideKickOpen={this.state.sideKickOpen}
      />
      <Toolbar core={this.core} style="left" type='Entity' />
      <Toolbar core={this.core} style="right" type='Tool' />
      <Commandline core={this.core} mousePos={this.state.mousePos} />

    </div>
  };
}
