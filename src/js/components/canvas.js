import "../../css/Canvas.css";
import React, { Component } from "react";

export default class Canvas extends Component{
  constructor(props){
    super(props)

    this.canvasRef = React.createRef();
    this.core = props.core
  }

  componentDidMount() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    this.core.canvas.setExternalPaintCallbackFunction()
  }


    render (){
      return <canvas className="canvas" ref={this.canvasRef} />
  };
}