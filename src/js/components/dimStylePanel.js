import React, { Component } from "react";
import ConfirmationDialog from "./confirmationDialog";
import DialogRow from "./dialogRow";
import Switch from "./switch";
import { SideKickContent, SideKickEdit } from "./sideKick";

const TEXT_POSITION_OPTIONS = [
  { value: 0, label: 'Centred' },
  { value: 1, label: 'Above' },
  { value: 2, label: 'Outside' },
  { value: 3, label: 'JIS' },
  { value: 4, label: 'Below' },
];

const TEXT_ALIGNMENT_OPTIONS = [
  { value: 0, label: 'Aligned' },
  { value: 1, label: 'Horizontal' },
];

const TEXT_JUSTIFY_OPTIONS = [
  { value: 0, label: 'Centred' },
  { value: 1, label: 'At first extension' },
  { value: 2, label: 'At second extension' },
  { value: 3, label: 'Over first extension' },
  { value: 4, label: 'Over second extension' },
];

const LINEAR_UNIT_OPTIONS = [
  { value: 1, label: 'Scientific' },
  { value: 2, label: 'Decimal' },
  { value: 3, label: 'Engineering' },
  { value: 4, label: 'Architectural' },
  { value: 5, label: 'Fractional' },
  { value: 6, label: 'Windows Desktop' },
];

const ANGULAR_UNIT_OPTIONS = [
  { value: 0, label: 'Decimal Degrees' },
  { value: 1, label: 'Degrees/Minutes/Seconds' },
  { value: 2, label: 'Gradians' },
  { value: 3, label: 'Radians' },
  { value: 4, label: "Surveyor's Units" },
];

const SEPARATOR_OPTIONS = [
  { value: '.', label: 'Period' },
  { value: ',', label: 'Comma' },
];

const GROUPS = [
  {
    title: 'Lines',
    fields: [
      { key: 'DIMSCALE', label: 'Scale', type: 'number' },
      { key: 'DIMDLI', label: 'Baseline Spacing', type: 'number' },
      { key: 'DIMEXO', label: 'Extension Offset', type: 'number' },
      { key: 'DIMEXE', label: 'Extension Beyond', type: 'number' },
      { key: 'DIMSE1', label: 'Suppress Ext 1', type: 'bool' },
      { key: 'DIMSE2', label: 'Suppress Ext 2', type: 'bool' },
    ],
  },
  {
    title: 'Arrows',
    fields: [
      { key: 'DIMASZ', label: 'Arrow Size', type: 'number' },
      { key: 'DIMCEN', label: 'Centre Mark', type: 'number' },
      { key: 'DIMTOFL', label: 'Force Line Inside', type: 'bool' },
    ],
  },
  {
    title: 'Text',
    fields: [
      { key: 'DIMTXSTY', label: 'Text Style', type: 'textstyle' },
      { key: 'DIMTXT', label: 'Text Height', type: 'number' },
      { key: 'DIMGAP', label: 'Text Gap', type: 'number' },
      { key: 'DIMTAD', label: 'Vertical Position', type: 'select', options: TEXT_POSITION_OPTIONS },
      { key: 'DIMJUST', label: 'Horizontal Position', type: 'select', options: TEXT_JUSTIFY_OPTIONS },
      { key: 'DIMTIH', label: 'Text Inside', type: 'select', options: TEXT_ALIGNMENT_OPTIONS },
      { key: 'DIMTOH', label: 'Text Outside', type: 'select', options: TEXT_ALIGNMENT_OPTIONS },
    ],
  },
  {
    title: 'Units',
    fields: [
      { key: 'DIMLUNIT', label: 'Linear Units', type: 'select', options: LINEAR_UNIT_OPTIONS },
      { key: 'DIMDEC', label: 'Linear Precision', type: 'number', integer: true },
      { key: 'DIMAUNIT', label: 'Angular Units', type: 'select', options: ANGULAR_UNIT_OPTIONS },
      { key: 'DIMADEC', label: 'Angular Precision', type: 'number', integer: true },
      { key: 'DIMDSEP', label: 'Decimal Separator', type: 'select', options: SEPARATOR_OPTIONS },
    ],
  },
];

