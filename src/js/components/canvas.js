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
    const tag = event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    event.preventDefault();
    if (event.altKey) return;

    const { core } = this.props;
    const key = event.key.toLowerCase();

    // Ctrl+Shift shortcuts
    if (event.ctrlKey && event.shiftKey) {
      const shortcuts = {
        's': () => this.props.onSaveAs?.(),
        'c': () => core.scene.inputManager.onCommand('Copybase'),
      };
      if (shortcuts[key]) { shortcuts[key](); return; }
    }

    // Ctrl shortcuts
    if (event.ctrlKey) {
      const shortcuts = {
        'l': () => this.props.onShortcut?.('layers'),
        '1': () => this.props.onShortcut?.('properties'),
        's': () => this.props.onSave?.(),
        'z': () => core.scene.undo(),
        'y': () => core.scene.redo(),
        'a': () => core.scene.selectionManager.selectAll(),
        'c': () => core.scene.inputManager.onCommand('Copyclip'),
        'x': () => core.scene.inputManager.onCommand('Cutclip'),
        'v': () => core.scene.inputManager.onCommand('Pasteclip'),
        'g': () => core.settings.setSetting('drawgrid', !core.settings.getSetting('drawgrid')),
      };
      if (shortcuts[key]) { shortcuts[key](); return; }
    }

    // Special keys — mapped to core key strings or handlers
    const specialKeys = {
      'Backspace':  'Backspace',
      'Enter':      'Enter',
      'Escape':     'Escape',
      ' ':          'Space',
      'ArrowUp':    'Up-Arrow',
      'ArrowDown':  'Down-Arrow',
      'Delete':     'Delete',
      'F1':  () => this.props.onHelp?.(),
      'F8':  () => core.settings.setSetting('ortho', !core.settings.getSetting('ortho')),
      'F9':  () => {
        const snaps = ['endsnap', 'midsnap', 'centresnap', 'nearestsnap'];
        const anySnap = snaps.some(k => core.settings.getSetting(k));
        snaps.forEach(k => core.settings.setSetting(k, !anySnap));
      },
      'F10': () => core.settings.setSetting('polar', !core.settings.getSetting('polar')),
    };

    if (event.key in specialKeys) {
      const handler = specialKeys[event.key];
      if (typeof handler === 'function') { handler(); return; }
      core.commandLine.handleKeys(handler);
      return;
    }

    // Forward printable characters to the command line
    if (event.key.length === 1 || event.key === 'Dead') {
      core.commandLine.handleKeys(event.key);
    }
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