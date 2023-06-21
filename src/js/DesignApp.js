import '../css/DesignApp.css';
import React, { Component } from 'react';

import Core from './Design-Core/core/core'

import Toolbar from './components/toolbar';
import Canvas from './components/canvas';
import Commandline from './components/commandline';

export default class DesignApp extends Component{
  constructor(){
    super()
    this.core = new Core()
  }

  

  render () {
    return <div className="DesignApp">
      <Toolbar />
      <Canvas core={this.core} />
      <Commandline />
    </div>
  };
}
