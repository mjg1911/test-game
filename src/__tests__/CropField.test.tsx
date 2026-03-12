import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import CropField from '../components/CropField';
import { getFarmerCost } from '../providers/GameStateProvider';
import { GameStateContext } from '../providers/GameStateProvider';

function renderWithContext(mockState) {
  return render(
    <GameStateContext.Provider value={mockState}>
      <CropField />
    </GameStateContext.Provider>
  );
}

describe('CropField (auto farmers)', () => {
  it('renders farmer UI and buy button', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, farmers: 0, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    expect(wheatSection).toBeTruthy();
    const farmerButton = within(wheatSection).getByRole('button', { name: /Buy Farmer/i });
    expect(farmerButton).toBeEnabled();
    expect(farmerButton.textContent).toMatch(/\(\$[0-9]+\)/);
  });

  it('disables Buy Farmer button if funds are not enough', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, farmers: 0, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 0, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    const farmerButton = within(wheatSection).getByRole('button', { name: /Buy Farmer/i });
    expect(farmerButton).toBeDisabled();
  });

  it('should not show farmer UI/buttons for crops with zero plots', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, farmers: 0, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const cornSection = screen.getByText(/Corn/).closest('.pixel-stat');
    // Farmer UI/button should NOT exist for zero plots
    expect(within(cornSection).queryByRole('button', { name: /Buy Farmer/i })).toBeNull();
    // Optionally check for plot prompt
    expect(within(cornSection).getByText(/Buy your first plot!/i)).toBeInTheDocument();
  });

  it('shows farmer owned and status text when farmer bought', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, farmers: 1, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    expect(within(wheatSection).getByText(/Farmers: 1/i)).toBeInTheDocument();
    expect(within(wheatSection).getByText(/Auto-sell active/i)).toBeInTheDocument();
  });

  it('escalates price and disables farmer buy button when buying multiple farmers without enough funds', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, farmers: 2, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 1300, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    const farmerButton = within(wheatSection).getByRole('button', { name: /Buy Farmer/i });
    // Button should show price > $1300, and be disabled
    const expectedCost = getFarmerCost('wheat', 2);
    expect(farmerButton.textContent).toContain(`$${expectedCost}`);
    expect(farmerButton).toBeDisabled();
  });

  it('shows correct farmer count and status after buying multiple farmers', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, farmers: 4, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    expect(within(wheatSection).getByText(/Farmers: 4/i)).toBeInTheDocument();
    expect(within(wheatSection).getByText(/Auto-sell active/i)).toBeInTheDocument();
  });

  it('disables Buy Farmer if plot is removed even with farmers owned', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 0, farmers: 2, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    const farmerButton = within(wheatSection).queryByRole('button', { name: /Buy Farmer/i });
    expect(farmerButton).toBeNull();
    // For zero plots, farmer status should NOT be shown
    if (wheatSection) {
      expect(within(wheatSection).queryByText(/Farmers: 2/i)).toBeNull();
    }
  });
});
