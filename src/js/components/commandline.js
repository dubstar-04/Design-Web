import "../../css/Commandline.css";
import React, { Component } from "react";

export default class Commandline extends Component{
    constructor(props){
        super(props)
        this.state = {};
        this.core = props.core

        this.commandLineRef = React.createRef();
    }

    componentDidMount() {
        this.core.commandLine.setUpdateFunction(this.commandLineUpdateCallback.bind(this));
    }

    // callback passed to the core.commandline class to update this cmd_line value
    commandLineUpdateCallback(commandLineValue) {  
        this.commandLineRef.current.value = commandLineValue;
    }

 render(){
    return <div className="commandline">
        
      <input
        className="cmdLine" onMouseDown={(e) => {e.preventDefault()}} ref={this.commandLineRef}
        tabIndex='-1'
      />
      <label className="coordLabel">{this.props.mousePos}</label>
    </div>;
  };
  
}