import React from 'react';
import { render, screen, within } from '@testing-library/react';
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
  test('shows farm count instead of plot count', () => {
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
    expect(screen.getAllByText(/Farms:/).length).toBeGreaterThan(0);
  });

  test('shows upgrade buttons for each crop with farms', () => {
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
    expect(screen.getAllByText(/Buy Farm/).length).toBeGreaterThan(0);
  });

  test('shows upgrade buttons for fertilizer and irrigation when farm exists', () => {
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
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    expect(within(wheatSection!).getByText(/Fertilizer Lv.1/)).toBeInTheDocument();
    expect(within(wheatSection!).getByText(/Irrigation Lv.0/)).toBeInTheDocument();
  });

  test('shows passive $/s when farm exists', () => {
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
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    expect(within(wheatSection!).getByText(/\$\/s/)).toBeInTheDocument();
  });
});
