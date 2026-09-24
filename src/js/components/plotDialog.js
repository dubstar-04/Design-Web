import "../../css/Dialog.css";
import "../../css/PlotDialog.css";
import React, { Component } from "react";
import DialogWindow from "./dialogWindow";
import DialogRow from "./dialogRow";
import { saveAs } from "file-saver";

import { DesignCore } from "@design-core/core/designCore.js";
import { Constants } from "@design-core/core/constants.js";
import { PlotOptions } from "@design-core/core/plotOptions.js";
import { RendererBase } from "@design-core/core/rendererBase.js";
import { SvgRenderer } from "@design-core/core/svgRenderer.js";
import { PdfRenderer } from "@design-core/core/pdfRenderer.js";

const PAGE_SIZE_NAMES = Object.keys(Constants.PageSizes);

const ORIENTATIONS = ['Portrait', 'Landscape'];

const PLOT_AREAS = ['Extents', 'Display', 'Window'];

// PDF points per drawing unit (drawing units are assumed to be millimetres)
const MM_TO_POINTS = 72 / 25.4;

// value = null means "Fit to page"
const SCALE_OPTIONS = [
  { label: 'Fit', value: null },
  { label: '1:1', value: MM_TO_POINTS },
  { label: '1:2', value: MM_TO_POINTS * 0.5 },
  { label: '1:5', value: MM_TO_POINTS * 0.2 },
  { label: '1:10', value: MM_TO_POINTS * 0.1 },
  { label: '2:1', value: MM_TO_POINTS * 2 },
  { label: '5:1', value: MM_TO_POINTS * 5 },
];

const STYLE_OPTIONS = [
  { label: 'None', value: RendererBase.Styles.NONE },
  { label: 'Monochrome', value: RendererBase.Styles.MONOCHROME },
  { label: 'Greyscale', value: RendererBase.Styles.GREYSCALE },
];

const FILE_TYPE_OPTIONS = [
  { label: 'PDF', value: 'pdf' },
  { label: 'SVG', value: 'svg' },
];

