import { render, screen } from '@testing-library/react';
import AnimalPen from '../components/AnimalPen';

test('renders AnimalPen with animal grid', () => {
  render(<AnimalPen />);
  expect(screen.getByText(/Chicken/)).toBeInTheDocument();
  expect(screen.getByText(/Cow/)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Buy/i })).toHaveLength(7);
  expect(screen.getAllByRole('button', { name: /Collect/i })).toHaveLength(7);
});
