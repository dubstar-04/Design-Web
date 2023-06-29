import "../../css/PopoverMenuItem.css";
import React, { Component } from "react";

export default class PopoverMenuItem extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick(e){
    this.props.action(e)
  }

  render() {
     return <div className="popovermenuitem" onClick={this.handleOnClick.bind(this)}>
       {this.props.title}
     </div>
  }
}
