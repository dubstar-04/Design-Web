import "../../css/DialogWindow.css";
import React, { Component } from "react";
import DialogHeader from "./dialogHeader";

export default class DialogWindow extends Component {
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
       <div className="dialogbackground">
         <div className="dialogwindow">
           <DialogHeader onClose={this.close.bind(this)} title={this.props.title} />
           {this.props.children}
         </div>
       </div>
    ) : (<></>);

    return component
  }
}
