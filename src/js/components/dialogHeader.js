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
      {this.props.onBack && (
        <button
          className="dialogaddbutton"
          onClick={this.props.onBack}
          title="Back"
          type="button"
        >&#8592;</button>
      )}
      {!this.props.onBack && this.props.onAdd && (
        <button
          className="dialogaddbutton"
          onClick={this.props.onAdd}
          title="New"
          type="button"
        >+</button>
      )}
      <div className="dialogtitle">{this.props.title}</div>
      <button
        className="dialogclosebutton"
        onClick={this.handleOnClick.bind(this)}
        type="button"
      >&times;</button>
    </div>
  }
}
