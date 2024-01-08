import "../../css/DialogHeader.css";
import React, { Component } from "react";

export default class DialogHeader extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(){
    this.props.onClose();
  }

  render() {
    return <div className="dialogheader">
      <div className="dialogtitle">{this.props.title}</div>
      <button
        className="dialogclosebutton"
        onClick={this.handleOnClick.bind(this)}
        type="button"
      >&times;</button>
    </div>
  }
}
