import '../css/DesignApp.css';
import React, { Component } from 'react';

import Core from './Design-Core/core/core'
//import { Core } from "https://cdn.jsdelivr.net/gh/dubstar-04/Design-Core/core/core.js"

import Toolbar from './components/toolbar';
import Canvas from './components/canvas';
import Commandline from './components/commandline';

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
      <Toolbar />
      <Canvas core={this.core} />
      <Commandline core={this.core} />
    </div>
  };
}
