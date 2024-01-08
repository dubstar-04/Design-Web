import "../../css/ToolbarButton.css";
import React, { Component } from "react";

export default class ToolbarButton extends Component{
constructor(props){
  super(props)
  this.state = {};
}

handleOnClick(){
  this.props.onClick(this.props.command)
}

render(){
    return <button className="toolbarbutton" onClick={this.handleOnClick.bind(this)}>
      <img src={this.props.icon} />
      { this.props.command ? 
        <div className={`tooltip tooltip${this.props.style}`}>
          <p>{`${this.props.command} (${this.props.shortcut})`}</p>
        </div>
      : <></>
      }
    </button>;
  };

}