import "../../css/ColourButton.css";
import React, { Component } from "react";

export default class ColourButton extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(){

  }

  render() {
    return <div className="colourbutton" onClick={this.handleOnClick.bind(this)} style={{backgroundColor: `${this.props.colour}`}} />
  }
}
