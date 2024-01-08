import { render, screen } from '@testing-library/react';
import DesignWeb from '../src/js/DesignWeb';

test('renders learn react link', () => {
  render(<DesignWeb />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
