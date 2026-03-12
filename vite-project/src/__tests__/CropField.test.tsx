import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CropField from '../components/CropField';
import { GameStateProvider } from '../providers/GameStateProvider';

describe('CropField', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders label/title and Plant/Harvest buttons', () => {
    render(<CropField />);
    expect(screen.getByText(/Select Crop:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plant/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Harvest/i })).toBeInTheDocument();
  });

  it('shows floating feedback after successful harvest', async () => {
    // Use a timestamp so old it will definitely be ready (planted in 1970!)
    const veryOldTime = 0;
    
    window.localStorage.setItem('idleFarmGameState', JSON.stringify({
      crops: {
        wheat: {
          count: 1,
          plantedAt: veryOldTime,
          growthTime: 5000
        },
        corn: {
          count: 0,
          plantedAt: null,
          growthTime: 8000
        }
      },
      animals: {
        cow: { count: 0, produceReady: false, produceType: 'milk', collectCooldown: 10000 },
        chicken: { count: 0, produceReady: false, produceType: 'eggs', collectCooldown: 5000 }
      },
      resources: {
        money: 100,
        wheat: 0,
        corn: 0,
        eggs: 0,
        milk: 0
      },
      upgrades: {
        fertilizer: { level: 0, cost: 100 },
        autoHarvester: { level: 0, cost: 500 }
      }
    }));

    render(
      <GameStateProvider>
        <CropField />
      </GameStateProvider>
    );

    const harvestBtn = screen.getByRole('button', { name: /Harvest/i });
    fireEvent.click(harvestBtn);

    await waitFor(() => {
      expect(screen.queryByText(/\+\$[0-9]+/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
