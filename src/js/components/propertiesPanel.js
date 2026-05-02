import React, { Component } from "react";
import DialogRow from "./dialogRow";
import { SideKickContent } from "./sideKick";
import { Property } from '@design-core/core/property.js';

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
    this.setState({ selectedType: types.length ? types[0] : '' });
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

  getItemPropertyDefinition(type, property) {
    try {
      return this.props.core.propertyManager.getItemPropertyDefinition(type, property);
    } catch {
      return undefined;
    }
  }

  renderInput(property, value, definition) {
    switch (definition?.type) {
    case Property.Type.NUMBER:
      return (
        <input
          className="dialogrow-input dialogrow-input--number"
          defaultValue={value}
          key={`${property}-${value}`}
          onBlur={(e) => this.onValueChanged(property, Number(e.target.value))}
          onKeyDown={(e) => { if (e.key === 'Enter') { this.onValueChanged(property, Number(e.target.value)); e.target.blur(); } }}
          type="number"
        />
      );

    case Property.Type.BOOLEAN:
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

    case Property.Type.LIST: {
      let options = definition.options?.() ?? [];
      if (String(value).toUpperCase() === 'VARIES') {
        options = [{ display: 'Varies', value: 'VARIES' }, ...options];
      }
      return (
        <select
          className="dialogrow-input dialogrow-input--select"
          defaultValue={value}
          key={`${property}-${value}`}
          onChange={(e) => {
            const item = options.find(m => String(m.value) === e.target.value);
            if (item && item.value !== 'VARIES') {
              this.onValueChanged(property, item.value);
            }
            e.target.blur();
          }}
        >
          {options.map(item => (
            <option key={item.value} value={item.value}>{item.display}</option>
          ))}
        </select>
      );
    }

    case Property.Type.STRING:
      return (
        <input
          className="dialogrow-input dialogrow-input--text"
          defaultValue={value}
          key={`${property}-${value}`}
          onBlur={(e) => this.onValueChanged(property, e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { this.onValueChanged(property, e.target.value); e.target.blur(); } }}
          type="text"
        />
      );

    case Property.Type.COLOUR:
    case Property.Type.ENTITIES:
      return null;

    case Property.Type.LABEL:
    default:
      return <span className="dialogrow-value-readonly">{String(value)}</span>;
    }
  }

  renderProperties() {
    const { selectedType } = this.state;
    if (!selectedType) return null;

    const properties = this.getItemProperties(selectedType);
    if (!properties.length) return null;

    return properties.map(property => {
      const value = this.getItemPropertyValue(selectedType, property);
      const definition = this.getItemPropertyDefinition(selectedType, property);
      const input = this.renderInput(property, value, definition);
      if (input === null) return null;
      return (
        <DialogRow
          key={property}
          label={this.formatDisplayName(property)}
          suffix={input}
          variant="form"
        />
      );
    });
  }

  render() {
    const types = this.getItemTypes();

    if (!types.length) {
      return (
        <div className="panel-empty">
          <p>No items selected</p>
        </div>
      );
    }

    const { selectedType } = this.state;

    return (
      <SideKickContent>
        {types.length > 1 && (
          <div className="panel-filter">
            <span className="panel-filter-label">Filter</span>
            <select
              className="dialogrow-input dialogrow-input--select dialogrow-input--fill"
              onChange={(e) => { this.setState({ selectedType: e.target.value }); e.target.blur(); }}
              value={selectedType}
            >
              {types.filter(type => !!type).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
        <div className="sidekick-content-list">
          <div className="sidekick-row-group">
            {this.renderProperties()}
          </div>
        </div>
      </SideKickContent>
    );
  }
}