export default class PlotDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageSizeIndex: 0,
      // default to Landscape, matching the desktop app
      orientationIndex: 1,
      plotAreaIndex: 0,
      plotScaleIndex: 0,
      plotStyleIndex: 0,
      fileTypeIndex: 0,
    };
    this.windowArea = null;
    this.dialogRef = React.createRef();
  }

  show(currentFilename) {
    this.currentFilename = currentFilename;
    this.windowArea = null;
    this.setState({
      pageSizeIndex: 0,
      orientationIndex: 1,
      plotAreaIndex: 0,
      plotScaleIndex: 0,
      plotStyleIndex: 0,
      fileTypeIndex: 0,
    }, () => this.dialogRef.current.toggleVisibility());
  }

  close() {
    this.dialogRef.current.close();
  }

  /**
   * Handle plot area changes.
   * When "Window" is selected, hide the dialog and let the user pick two
   * corners on the canvas, then restore the dialog.
   * @param {number} index
   */
  async onPlotAreaChange(index) {
    this.setState({ plotAreaIndex: index });
    if (index !== 2) {
      this.windowArea = null;
      return;
    }

    this.close();

    const inputManager = DesignCore.Scene.inputManager;
    inputManager.reset();

    const tool = DesignCore.CommandManager.createNew('WindowPick');
    inputManager.activeCommand = tool;
    await tool.execute();

    if (tool.points.length === 2) {
      this.windowArea = { point1: tool.points[0], point2: tool.points[1] };
    } else {
      // picking was cancelled - fall back to Extents
      this.windowArea = null;
      this.setState({ plotAreaIndex: 0 });
    }

    // Re-showing the dialog can steal the pointer grab mid-click before the canvas
    // sees a mouseUp; inputManager.reset() clears any state that leaves stuck
    inputManager.reset();

    this.dialogRef.current.toggleVisibility();
  }

  /** Build a PlotOptions instance from the current selections. */
  buildOptions() {
    const sizeName = PAGE_SIZE_NAMES[this.state.pageSizeIndex];
    const pageSize = Constants.PageSizes[sizeName];
    const isLandscape = this.state.orientationIndex === 1;

    const pageWidth = isLandscape ? pageSize.height : pageSize.width;
    const pageHeight = isLandscape ? pageSize.width : pageSize.height;

    const plotScale = SCALE_OPTIONS[this.state.plotScaleIndex]?.value ?? null;

    let plotArea = PlotOptions.Area.EXTENTS;
    if (this.state.plotAreaIndex === 1) plotArea = PlotOptions.Area.DISPLAY;
    if (this.state.plotAreaIndex === 2) plotArea = PlotOptions.Area.WINDOW;

    const style = STYLE_OPTIONS[this.state.plotStyleIndex]?.value ?? RendererBase.Styles.NONE;
    const fileType = FILE_TYPE_OPTIONS[this.state.fileTypeIndex]?.value ?? 'pdf';

    const options = new PlotOptions(pageWidth, pageHeight);
    options.setOption('plotScale', plotScale);
    options.setOption('plotArea', plotArea);
    options.setOption('windowArea', plotArea === PlotOptions.Area.WINDOW ? this.windowArea : null);
    // a precisely picked window shouldn't get the default page margin shrinking it further
    options.setOption('margin', plotArea === PlotOptions.Area.WINDOW ? 0 : 40);
    options.setOption('style', style);
    options.setOption('fileType', fileType);

    return options;
  }

  handleExport() {
    const { core } = this.props;

    if (this.state.plotAreaIndex === 2 && !this.windowArea) {
      core.notify('Specify a plot window first');
      return;
    }

    const options = this.buildOptions();
    const isSvg = options.fileType === 'svg';
    const renderer = isSvg ? new SvgRenderer(options.pageWidth, options.pageHeight) : new PdfRenderer(options.pageWidth, options.pageHeight);
    renderer.setStyle(options.style);

    const exported = core.canvas.exportTo(renderer, options);
    if (!exported) {
      core.notify('Nothing to export');
      return;
    }

    const blob = new Blob([renderer.getOutput()], { type: isSvg ? 'image/svg+xml' : 'application/pdf' });
    saveAs(blob, `${this.currentFilename || 'design'}.${options.fileType}`);
    core.notify(isSvg ? 'SVG Exported' : 'PDF Exported');
    this.close();
  }

  render() {
    const { pageSizeIndex, orientationIndex, plotAreaIndex, plotScaleIndex, plotStyleIndex, fileTypeIndex } = this.state;

    return (
      <DialogWindow ref={this.dialogRef} title="Plot">
        <div className="dialog">
          <div className="plotdialog-rows">
            <DialogRow
              label="Page Size"
              suffix={
                <select
                  className="dialogrow-input dialogrow-input--select"
                  onChange={(e) => this.setState({ pageSizeIndex: Number(e.target.value) })}
                  value={pageSizeIndex}
                >
                  {PAGE_SIZE_NAMES.map((name, i) => <option key={name} value={i}>{name}</option>)}
                </select>
              }
              variant="form"
            />
            <DialogRow
              label="Orientation"
              suffix={
                <select
                  className="dialogrow-input dialogrow-input--select"
                  onChange={(e) => this.setState({ orientationIndex: Number(e.target.value) })}
                  value={orientationIndex}
                >
                  {ORIENTATIONS.map((name, i) => <option key={name} value={i}>{name}</option>)}
                </select>
              }
              variant="form"
            />
            <DialogRow
              label="Plot Area"
              suffix={
                <select
                  className="dialogrow-input dialogrow-input--select"
                  onChange={(e) => this.onPlotAreaChange(Number(e.target.value))}
                  value={plotAreaIndex}
                >
                  {PLOT_AREAS.map((name, i) => <option key={name} value={i}>{name}</option>)}
                </select>
              }
              variant="form"
            />
            <DialogRow
              label="Scale"
              suffix={
                <select
                  className="dialogrow-input dialogrow-input--select"
                  onChange={(e) => this.setState({ plotScaleIndex: Number(e.target.value) })}
                  value={plotScaleIndex}
                >
                  {SCALE_OPTIONS.map((opt, i) => <option key={opt.label} value={i}>{opt.label}</option>)}
                </select>
              }
              variant="form"
            />
            <DialogRow
              label="Style"
              suffix={
                <select
                  className="dialogrow-input dialogrow-input--select"
                  onChange={(e) => this.setState({ plotStyleIndex: Number(e.target.value) })}
                  value={plotStyleIndex}
                >
                  {STYLE_OPTIONS.map((opt, i) => <option key={opt.label} value={i}>{opt.label}</option>)}
                </select>
              }
              variant="form"
            />
            <DialogRow
              label="File Type"
              suffix={
                <select
                  className="dialogrow-input dialogrow-input--select"
                  onChange={(e) => this.setState({ fileTypeIndex: Number(e.target.value) })}
                  value={fileTypeIndex}
                >
                  {FILE_TYPE_OPTIONS.map((opt, i) => <option key={opt.label} value={i}>{opt.label}</option>)}
                </select>
              }
              variant="form"
            />
          </div>
          <div className="dialog-buttons">
            <button className="dialog-btn dialog-cancel-btn" onClick={this.close.bind(this)} type="button">Cancel</button>
            <button className="dialog-btn dialog-action-btn dialog-action-btn--save" onClick={this.handleExport.bind(this)} type="button">Export</button>
          </div>
        </div>
      </DialogWindow>
    );
  }
}
