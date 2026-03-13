import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';
import CropField from '../components/CropField';
import { GameStateContext } from '../providers/GameStateProvider';

function renderWithContext(mockState) {
  return render(
    <GameStateContext.Provider value={mockState}>
      <CropField />
    </GameStateContext.Provider>
  );
}

describe('CropField (passive farm income)', () => {
  test('shows farm count', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    expect(screen.getAllByText(/Farms/)[0]).toBeInTheDocument();
  });

  test('shows buy button', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    expect(screen.getAllByText(/Buy/).length).toBeGreaterThan(0);
  });

  test('shows upgrade info when farm exists', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, fertilizerLevel: 1, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat') as HTMLElement;
    expect(within(wheatSection).getByText(/Fertilizer 1/)).toBeInTheDocument();
    expect(within(wheatSection).getByText(/Irrigation 0/)).toBeInTheDocument();
  });

  test('shows passive income when farm exists', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 5000 },
          corn: { count: 0, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 8000 },
        },
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat') as HTMLElement;
    expect(within(wheatSection).getByText(/\/s/)).toBeInTheDocument();
  });
});
