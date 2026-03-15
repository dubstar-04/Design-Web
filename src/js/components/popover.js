import "../../css/Popover.css";
import React, { Component } from "react";

export default class Popover extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: false};
    this.wrapperRef = React.createRef();
  }

  toggleVisibility(){
    this.setState({visible: !this.state.visible}, () => {
      if (this.state.visible && this.wrapperRef.current) {
        this.wrapperRef.current.focus();
      }
    });
  }

  close(){
    this.setState({visible: false});
  }

  handleBlur(e) {
    // Only close if focus moves outside the popover wrapper entirely
    if (!this.wrapperRef.current.contains(e.relatedTarget)) {
      this.close();
    }
  }

  render() {
    if (!this.state.visible) {
      return <></>;
    }

    return (
      <div
        className="popover"
        onBlur={this.handleBlur.bind(this)}
        ref={this.wrapperRef}
        style={{outline: "none"}}
        tabIndex={-1}
      >
        <div className="popover-arrow" />
        {this.props.children}
      </div>
    );
  }
}
