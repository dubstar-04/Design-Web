import "../../css/DialogRow.css";
import React, { Component } from "react";
import ColourButton from "./colourButton";
import Switch from "./switch";

export default class DialogRow extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(){
    this.props.onClose();
  }

  render() {
    return <div className="dialogrow">
      <ColourButton className="colourbutton" colour={this.props.colour} />
      <div className="dialogrowtitle">{this.props.title}</div>
      <Switch checked={this.props.active} />
    </div>
  }
}
