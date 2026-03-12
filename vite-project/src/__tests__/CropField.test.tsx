import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CropField from '../components/CropField';
import { vi } from 'vitest';
import { GameStateProvider } from '../providers/GameStateProvider';

describe('CropField', () => {
  it('renders label/title and Plant/Harvest buttons', () => {
    render(<CropField />);
    expect(screen.getByText(/Select Crop:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Plant/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Harvest/i })).toBeInTheDocument();
  });

  it('shows floating feedback after successful harvest', async () => {
  vi.useFakeTimers();
  // Preload localStorage with crop ready state
  window.localStorage.setItem('idleFarmGameState', JSON.stringify({
    crops: {
      wheat: {
        count: 1,
        plantedAt: Date.now() - 10000,
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

  // Set fake time to simulate crop ready
  const plantedAt = Date.now() - 10000;
  vi.setSystemTime(plantedAt + 11000);

  const harvestBtn = screen.getByRole('button', { name: /Harvest/i });
  fireEvent.click(harvestBtn);

  // Advance timers to trigger feedback rendering
  vi.advanceTimersByTime(100);

  await waitFor(() => {
    expect(screen.queryByText(/\+\$[0-9]+/)).toBeInTheDocument();
  });

  vi.advanceTimersByTime(1500);

  await waitFor(() => {
    expect(screen.queryByText(/\+\$[0-9]+/)).not.toBeInTheDocument();
  });

  vi.useRealTimers();
}, 10000); // Test timeout extended
});
