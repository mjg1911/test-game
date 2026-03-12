import { render, screen } from '@testing-library/react';
import UpgradeShop from '../components/UpgradeShop';

test('renders upgrades with costs', () => {
  render(<UpgradeShop />);
  expect(screen.getByText('Upgrade Shop')).toBeInTheDocument();
  expect(screen.getByText(/fertilizer/i)).toBeInTheDocument();
  expect(screen.getByText(/autoHarvester/i)).toBeInTheDocument();
});
