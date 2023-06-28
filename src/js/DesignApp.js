import '../css/DesignApp.css';
import React, { Component } from 'react';

import Core from './Design-Core/core/core'
//import { Core } from "https://cdn.jsdelivr.net/gh/dubstar-04/Design-Core/core/core.js"

import Headerbar from './components/headerbar';
import Canvas from './components/canvas';
import Commandline from './components/commandline';
import Toolbar from './components/toolbar';

export default class DesignApp extends Component{
  constructor(){
    super()
    this.core = new Core()
    this.state = {mousePos: ''}

  } 

  /**
   * Set the mouse position 
   * @param {string} mousePos 
   */
  updateMousePos(mousePos){
    this.setState({ mousePos: mousePos });
  }

  render () {
    return <div className="DesignApp">
      <Headerbar core={this.core} />
      <Canvas core={this.core} mousePosCallback={this.updateMousePos.bind(this)} />
      <Toolbar core={this.core} style="toolbar left" type='Entity' />
      <Toolbar core={this.core} style="toolbar right" type='Tool' />
      <Commandline core={this.core} mousePos={this.state.mousePos} />
    </div>
  };
}