export default class DimStylePanel extends Component {
  constructor(props) {
    super(props);
    this.confirmDialogRef = React.createRef();
    this.state = this.getInitialState();
  }

  // Only in-progress edits are buffered; the selected style is resolved from the active manager on render.
  getInitialState() {
    return {
      selectedName: null,
      confirmDeleteName: null,
      editName: null,
      editValues: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.core !== this.props.core || prevProps.revision !== this.props.revision) {
      this.setState(this.getInitialState());
    }
  }

  getSelectedStyle() {
    const styles = this.getStyles();
    const current = this.getCurrentStyle();
    return styles.find(s => s.name === this.state.selectedName) ||
      styles.find(s => s.name === current) ||
      styles[0];
  }

  getManager() {
    return this.props.core.dimStyleManager;
  }

  getStyles() {
    return this.getManager().getItems();
  }

  getCurrentStyle() {
    return this.getManager().getCstyle();
  }

  getTextStyleName(style) {
    const styles = this.props.core.styleManager.getItems();
    const reference = String(style.DIMTXSTY).toUpperCase();
    const match = style.DIMTXSTYISHANDLE ?
      styles.find(s => String(s.handle).toUpperCase() === reference) :
      styles.find(s => s.name.toUpperCase() === reference);
    return match ? match.name : styles[0]?.name;
  }

  getFieldValue(style, field) {
    if (field.type === 'textstyle') return this.getTextStyleName(style);
    return style.getValue(field.key);
  }

  onNewStyle() {
    this.getManager().newItem();
    const styles = this.getStyles();
    const newStyle = styles[styles.length - 1];
    this.setState({ selectedName: newStyle?.name ?? null, editName: null, editValues: {} });
  }

  onSelectStyle(style) {
    this.setState({ selectedName: style.name, editName: null, editValues: {} });
  }

  onSetCurrentStyle(style) {
    this.getManager().setCstyle(style.name);
    this.forceUpdate();
  }

  onConfirmDelete(style) {
    this.setState({ confirmDeleteName: style.name }, () => {
      this.confirmDialogRef.current.show();
    });
  }

  onCancelDelete() {
    this.setState({ confirmDeleteName: null });
  }

  onDeleteStyle() {
    const { confirmDeleteName } = this.state;
    if (confirmDeleteName) {
      const index = this.getManager().getItemIndex(confirmDeleteName);
      if (index >= 0) {
        this.getManager().deleteStyle(index);
        this.props.core.canvas.requestPaint();
      }
      this.setState({ confirmDeleteName: null, selectedName: null, editName: null, editValues: {} });
    }
  }

  onNameBlur() {
    const { editName } = this.state;
    const style = this.getSelectedStyle();
    if (!style || editName === null) return;
    const manager = this.getManager();
    const index = manager.getItemIndex(style.name);
    if (index >= 0) {
      manager.renameStyle(index, editName);
      this.setState({ selectedName: manager.getItemByIndex(index).name, editName: null });
    }
  }

