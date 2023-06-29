import "../../css/Toolbar.css";
import "../../css/ToolbarButton.css";
import React, { Component } from "react";
import ToolbarButton from "./toolbarButton";

export default class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getIcon(element){
  
    const imageName = `${element.command.toLowerCase()}-symbolic.svg`;
    let imagePath = ''
    
    if (element.type === "Entity") {
      imagePath = `/icons/entities/${imageName}`;
    }

    if (element.type === "Tool") {
      imagePath = `/icons/tools/${imageName}`;
    }

    return imagePath
  }

  getCommands(){
    const commands = this.props.core.commandManager.getCommands();
    const result = commands.filter(command => command.type === this.props.type);
    return result
  }

  handleOnClick(command){
    this.props.core.scene.inputManager.onCommand(`${command}`);
  }

  render() {
    return (
      <div className={`toolbar ${this.props.style}`}>
        {this.getCommands().map((element, index) =>
              ( <ToolbarButton
                command={element.command}
                icon={this.getIcon(element)} 
                key={index} onClick={this.handleOnClick.bind(this)}
                shortcut={element.shortcut}
                style={this.props.style}
                />
              )
          )}
      </div>
    );
  }
}
