import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CropField from '../components/CropField';
import { GameStateProvider } from '../providers/GameStateProvider';

describe('CropField planting', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  
  it('should plant wheat and increment crop count', async () => {
    window.localStorage.setItem('idleFarmGameState', JSON.stringify({
      crops: {
        wheat: { count: 0, plantedAt: null, growthTime: 5000 },
        corn: { count: 0, plantedAt: null, growthTime: 8000 }
      },
      animals: {
        cow: { count: 0, produceReady: false, produceType: 'milk', collectCooldown: 10000 },
        chicken: { count: 0, produceReady: false, produceType: 'eggs', collectCooldown: 5000 }
      },
      resources: {
        money: 50,
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

    const plantBtn = screen.getByRole('button', { name: /Plant/i });
    fireEvent.click(plantBtn);

    await waitFor(() => {
      expect(screen.getByText(/Count: 1/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText(/0%/)[0]).toBeInTheDocument();
    });
  });
});