  onEnterBlur(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  setStyleValue(key, value) {
    const style = this.getSelectedStyle();
    if (!style) return;
    style.setValue(key, value);
    this.props.core.canvas.requestPaint();
    this.forceUpdate();
  }

  onNumberBlur(field) {
    const { editValues } = this.state;
    const { [field.key]: raw, ...rest } = editValues;
    this.setState({ editValues: rest });
    if (raw === undefined) return;
    const value = field.integer ? parseInt(raw, 10) : parseFloat(raw);
    if (!isNaN(value)) this.setStyleValue(field.key, value);
  }

  onSelectChange(field, raw) {
    const sample = field.options[0].value;
    this.setStyleValue(field.key, typeof sample === 'number' ? Number(raw) : raw);
  }

  onTextStyleChange(name) {
    this.setStyleValue('DIMTXSTY', name);
  }

  renderField(field) {
    const { editValues } = this.state;
    const selectedStyle = this.getSelectedStyle();
    const value = this.getFieldValue(selectedStyle, field);
    let suffix;

    if (field.type === 'bool') {
      suffix = <Switch checked={!!value} onChange={e => this.setStyleValue(field.key, e.target.checked)} />;
    } else if (field.type === 'number') {
      suffix = (
        <input
          className="dialogrow-input dialogrow-input--number"
          onBlur={() => this.onNumberBlur(field)}
          onChange={e => this.setState({ editValues: { ...editValues, [field.key]: e.target.value } })}
          onKeyDown={this.onEnterBlur.bind(this)}
          step={field.integer ? '1' : '0.1'}
          type="number"
          value={editValues[field.key] ?? value}
        />
      );
    } else {
      const options = field.type === 'textstyle' ?
        this.props.core.styleManager.getItems().map(s => ({ value: s.name, label: s.name })) :
        field.options;
      const known = options.some(o => o.value === value);
      suffix = (
        <select
          className="dialogrow-input dialogrow-input--select"
          onChange={e => field.type === 'textstyle' ? this.onTextStyleChange(e.target.value) : this.onSelectChange(field, e.target.value)}
          value={known ? value : options[0]?.value}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    return (
      <DialogRow
        key={field.key}
        label={field.label}
        suffix={suffix}
        variant="form"
      />
    );
  }

  renderEditPanel() {
    const { editName } = this.state;
    const selectedStyle = this.getSelectedStyle();
    const currentStyle = this.getCurrentStyle();
    const indelibleStyles = this.getManager().indelibleItems;
    const isIndelible = !selectedStyle || indelibleStyles.some(i => i.toUpperCase() === selectedStyle.name.toUpperCase());

    return (
      <SideKickEdit
        title="Dimension Style Properties"
        toolbar={
          <>
            <button className="panel-add-btn" onClick={this.onNewStyle.bind(this)} title="New Dimension Style">+</button>
            <button
              className="panel-delete-btn"
              disabled={!selectedStyle || isIndelible}
              onClick={() => this.onConfirmDelete(selectedStyle)}
              title="Delete Selected Dimension Style"
            >−</button>
            <button
              className="panel-setcurrent-btn"
              disabled={!selectedStyle || selectedStyle.name === currentStyle}
              onClick={() => this.onSetCurrentStyle(selectedStyle)}
              title="Set as Current Dimension Style"
            >✓</button>
          </>
        }
      >
        <div className="sidekick-row-group">
          <DialogRow
            label="Name"
            suffix={
              <input
                className="dialogrow-input dialogrow-input--text"
                onBlur={this.onNameBlur.bind(this)}
                onChange={e => this.setState({ editName: e.target.value })}
                onKeyDown={this.onEnterBlur.bind(this)}
                type="text"
                value={editName ?? selectedStyle?.name ?? ''}
              />
            }
            variant="form"
          />
        </div>
        {selectedStyle && GROUPS.map(group => (
          <React.Fragment key={group.title}>
            <div className="settings-group-header">{group.title}</div>
            <div className="sidekick-row-group">
              {group.fields.map(field => this.renderField(field))}
            </div>
          </React.Fragment>
        ))}
      </SideKickEdit>
    );
  }

  render() {
    const styles = this.getStyles();
    const currentStyle = this.getCurrentStyle();
    const { confirmDeleteName } = this.state;
    const selectedStyle = this.getSelectedStyle();

    return (
      <div className="sidekick-content-panel">
        <SideKickContent>
          <div className="sidekick-content-list">
            {styles.map((style, index) => (
              <DialogRow
                isCurrent={style.name === selectedStyle?.name}
                key={index}
                label={style.name}
                onClick={() => this.onSelectStyle(style)}
                suffix={style.name === currentStyle ? <span className="dialogrow-badge">current</span> : undefined}
              />
            ))}
          </div>
        </SideKickContent>
        {this.renderEditPanel()}
        <ConfirmationDialog
          cancelLabel="Cancel"
          confirmLabel="Delete"
          message={confirmDeleteName ? `Delete dimension style "${confirmDeleteName}"? Dimensions using it will also be deleted.` : ''}
          onCancel={this.onCancelDelete.bind(this)}
          onConfirm={this.onDeleteStyle.bind(this)}
          ref={this.confirmDialogRef}
          title="Delete Dimension Style"
        />
      </div>
    );
  }
}
