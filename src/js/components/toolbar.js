import "../../css/Toolbar.css";
import React, { Component } from "react";

export default class Toolbar extends Component{
constructor(props){
  super(props)
  this.state = {};
}

render(){
    return <div className="toolbar">{this.props.children}</div>;
  };

}