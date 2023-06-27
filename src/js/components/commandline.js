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
        if(this.commandLineRef !== undefined){
            console.log(commandLineValue)
            this.commandLineRef.value = commandLineValue;
        }
    }


        handleKeyPress(event) {
            //if (lastDownTarget == cnvs || lastDownTarget == cmd_Line) {

                //event.preventDefault()

                var charCode = (event.charCode) ? event.charCode : event.keyCode;
                console.log("char code", event.keyVal, event.keyCode)

                var key;

                switch (charCode) {
                    case 8: //Backspace
                        key = "Backspace";
                        break;
                    case 9: //Tab
                        break;
                    case 13: //Enter
                        key = "Enter";
                        break;
                    case 16: // Shift
                        break;
                    case 17: // Ctrl
                        break;
                    case 27: // Escape
                        key = "Escape";
                        break;
                    case 32: // space
                        key = "Space";
                        break;
                    case 37: // Left-Arrow
                        break;
                    case 38: // Up-Arrow
                        key = "Up-Arrow";
                        break;
                    case 39: // Right-Arrow
                        break;
                    case 40: // Down-Arrow
                        key = "Down-Arrow";
                        break;
                    case 46: // Delete
                        key = "Delete";
                        break;
                    case 112: // F1
                        showSettings()
                        changeTab(event, 'Help')
                        break;
                    case 113: // F2
                        break;
                    case 114: // F3
                        //this.disableSnaps(e);
                        break;
                    case 115: // F4
                        break;
                    case 116: // F5
                        break;
                    case 117: // F6
                        break;
                    case 118: // F7
                        toggleSnap('drawGrid')
                        break;
                    case 119: // F8
                        toggleSnap('ortho')
                        break;
                    case 120: // F9
                        break;
                    case 121: // F10
                        toggleSnap('polar');
                        break;
                    case 122: // F11
                        break;
                    case 123: // F12
                        break;

                    default:
                        key = event.key
                }
                
                console.log('key', key)
                this.core.commandLine.handleKeys(key);
            //}
        }

 render(){
    return <div className="commandline" onKeyDown={this.handleKeyPress.bind(this)}>
        
      <input className="cmdLine" ref={this.commandLineRef} />
      <label className="coordLabel">coordLabel</label>
    </div>;
  };
  
}