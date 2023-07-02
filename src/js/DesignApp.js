import '../css/DesignApp.css';
import React, { Component } from 'react';

import Core from './Design-Core/core/core'
//import { Core } from "https://cdn.jsdelivr.net/gh/dubstar-04/Design-Core/core/core.js"

import Headerbar from './components/headerbar';
import Canvas from './components/canvas';
import Commandline from './components/commandline';
import Toolbar from './components/toolbar';
import Popover from './components/popover';
import PopoverMenuItem from './components/popoverMenuItem';

import {saveAs} from './FileSaver.min.js'
import LayersWindow from './components/layersWindow';

export default class DesignApp extends Component{
  constructor(){
    super()
    this.core = new Core()
    this.state = {mousePos: ''}

    this.popoverRef = React.createRef();
    this.layersWindowRef = React.createRef();

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

  render () {
    return <div className="DesignApp">

      <LayersWindow core={this.core} ref={this.layersWindowRef} />
      <Popover ref={this.popoverRef} >
        <PopoverMenuItem action={this.handleOpenFile.bind(this)} title="Open" />
        <PopoverMenuItem action={this.handleSaveFile.bind(this)} title="Save" />
        <PopoverMenuItem action={this.handleExportFile.bind(this)} title="Export" />
        <PopoverMenuItem action={this.showLayersWindow.bind(this)} title="Layers" />
      </Popover>

      <Headerbar core={this.core} popover={this.popoverRef} />
      <Canvas core={this.core} mousePosCallback={this.updateMousePos.bind(this)} />
      <Toolbar core={this.core} style="left" type='Entity' />
      <Toolbar core={this.core} style="right" type='Tool' />
      <Commandline core={this.core} mousePos={this.state.mousePos} />

      
    </div>
  };
}
