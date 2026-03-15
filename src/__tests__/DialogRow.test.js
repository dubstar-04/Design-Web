import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import DialogRow from '../js/components/dialogRow';

test('renders label text', () => {
  render(<DialogRow label="Layer Name" />);
  expect(screen.getByText('Layer Name')).toBeInTheDocument();
});

test('applies list variant class by default', () => {
  const { container } = render(<DialogRow label="Test" />);
  expect(container.firstChild).toHaveClass('dialogrow--list');
});

test('applies form variant class', () => {
  const { container } = render(<DialogRow label="Test" variant="form" />);
  expect(container.firstChild).toHaveClass('dialogrow--form');
});

test('applies current class when isCurrent is true', () => {
  const { container } = render(<DialogRow isCurrent label="Test" />);
  expect(container.firstChild).toHaveClass('dialogrow--current');
});

test('does not apply current class by default', () => {
  const { container } = render(<DialogRow label="Test" />);
  expect(container.firstChild).not.toHaveClass('dialogrow--current');
});

test('renders suffix content', () => {
  render(<DialogRow label="Test" suffix={<span>suffix content</span>} />);
  expect(screen.getByText('suffix content')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const onClick = jest.fn();
  render(<DialogRow label="Clickable" onClick={onClick} />);
  fireEvent.click(screen.getByText('Clickable'));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('uses label element in form variant', () => {
  render(<DialogRow label="Name" variant="form" />);
  expect(screen.getByText('Name').tagName).toBe('LABEL');
});

test('uses div element in list variant', () => {
  render(<DialogRow label="Name" variant="list" />);
  expect(screen.getByText('Name').tagName).toBe('DIV');
});
