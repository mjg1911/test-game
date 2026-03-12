import { render, screen } from '@testing-library/react';
import AnimalPen from '../components/AnimalPen';

test('renders AnimalPen with label and buttons', () => {
  render(<AnimalPen />);
  expect(screen.getByText('Animal Pen')).toBeInTheDocument();
  expect(screen.getByText('Buy Animal')).toBeInTheDocument();
  expect(screen.getByText('Collect Produce')).toBeInTheDocument();
});
