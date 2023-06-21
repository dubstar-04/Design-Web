import { render, screen } from '@testing-library/react';
import DesignApp from '../src/js/DesignApp';

test('renders learn react link', () => {
  render(<DesignApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
