import { act, render, fireEvent } from '@testing-library/react';
import React from 'react';

jest.mock('@design-core/core/canvasRenderer.js', () => ({ CanvasRenderer: class MockCanvasRenderer {} }));

import Canvas from '../js/components/canvas';
import { CanvasRenderer } from '@design-core/core/canvasRenderer.js';

// paint() accesses cr.canvas.width which jest-canvas-mock does not wire in jsdom.
// Stub it out so lifecycle tests are not coupled to rendering internals.
beforeEach(() => {
  jest.spyOn(Canvas.prototype, 'paint').mockImplementation(function () {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

function makeCore() {
  return {
    canvas: {
      setRenderer: jest.fn(),
      setExternalPaintCallbackFunction: jest.fn(),
      setCursorCallbackFunction: jest.fn(),
      paint: jest.fn(),
      zoomExtents: jest.fn(),
    },
    mouse: {
      mouseMoved: jest.fn(),
      mouseDown: jest.fn(),
      mouseUp: jest.fn(),
      wheel: jest.fn(),
      positionString: jest.fn(() => '0, 0'),
    },
    commandLine: { handleKeys: jest.fn() },
    scene: {
      inputManager: {
        activeCommand: undefined,
        onCommand: jest.fn(),
        snapping: { setSnapOverride: jest.fn() },
      },
      selectionManager: { selectedItems: [], selectAll: jest.fn() },
      undo: jest.fn(),
      redo: jest.fn(),
    },
    clipboard: { isValid: false },
    settings: { getSetting: jest.fn(() => false), setSetting: jest.fn() },
  };
}

function defaultProps(core, overrides = {}) {
  return { core, mousePosCallback: jest.fn(), ...overrides };
}

// ─── componentDidMount ────────────────────────────────────────────────────────

describe('Canvas — componentDidMount', () => {
  test('calls setRenderer(CanvasRenderer) on mount', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    expect(core.canvas.setRenderer).toHaveBeenCalledWith(CanvasRenderer);
  });

  test('calls setExternalPaintCallbackFunction with a function on mount', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    expect(core.canvas.setExternalPaintCallbackFunction).toHaveBeenCalledWith(expect.any(Function));
  });

  test('calls setCursorCallbackFunction with a function on mount', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    expect(core.canvas.setCursorCallbackFunction).toHaveBeenCalledWith(expect.any(Function));
  });
});

// ─── componentWillUnmount ─────────────────────────────────────────────────────

describe('Canvas — componentWillUnmount', () => {
  test('clears paint callback on unmount', () => {
    const core = makeCore();
    const { unmount } = render(<Canvas {...defaultProps(core)} />);
    core.canvas.setExternalPaintCallbackFunction.mockClear();
    unmount();
    expect(core.canvas.setExternalPaintCallbackFunction).toHaveBeenCalledWith(undefined);
  });

  test('clears cursor callback on unmount', () => {
    const core = makeCore();
    const { unmount } = render(<Canvas {...defaultProps(core)} />);
    core.canvas.setCursorCallbackFunction.mockClear();
    unmount();
    expect(core.canvas.setCursorCallbackFunction).toHaveBeenCalledWith(undefined);
  });
});

// ─── componentDidUpdate — core swap ──────────────────────────────────────────

describe('Canvas — core swap', () => {
  test('clears paint callback on old core', () => {
    const core1 = makeCore();
    const core2 = makeCore();
    const { rerender } = render(<Canvas {...defaultProps(core1)} />);
    core1.canvas.setExternalPaintCallbackFunction.mockClear();
    act(() => rerender(<Canvas {...defaultProps(core2)} />));
    expect(core1.canvas.setExternalPaintCallbackFunction).toHaveBeenCalledWith(undefined);
  });

  test('clears cursor callback on old core', () => {
    const core1 = makeCore();
    const core2 = makeCore();
    const { rerender } = render(<Canvas {...defaultProps(core1)} />);
    core1.canvas.setCursorCallbackFunction.mockClear();
    act(() => rerender(<Canvas {...defaultProps(core2)} />));
    expect(core1.canvas.setCursorCallbackFunction).toHaveBeenCalledWith(undefined);
  });

  test('sets renderer to null on old core', () => {
    const core1 = makeCore();
    const core2 = makeCore();
    const { rerender } = render(<Canvas {...defaultProps(core1)} />);
    core1.canvas.setRenderer.mockClear();
    act(() => rerender(<Canvas {...defaultProps(core2)} />));
    expect(core1.canvas.setRenderer).toHaveBeenCalledWith(null);
  });

  test('sets CanvasRenderer on new core', () => {
    const core1 = makeCore();
    const core2 = makeCore();
    const { rerender } = render(<Canvas {...defaultProps(core1)} />);
    act(() => rerender(<Canvas {...defaultProps(core2)} />));
    expect(core2.canvas.setRenderer).toHaveBeenCalledWith(CanvasRenderer);
  });

  test('wires paint callback on new core', () => {
    const core1 = makeCore();
    const core2 = makeCore();
    const { rerender } = render(<Canvas {...defaultProps(core1)} />);
    act(() => rerender(<Canvas {...defaultProps(core2)} />));
    const calls = core2.canvas.setExternalPaintCallbackFunction.mock.calls;
    const wiredCall = calls.find(([fn]) => fn !== undefined);
    expect(wiredCall).toBeDefined();
    expect(typeof wiredCall[0]).toBe('function');
  });

  test('wires cursor callback on new core', () => {
    const core1 = makeCore();
    const core2 = makeCore();
    const { rerender } = render(<Canvas {...defaultProps(core1)} />);
    act(() => rerender(<Canvas {...defaultProps(core2)} />));
    const calls = core2.canvas.setCursorCallbackFunction.mock.calls;
    const wiredCall = calls.find(([fn]) => fn !== undefined);
    expect(wiredCall).toBeDefined();
  });

  test('passes the same boundPaint reference before and after core swap', () => {
    const core1 = makeCore();
    const core2 = makeCore();
    const { rerender } = render(<Canvas {...defaultProps(core1)} />);
    const paintBefore = core1.canvas.setExternalPaintCallbackFunction.mock.calls[0][0];
    act(() => rerender(<Canvas {...defaultProps(core2)} />));
    const paintAfter = core2.canvas.setExternalPaintCallbackFunction.mock.calls.find(
      ([fn]) => fn !== undefined,
    )[0];
    expect(paintAfter).toBe(paintBefore);
  });

  test('does not re-wire when same core prop is re-rendered', () => {
    const core = makeCore();
    const { rerender } = render(<Canvas {...defaultProps(core)} />);
    core.canvas.setRenderer.mockClear();
    core.canvas.setExternalPaintCallbackFunction.mockClear();
    act(() => rerender(<Canvas {...defaultProps(core)} mousePosCallback={jest.fn()} />));
    expect(core.canvas.setRenderer).not.toHaveBeenCalled();
    expect(core.canvas.setExternalPaintCallbackFunction).not.toHaveBeenCalled();
  });
});

// ─── mouse events ─────────────────────────────────────────────────────────────

describe('Canvas — mouse events', () => {
  test('mouseDown calls core.mouse.mouseDown for left button', () => {
    const core = makeCore();
    const { container } = render(<Canvas {...defaultProps(core)} />);
    const canvas = container.querySelector('canvas');
    fireEvent.mouseDown(canvas, { button: 0 });
    expect(core.mouse.mouseDown).toHaveBeenCalledWith(0);
  });

  test('mouseDown does not call core.mouse.mouseDown for right button', () => {
    const core = makeCore();
    const { container } = render(<Canvas {...defaultProps(core)} />);
    fireEvent.mouseDown(container.querySelector('canvas'), { button: 2 });
    expect(core.mouse.mouseDown).not.toHaveBeenCalled();
  });

  test('mouseUp calls core.mouse.mouseUp for left button', () => {
    const core = makeCore();
    const { container } = render(<Canvas {...defaultProps(core)} />);
    fireEvent.mouseUp(container.querySelector('canvas'), { button: 0 });
    expect(core.mouse.mouseUp).toHaveBeenCalledWith(0);
  });

  test('mouseUp does not call core.mouse.mouseUp for right button', () => {
    const core = makeCore();
    const { container } = render(<Canvas {...defaultProps(core)} />);
    fireEvent.mouseUp(container.querySelector('canvas'), { button: 2 });
    expect(core.mouse.mouseUp).not.toHaveBeenCalled();
  });

  test('wheel calls core.mouse.wheel with +1 for scroll up', () => {
    const core = makeCore();
    const { container } = render(<Canvas {...defaultProps(core)} />);
    fireEvent.wheel(container.querySelector('canvas'), { deltaY: -100 });
    expect(core.mouse.wheel).toHaveBeenCalledWith(1);
  });

  test('wheel calls core.mouse.wheel with -1 for scroll down', () => {
    const core = makeCore();
    const { container } = render(<Canvas {...defaultProps(core)} />);
    fireEvent.wheel(container.querySelector('canvas'), { deltaY: 100 });
    expect(core.mouse.wheel).toHaveBeenCalledWith(-1);
  });

  test('mouseMove calls core.mouse.mouseMoved and mousePosCallback', () => {
    const core = makeCore();
    const mousePosCallback = jest.fn();
    const { container } = render(<Canvas {...defaultProps(core, { mousePosCallback })} />);
    fireEvent.mouseMove(container.querySelector('canvas'), { clientX: 10, clientY: 20 });
    expect(core.mouse.mouseMoved).toHaveBeenCalled();
    expect(mousePosCallback).toHaveBeenCalled();
  });
});

// ─── keyboard shortcuts ───────────────────────────────────────────────────────

describe('Canvas — keyboard shortcuts', () => {
  test('Enter key calls commandLine.handleKeys("Enter")', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(core.commandLine.handleKeys).toHaveBeenCalledWith('Enter');
  });

  test('Escape key calls commandLine.handleKeys("Escape")', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(core.commandLine.handleKeys).toHaveBeenCalledWith('Escape');
  });

  test('Ctrl+Z calls scene.undo', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
    expect(core.scene.undo).toHaveBeenCalled();
  });

  test('Ctrl+Y calls scene.redo', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    fireEvent.keyDown(document, { key: 'y', ctrlKey: true });
    expect(core.scene.redo).toHaveBeenCalled();
  });

  test('Ctrl+A calls selectionManager.selectAll', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    expect(core.scene.selectionManager.selectAll).toHaveBeenCalled();
  });

  test('Ctrl+S calls onSave prop', () => {
    const core = makeCore();
    const onSave = jest.fn();
    render(<Canvas {...defaultProps(core, { onSave })} />);
    fireEvent.keyDown(document, { key: 's', ctrlKey: true });
    expect(onSave).toHaveBeenCalled();
  });

  test('Ctrl+Shift+S calls onSaveAs prop', () => {
    const core = makeCore();
    const onSaveAs = jest.fn();
    render(<Canvas {...defaultProps(core, { onSaveAs })} />);
    fireEvent.keyDown(document, { key: 's', ctrlKey: true, shiftKey: true });
    expect(onSaveAs).toHaveBeenCalled();
  });

  test('printable character is forwarded to commandLine.handleKeys', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    fireEvent.keyDown(document, { key: 'l' });
    expect(core.commandLine.handleKeys).toHaveBeenCalledWith('l');
  });

  test('key events on INPUT elements are ignored', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    const input = document.createElement('input');
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: 'z', ctrlKey: true, target: input });
    expect(core.scene.undo).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  test('Alt key combinations are ignored', () => {
    const core = makeCore();
    render(<Canvas {...defaultProps(core)} />);
    fireEvent.keyDown(document, { key: 'z', altKey: true });
    expect(core.scene.undo).not.toHaveBeenCalled();
    expect(core.commandLine.handleKeys).not.toHaveBeenCalled();
  });

  test('keydown listener is removed on unmount', () => {
    const core = makeCore();
    const { unmount } = render(<Canvas {...defaultProps(core)} />);
    unmount();
    core.scene.undo.mockClear();
    fireEvent.keyDown(document, { key: 'z', ctrlKey: true });
    expect(core.scene.undo).not.toHaveBeenCalled();
  });
});
