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

test('farm cost uses 1.1 multiplier for wheat', () => {
  const getCost = (baseCost: number, count: number) => Math.floor(baseCost * Math.pow(1.1, count));
  expect(getCost(10, 0)).toBe(10);
  expect(getCost(10, 1)).toBe(11);
  expect(getCost(10, 2)).toBe(12);
});

describe('CropField (passive farm income)', () => {
  test('shows farm count', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 1000 },
          corn: { count: 0, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 1000 },
        },
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn', 'potatoes'],
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    expect(screen.getAllByText(/FARMS/)[0]).toBeInTheDocument();
  });

  test('shows buy button', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 1000 },
          corn: { count: 0, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 1000 },
        },
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn', 'potatoes'],
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    expect(screen.getAllByText(/Buy/)[0]).toBeInTheDocument();
  });

  test('shows upgrade info when farm exists', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, fertilizerLevel: 1, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 1000 },
          corn: { count: 0, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 1000 },
        },
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn', 'potatoes'],
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    expect(within(wheatSection).getByText(/Fertilizer 1/)).toBeInTheDocument();
    expect(within(wheatSection).getByText(/Irrigation 0/)).toBeInTheDocument();
  });

  test('shows passive income when farm exists', () => {
    const mockGameState = {
      state: {
        crops: {
          wheat: { count: 1, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 1000 },
          corn: { count: 0, fertilizerLevel: 0, irrigationLevel: 0, farmers: 0, lastHarvest: null, cooldown: 1000 },
        },
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn', 'potatoes'],
        resources: { money: 100000, wheat: 0, corn: 0 },
      },
      dispatch: vi.fn(),
    };
    renderWithContext(mockGameState);
    const wheatSection = screen.getByText(/Wheat/).closest('.pixel-stat');
    expect(within(wheatSection).getByText(/\/s/)).toBeInTheDocument();
  });
});
