import "../../css/Canvas.css";
import React, { Component } from "react";

export default class Canvas extends Component{
  constructor(props){
    super(props)

    this.canvasRef = React.createRef();
    this.core = props.core
    this.boundHandleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount() {

    // set the paint callback
    this.core.canvas.setExternalPaintCallbackFunction(this.paint.bind(this))

    // add keydown eventlistener
    document.addEventListener("keydown", this.boundHandleKeyPress)

    // perform initial paint of the canvas
    this.paint()
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.boundHandleKeyPress)
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
    const delta = Math.sign(e.deltaY*-1)
    this.core.mouse.wheel(delta);
  }

  handleMouseMove(e){
    const canvas = this.canvasRef.current
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY-rect.top;
    this.core.mouse.mouseMoved(x, y);
    this.props.mousePosCallback(this.core.mouse.positionString());
  }

  handleKeyPress(event) {
    // Don't intercept events when the user is typing in an input, textarea or select
    const tag = event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      return;
    }

        event.preventDefault()

        var charCode = (event.charCode) ? event.charCode : event.keyCode;
        console.log("char code", event.keyVal, event.keyCode)

        if (event.ctrlKey && event.key === 'z') {
        console.log('Undo shortcut triggered')
        this.core.scene.undo();
        return;
        }

        if (event.ctrlKey && event.key === 'y') {
        console.log('Redo shortcut triggered')
        this.core.scene.redo();
        return;
        }

        if (event.ctrlKey && event.key === 'c') {
        console.log('Copy shortcut triggered')
        this.core.scene.inputManager.onCommand(`Copyclip`);
        return;
        }

        if (event.ctrlKey && event.key === 'v') {
        console.log('Paste shortcut triggered')
        this.core.scene.inputManager.onCommand(`Pasteclip`);
        return;
        }

        var key;

        switch (charCode) {
            case 8: //Backspace
                key = "Backspace";
                break;
            case 9: //Tab
                break;
            case 13: //Enter
                key = "Enter";
                break;
            case 16: // Shift
                break;
            case 17: // Ctrl
                break;
            case 27: // Escape
                key = "Escape";
                break;
            case 32: // space
                key = "Space";
                break;
            case 37: // Left-Arrow
                break;
            case 38: // Up-Arrow
                key = "Up-Arrow";
                break;
            case 39: // Right-Arrow
                break;
            case 40: // Down-Arrow
                key = "Down-Arrow";
                break;
            case 46: // Delete
                key = "Delete";
                break;
            case 112: // F1
                showSettings()
                changeTab(event, 'Help')
                break;
            case 113: // F2
                break;
            case 114: // F3
                //this.disableSnaps(e);
                break;
            case 115: // F4
                break;
            case 116: // F5
                break;
            case 117: // F6
                break;
            case 118: // F7
                toggleSnap('drawGrid')
                break;
            case 119: // F8
                toggleSnap('ortho')
                break;
            case 120: // F9
                break;
            case 121: // F10
                toggleSnap('polar');
                break;
            case 122: // F11
                break;
            case 123: // F12
                break;

            default:
                key = event.key
        }

        console.log('key', key)
        this.core.commandLine.handleKeys(key);
    //}
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
    if (event.ctrlKey && event.key.toLowerCase() === 'y') {
      this.core.scene.redo();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      this.core.scene.selectionManager.selectAll();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      this.core.scene.inputManager.onCommand(`Copyclip`);
      return;
    }

    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'c') {
      this.core.scene.inputManager.onCommand(`Copybase`);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'x') {
      this.core.scene.inputManager.onCommand(`Cutclip`);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'v') {
      this.core.scene.inputManager.onCommand(`Pasteclip`);
      return;
    }

  };
}