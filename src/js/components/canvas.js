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

    this.core.canvas.setExternalPaintCallbackFunction(this.paint.bind(this))
  }

  paint() {

    const canvas = this.canvasRef.current
    const cr = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const width = cr.canvas.width;
    const height = cr.canvas.height;

    // Clear the canvas
    cr.save();
    cr.setTransform(1, 0, 0, 1, 0, 0);
    cr.clearRect(0, 0, width, height);
    cr.restore();

    this.core.canvas.paint(cr, width, height);
}

  handleMouseDown(e){
    // button: 0 = left, 1 = wheel, 2 = right;
    e.preventDefault();
    this.core.mouse.mouseDown(e.button);
  }

  handleMouseUp(e){
    // button: 0 = left, 1 = wheel, 2 = right;
    e.preventDefault();
    this.core.mouse.mouseUp(e.button);
  }

  handleContextMenu(e){
    e.preventDefault();
  }

  handleMouseWheel(e){
    // delta = +/- 1 for zoom in / out
    const delta = e.deltaY * 0.01;
    this.core.mouse.wheel(delta);
  }

  handleMouseMove(e){
    const canvas = this.canvasRef.current
    const rect = canvas.getBoundingClientRect();
    this.core.mouse.mouseMoved(e.clientX - rect.left, e.clientY-rect.top);
  }


    render (){
      return (
        <canvas
          className="canvas" 
          onContextMenu={this.handleContextMenu}
          onMouseDown={this.handleMouseDown.bind(this)} 
          onMouseMove={this.handleMouseMove.bind(this)} 
          onMouseUp={this.handleMouseUp.bind(this)}
          onWheel={this.handleMouseWheel.bind(this)}
          ref={this.canvasRef}
        />
      )
  };
}