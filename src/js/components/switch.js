import "../../css/Switch.css";
import React, { Component } from "react";

export default class Switch extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(){
    this.props.onClose();
  }

handleOnChange(e){
  console.log('check changed',e.target.checked)
}

  render() {
    return <label className="switch">
      <input defaultChecked={this.props.checked} onChange={this.handleOnChange} type="checkbox" />
      <span className="slider round" />
    </label>
  }
}
