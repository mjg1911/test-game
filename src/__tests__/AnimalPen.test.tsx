import { render, screen, waitFor } from '@testing-library/react';
import AnimalPen from '../components/AnimalPen';

import userEvent from '@testing-library/user-event';

test('renders AnimalPen with animal selection', async () => {
  render(<AnimalPen />);
  expect(screen.getByText('Select Animal:')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Buy/i })).toBeInTheDocument();
  expect(screen.getByText(/Collect/i)).toBeInTheDocument();
  await userEvent.selectOptions(screen.getByRole('combobox'), 'cow');
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Buy/i })).toBeInTheDocument();
  });
});
