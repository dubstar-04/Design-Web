import "../../css/LayersWindow.css";
import React, { Component } from "react";
import DialogWindow from "./dialogWindow";
import DialogRow from "./dialogRow";

export default class LayersWindow extends Component {
  constructor(props) {
    super(props);
    
    this.baseWindowRef = React.createRef();
  }

  toggleVisibility(){ 
    this.baseWindowRef.current.toggleVisibility()
  }

  close(){
    this.baseWindowRef.current.close()
  }

  getStyles(){
    return this.props.core.layerManager.getItems()
  }

  render() {
    return (<DialogWindow ref={this.baseWindowRef} title="Layers">
      <div className="dialoglist"> 
        {this.getStyles().map((layer, index) =>
              ( <DialogRow
                active={layer.on} colour={layer.colour} key={index}
                title={layer.name}
                />
              )
          )}
      </div>
    </DialogWindow>
    )
  }
}
