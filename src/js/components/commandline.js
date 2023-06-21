import "../../css/Commandline.css";
import React, { Component } from "react";

export default class Commandline extends Component{
    constructor(props){
        super(props)
        this.state = {};
    }

 render(){
    return <div className="commandline" >{this.props.children}</div>;
  };
  
}