import "../../css/Canvas.css";
import React, { Component } from "react";

export default class Canvas extends Component{
  constructor(props){
    super(props)

    this.canvasRef = React.createRef();
    this.boundHandleKeyPress = this.handleKeyPress.bind(this)
    this.state = { contextMenu: null };
  }

  componentDidMount() {

    // set the paint callback
    this.props.core.canvas.setExternalPaintCallbackFunction(this.paint.bind(this))

    // add keydown eventlistener
    document.addEventListener("keydown", this.boundHandleKeyPress)

    // Repaint whenever the canvas element is resized (covers window resize and sidekick open/close)
    this.resizeObserver = new ResizeObserver(() => requestAnimationFrame(() => this.paint()));
    this.resizeObserver.observe(this.canvasRef.current);

    // perform initial paint of the canvas
    this.paint()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.core !== this.props.core) {
      this.props.core.canvas.setExternalPaintCallbackFunction(this.paint.bind(this));
      this.paint();
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.boundHandleKeyPress)
    this.resizeObserver.disconnect();
  }

  paint() {

    const canvas = this.canvasRef.current
    const cr = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const width = cr.canvas.width;
    const height = cr.canvas.height;

    // Clear the canvas
    cr.save();
    cr.setTransform(1, 0, 0, 1, 0, 0);
    cr.clearRect(0, 0, width, height);
    cr.restore();

    this.props.core.canvas.paint(cr, width, height);
  }


  handleContextMenu(e){
    e.preventDefault();
    this.setState({ contextMenu: { x: e.clientX, y: e.clientY } });
  }

  closeContextMenu() {
    this.setState({ contextMenu: null });
  }

  renderContextMenu() {
    const { contextMenu } = this.state;
    if (!contextMenu) return null;

    const active = this.props.core.scene.inputManager.activeCommand !== undefined;
    const hasSelection = this.props.core.scene.selectionManager.selectedItems.length > 0;
    const validClipboard = this.props.core.clipboard.isValid;
    const run = (fn) => { this.closeContextMenu(); fn(); };
    const { x, y } = contextMenu;
    const transform = `translate(${x > window.innerWidth / 2 ? '-100%' : '0'}, ${y > window.innerHeight / 2 ? '-100%' : '0'})`;

    const items = [
      { label: 'Enter', action: () => this.props.core.commandLine.handleKeys('Enter') },
      { label: 'Cancel', action: () => this.props.core.commandLine.handleKeys('Escape'), disabled: !active },
      null, // separator
      { label: 'Cut', action: () => this.props.core.scene.inputManager.onCommand('Cutclip'), disabled: active || !hasSelection },
      { label: 'Copy', action: () => this.props.core.scene.inputManager.onCommand('Copyclip'), disabled: active || !hasSelection },
      { label: 'Copy with Base Point', action: () => this.props.core.scene.inputManager.onCommand('Copybase'), disabled: active || !hasSelection },
      { label: 'Paste', action: () => this.props.core.scene.inputManager.onCommand('Pasteclip'), disabled: !validClipboard },
      null, // separator
      { label: 'Pan', action: () => this.props.core.scene.inputManager.onCommand('Pan'), disabled: active },
      { label: 'Zoom Extents', action: () => this.props.core.canvas.zoomExtents(), disabled: active },
    ];

    const stopContext = e => e.preventDefault();

    return (
      <>
        <div className="canvas-context-overlay" onClick={this.closeContextMenu.bind(this)} onContextMenu={stopContext} />
        <div className="canvas-context-menu" onContextMenu={stopContext} style={{ left: x, top: y, transform }}>
          {items.map((item, i) =>
            item === null
              ? <div className="canvas-context-separator" key={i} />
              : <button
                  className="canvas-context-item"
                  disabled={item.disabled}
                  key={i}
                  onClick={() => run(item.action)}
                >{item.label}</button>
          )}
        </div>
      </>
    );
  }

  handleMouseDown(e){
    // button: 0 = left, 1 = wheel, 2 = right;
    e.preventDefault();
    this.canvasRef.current.focus();
    if (e.button === 2) return;
    this.props.core.mouse.mouseDown(e.button);
  }

  handleMouseUp(e){
    // button: 0 = left, 1 = wheel, 2 = right;
    e.preventDefault();
    if (e.button === 2) return;
    this.props.core.mouse.mouseUp(e.button);
  }

  handleMouseWheel(e){
    // delta = +/- 1 for zoom in / out
    const delta = Math.sign(e.deltaY*-1)
    this.props.core.mouse.wheel(delta);
  }

  handleMouseMove(e){
    const canvas = this.canvasRef.current
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY-rect.top;
    this.props.core.mouse.mouseMoved(x, y);
    this.props.mousePosCallback(this.props.core.mouse.positionString());
  }

  handleKeyPress(event) {
    // Don't intercept events when the user is typing in an input, textarea or select
    const tag = event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      return;
    }

    event.preventDefault()

    // Ignore Alt-modified keys — no Alt shortcuts are defined
    if (event.altKey) return;

    var charCode = (event.charCode) ? event.charCode : event.keyCode;
    console.log("char code", event.keyVal, event.keyCode)

    if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      if (this.props.onShortcut) this.props.onShortcut('layers');
      return;
    }

    if (event.ctrlKey && event.key === '1') {
      if (this.props.onShortcut) this.props.onShortcut('properties');
      return;
    }

    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 's') {
      if (this.props.onSaveAs) this.props.onSaveAs();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 's') {
      if (this.props.onSave) this.props.onSave();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'z') {
      this.props.core.scene.undo();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'y') {
      this.props.core.scene.redo();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      this.props.core.scene.selectionManager.selectAll();
      return;
    }

    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'c') {
      this.props.core.scene.inputManager.onCommand(`Copybase`);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      this.props.core.scene.inputManager.onCommand(`Copyclip`);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'x') {
      this.props.core.scene.inputManager.onCommand(`Cutclip`);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'g') {
      const current = this.props.core.settings.getSetting('drawgrid');
      this.props.core.settings.setSetting('drawgrid', !current);
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'v') {
      this.props.core.scene.inputManager.onCommand(`Pasteclip`);
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
    case 20: // CapsLock
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
      if (this.props.onHelp) this.props.onHelp();
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
      break;
    case 119: // F8 - Toggle Ortho
      this.props.core.settings.setSetting('ortho', !this.props.core.settings.getSetting('ortho'));
      break;
    case 120: // F9 - Toggle Snaps
      { const anySnap = ['endsnap', 'midsnap', 'centresnap', 'nearestsnap'].some(k => this.props.core.settings.getSetting(k));
        ['endsnap', 'midsnap', 'centresnap', 'nearestsnap'].forEach(k => this.props.core.settings.setSetting(k, !anySnap)); }
      break;
    case 121: // F10 - Toggle Polar
      this.props.core.settings.setSetting('polar', !this.props.core.settings.getSetting('polar'));
      break;
    case 122: // F11
      break;
    case 123: // F12
      break;

    default:
      // Only forward printable / known keys — skip modifier and media keys
      if (event.key.length === 1 || event.key === 'Dead') {
        key = event.key;
      }
    }

    console.log('key', key)
    this.props.core.commandLine.handleKeys(key);

  }


  render (){
    return (
      <>
        <canvas
          className="canvas"
          onContextMenu={this.handleContextMenu.bind(this)}
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          onWheel={this.handleMouseWheel.bind(this)}
          ref={this.canvasRef}
          tabIndex={-1}
        />
        {this.renderContextMenu()}
      </>
    )
  };
}