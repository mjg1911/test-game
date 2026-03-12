import { render, screen } from '@testing-library/react';
import UpgradeShop from '../components/UpgradeShop';

test('renders UpgradeShop with label and Buy Upgrade button', () => {
  render(<UpgradeShop />);
  expect(screen.getByText(/Upgrade Shop/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Buy Upgrade/i })).toBeInTheDocument();
});
