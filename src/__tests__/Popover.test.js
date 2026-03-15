import { act, render, screen } from '@testing-library/react';
import React from 'react';
import Popover from '../js/components/popover';

test('does not render children when initially closed', () => {
  render(<Popover><span>menu item</span></Popover>);
  expect(screen.queryByText('menu item')).not.toBeInTheDocument();
});

test('renders children after toggleVisibility is called', () => {
  const ref = React.createRef();
  render(<Popover ref={ref}><span>menu item</span></Popover>);
  act(() => { ref.current.toggleVisibility(); });
  expect(screen.getByText('menu item')).toBeInTheDocument();
});

test('hides children after close is called', () => {
  const ref = React.createRef();
  render(<Popover ref={ref}><span>menu item</span></Popover>);
  act(() => { ref.current.toggleVisibility(); });
  expect(screen.getByText('menu item')).toBeInTheDocument();
  act(() => { ref.current.close(); });
  expect(screen.queryByText('menu item')).not.toBeInTheDocument();
});

test('toggles back to closed on second toggleVisibility call', () => {
  const ref = React.createRef();
  render(<Popover ref={ref}><span>menu item</span></Popover>);
  act(() => { ref.current.toggleVisibility(); });
  act(() => { ref.current.toggleVisibility(); });
  expect(screen.queryByText('menu item')).not.toBeInTheDocument();
});
