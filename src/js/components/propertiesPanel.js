import "../../css/PropertiesPanel.css";
import React, { Component } from "react";
import DialogRow from "./dialogRow";

const NUMERIC_PROPERTIES = [
  'height', 'rotation', 'radius', 'width', 'lineWidth', 'scale', 'angle',
  'characterSpacing', 'lineSpacing', 'startAngle', 'endAngle', 'offsetFromArc',
  'offsetFromLeft', 'offsetFromRight', 'widthFactor',
];

const BOOLEAN_PROPERTIES = [
  'backwards', 'textReversed', 'upsideDown', 'bold', 'underline', 'italic',
];

const OPTION_PROPERTIES = [
  'layer', 'styleName', 'lineType', 'patternName', 'dimensionStyle',
  'textAlignment', 'textOrientation', 'arcSide', 'horizontalAlignment', 'verticalAlignment',
];

const STRING_PROPERTIES = ['string', 'textOverride'];

export default class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedType: '' };
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    const types = this.getItemTypes();
    this.setState({ selectedType: types.length === 1 ? types[0] : '' });
  }

  getItemTypes() {
    try {
      return this.props.core.propertyManager.getItemTypes() || [];
    } catch {
      return [];
    }
  }

  getItemProperties(type) {
    try {
      return this.props.core.propertyManager.getItemProperties(type) || [];
    } catch {
      return [];
    }
  }

  getItemPropertyValue(type, property) {
    try {
      return this.props.core.propertyManager.getItemPropertyValue(type, property);
    } catch {
      return '';
    }
  }

  onValueChanged(property, value) {
    const { selectedType } = this.state;
    try {
      this.props.core.propertyManager.setItemProperties(property, value, selectedType);
      this.forceUpdate();
    } catch {
      // property update failed
    }
  }

  formatDisplayName(name) {
    let formatted = name.charAt(0).toUpperCase() + name.slice(1);
    formatted = formatted.split(/(?=[A-Z])/).join(' ');
    return formatted;
  }

  getModel(property) {
    const { core } = this.props;
    try {
      switch (property) {
      case 'layer':
        return core.layerManager.getItems().map(l => ({ display: l.name, value: l.name }));
      case 'styleName':
        return core.styleManager.getItems().map(s => ({ display: s.name, value: s.name }));
      case 'dimensionStyle':
        return core.dimStyleManager.getItems().map(s => ({ display: s.name, value: s.name }));
      case 'lineType':
        return core.ltypeManager.getItems()
          .filter(s => !['BYLAYER', 'BYBLOCK'].includes(s.name.toUpperCase()))
          .map(s => ({ display: s.name, value: s.name }));
      case 'horizontalAlignment':
        return [{ display: 'Left', value: 0 }, { display: 'Center', value: 1 }, { display: 'Right', value: 2 }];
      case 'verticalAlignment':
        return [{ display: 'Baseline', value: 0 }, { display: 'Bottom', value: 1 }, { display: 'Middle', value: 2 }, { display: 'Top', value: 3 }];
      case 'textAlignment':
        return [{ display: 'Fit', value: 1 }, { display: 'Left', value: 2 }, { display: 'Right', value: 3 }, { display: 'Center', value: 4 }];
      case 'textOrientation':
        return [{ display: 'Outward', value: 1 }, { display: 'Inward', value: 2 }];
      case 'arcSide':
        return [{ display: 'Convex', value: 1 }, { display: 'Concave', value: 2 }];
      default:
        return [];
      }
    } catch {
      return [];
    }
  }

  renderInput(property, value) {
    if (property === 'colour') {
      return null;
    }

    if (NUMERIC_PROPERTIES.includes(property)) {
      return (
        <input
          className="properties-input properties-input--number"
          defaultValue={value}
          key={`${property}-${value}`}
          onBlur={(e) => this.onValueChanged(property, Number(e.target.value))}
          onKeyDown={(e) => { if (e.key === 'Enter') this.onValueChanged(property, Number(e.target.value)); }}
          type="number"
        />
      );
    }

    if (BOOLEAN_PROPERTIES.includes(property)) {
      return (
        <label className="switch">
          <input
            defaultChecked={value}
            key={`${property}-${value}`}
            onChange={(e) => this.onValueChanged(property, e.target.checked)}
            type="checkbox"
          />
          <span className="slider round" />
        </label>
      );
    }

    if (OPTION_PROPERTIES.includes(property)) {
      let model = this.getModel(property);
      if (String(value).toUpperCase() === 'VARIES') {
        model = [{ display: 'Varies', value: 'VARIES' }, ...model];
      }
      const selectedIndex = model.findIndex(item => item.value === value);
      return (
        <select
          className="properties-input properties-input--select"
          defaultValue={selectedIndex >= 0 ? value : ''}
          key={`${property}-${value}`}
          onChange={(e) => {
            const item = model.find(m => String(m.value) === e.target.value);
            if (item && item.value !== 'VARIES') {
              this.onValueChanged(property, item.value);
            }
          }}
        >
          {model.map(item => (
            <option key={item.value} value={item.value}>{item.display}</option>
          ))}
        </select>
      );
    }

    if (STRING_PROPERTIES.includes(property)) {
      return (
        <input
          className="properties-input properties-input--text"
          defaultValue={value}
          key={`${property}-${value}`}
          onBlur={(e) => this.onValueChanged(property, e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') this.onValueChanged(property, e.target.value); }}
          type="text"
        />
      );
    }

    // Read-only fallback
    return <span className="properties-value-readonly">{String(value)}</span>;
  }

  renderProperties() {
    const { selectedType } = this.state;
    if (!selectedType) return null;

    const properties = this.getItemProperties(selectedType);
    if (!properties.length) return null;

    return properties
      .filter(p => p !== 'colour')
      .map(property => {
        const value = this.getItemPropertyValue(selectedType, property);
        const input = this.renderInput(property, value);
        if (input === null) return null;
        return (
          <DialogRow key={property} label={this.formatDisplayName(property)} variant="form">
            {input}
          </DialogRow>
        );
      });
  }

  render() {
    const types = this.getItemTypes();

    if (!types.length) {
      return (
        <div className="properties-empty">
          <p>No items selected</p>
        </div>
      );
    }

    const { selectedType } = this.state;

    return (
      <div className="properties-panel">
        {types.length > 1 && (
          <div className="properties-type-selector">
            <select
              className="properties-input properties-input--select properties-type-select"
              onChange={(e) => this.setState({ selectedType: e.target.value })}
              value={selectedType}
            >
              <option value="">All</option>
              {types.filter(type => !!type).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
        <div className="properties-list">
          {this.renderProperties()}
        </div>
      </div>
    );
  }
}
