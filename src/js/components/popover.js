import "../../css/Popover.css";
import React, { Component } from "react";

export default class Popover extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
  }

  toggleVisibility(){ 
    this.setState({visible: !this.state.visible});
  }

  close(){
    this.setState({visible: false});
  }

  render() {
     const component = this.state.visible ? (
       <div className="popover">
         <div className="popover-arrow" />
         {this.props.children}
       </div>
    ) : (<></>);

    return component
  }
}
