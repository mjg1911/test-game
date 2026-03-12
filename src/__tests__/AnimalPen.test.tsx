import { render, screen, waitFor } from '@testing-library/react';
import AnimalPen from '../components/AnimalPen';

import userEvent from '@testing-library/user-event';

test('renders AnimalPen with animal selection', async () => {
  render(<AnimalPen />);
  expect(screen.getByText('Animal Pen')).toBeInTheDocument();
  // By default, chicken selected
  expect(screen.getByRole('button', { name: 'Buy chicken' })).toBeInTheDocument();
  expect(screen.getByText(/Collect/i)).toBeInTheDocument();
  // Switch to cow
  await userEvent.selectOptions(screen.getByRole('combobox'), 'cow');
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Buy cow' })).toBeInTheDocument();
  });
});
