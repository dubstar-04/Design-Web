import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import Switch from '../js/components/switch';

test('renders a checkbox input', () => {
  render(<Switch checked={false} onChange={() => {}} />);
  expect(screen.getByRole('checkbox')).toBeInTheDocument();
});

test('checkbox is checked when checked prop is true', () => {
  render(<Switch checked onChange={() => {}} />);
  expect(screen.getByRole('checkbox')).toBeChecked();
});

test('checkbox is unchecked when checked prop is false', () => {
  render(<Switch checked={false} onChange={() => {}} />);
  expect(screen.getByRole('checkbox')).not.toBeChecked();
});

test('calls onChange when toggled', () => {
  const onChange = jest.fn();
  render(<Switch checked={false} onChange={onChange} />);
  fireEvent.click(screen.getByRole('checkbox'));
  expect(onChange).toHaveBeenCalledTimes(1);
});
