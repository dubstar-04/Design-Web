import "../../css/ShortcutsWindow.css";
import React, { Component } from "react";
import DialogWindow from "./dialogWindow";

const SECTIONS = [
  {
    title: "Documents",
    items: [
      //{ title: "New Design",          keys: [["Ctrl", "N"]] },
      { title: "Open",                keys: [["Ctrl", "O"]] },
      { title: "Save",                keys: [["Ctrl", "S"]] },
      { title: "Save As",             keys: [["Ctrl", "Shift", "S"]] },
      { title: "Undo",                keys: [["Ctrl", "Z"]] },
      { title: "Redo",                keys: [["Ctrl", "Y"]] },
    ],
  },
  {
    title: "General",
    items: [
      { title: "Show Layers",         keys: [["Ctrl", "L"]] },
      { title: "Show Properties",     keys: [["Ctrl", "1"]] },
      { title: "Show Shortcuts",      keys: [["Ctrl", "?"]] },
      { title: "Show Help",           keys: [["F1"]] },
    ],
  },
  {
    title: "Canvas",
    items: [
      { title: "Toggle Grid",         keys: [["Ctrl", "G"]] },
      { title: "Toggle Ortho Mode",   keys: [["F8"]] },
      { title: "Toggle Snap Mode",    keys: [["F9"]] },
      { title: "Toggle Polar Mode",   keys: [["F10"]] },
    ],
  },
  {
    title: "Clipboard",
    items: [
      { title: "Select All",          keys: [["Ctrl", "A"]] },
      { title: "Copy",                keys: [["Ctrl", "C"]] },
      { title: "Cut",                 keys: [["Ctrl", "X"]] },
      { title: "Copy with Base Point",keys: [["Ctrl", "Shift", "C"]] },
      { title: "Paste",               keys: [["Ctrl", "V"]] },
    ],
  },
  {
    title: "Entities",
    command: true,
    items: [
      { title: "Arc",                 keys: [["A"]] },
      { title: "Block",               keys: [["B"]] },
      { title: "Circle",              keys: [["C"]] },
      { title: "Dimension",           keys: [["DIM"]] },
      { title: "Text",                keys: [["DT"]] },
      { title: "Hatch",               keys: [["H"]] },
      { title: "Line",                keys: [["L"]] },
      { title: "Polyline",            keys: [["PL"]] },
      { title: "Rectangle",           keys: [["REC"]] },
    ],
  },
  {
    title: "Tools",
    command: true,
    items: [
      { title: "Chamfer",             keys: [["CHA"]] },
      { title: "Copy",                keys: [["CO"]] },
      { title: "Distance",            keys: [["DI"]] },
      { title: "Erase",               keys: [["E"], ["Del"]] },
      { title: "Extend",              keys: [["EX"]] },
      { title: "Fillet",              keys: [["F"]] },
      { title: "Identify",            keys: [["ID"]] },
      { title: "Move",                keys: [["M"]] },
      { title: "MatchProp",           keys: [["MA"]] },
      { title: "Pan",                 keys: [["P"]] },
      { title: "Purge",               keys: [["PU"]] },
      { title: "Rotate",              keys: [["RO"]] },
      { title: "Trim",                keys: [["TR"]] },
      { title: "Explode",             keys: [["X"]] },
      { title: "Zoom",                keys: [["Z"]] },
    ],
  },
];

function KeyCombo({ combo, isCommand }) {
  return (
    <span className="shortcuts-window-combo">
      {combo.map((k, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="shortcuts-window-plus">+</span>}
          <kbd className={`shortcuts-window-key${isCommand ? " shortcuts-window-key--command" : ""}`}>{k}</kbd>
        </React.Fragment>
      ))}
    </span>
  );
}

function ShortcutItem({ item, isCommand }) {
  return (
    <div className="shortcuts-window-item">
      <span className="shortcuts-window-item-title">{item.title}</span>
      <div className="shortcuts-window-item-keys">
        {item.keys.map((combo, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="shortcuts-window-or">or</span>}
            <KeyCombo combo={combo} isCommand={isCommand} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function ShortcutsSection({ section }) {
  return (
    <div className="shortcuts-window-section">
      <h4 className="shortcuts-window-section-title">{section.title}</h4>
      {section.items.map((item, i) => (
        <ShortcutItem isCommand={!!section.command} item={item} key={i} />
      ))}
    </div>
  );
}

export default class ShortcutsWindow extends Component {
  constructor(props) {
    super(props);
    this.dialogRef = React.createRef();
  }

  toggleVisibility() {
    this.dialogRef.current.toggleVisibility();
  }

  render() {
    return (
      <DialogWindow className="dialogwindow--wide" ref={this.dialogRef} title="Keyboard Shortcuts">
        <div className="shortcuts-window-grid">
          {SECTIONS.map((section, i) => (
            <ShortcutsSection key={i} section={section} />
          ))}
        </div>
      </DialogWindow>
    );
  }
}
