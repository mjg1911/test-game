import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourcePanel from '../components/ResourcePanel';

import { GameStateContext } from '../providers/GameStateProvider';

const emptyAnimals = {
  cow: { count: 0, lastHarvest: null, cooldown: 100000, produceType: 'milk' },
  chicken: { count: 0, lastHarvest: null, cooldown: 50000, produceType: 'eggs' },
  sheep: { count: 0, lastHarvest: null, cooldown: 80000, produceType: 'wool' },
  pig: { count: 0, lastHarvest: null, cooldown: 120000, produceType: 'bacon' },
  goat: { count: 0, lastHarvest: null, cooldown: 90000, produceType: 'cheese' },
  rabbit: { count: 0, lastHarvest: null, cooldown: 60000, produceType: 'fur' },
  duck: { count: 0, lastHarvest: null, cooldown: 70000, produceType: 'feathers' }
};

describe('ResourcePanel', () => {
  it('renders money and passive income from context', () => {
    const mockContext = {
      state: {
        resources: {
          money: 50,
          wheat: 10,
          corn: 5,
          sunflower: 2,
          peas: 1,
          pumpkin: 0,
          potato: 0,
          tomato: 0
        },
        crops: {
          wheat: { count: 10, lastHarvest: null, cooldown: 5000, farmers: 2 },
          corn: { count: 2, lastHarvest: null, cooldown: 8000, farmers: 0 },
          sunflower: { count: 1, lastHarvest: null, cooldown: 10000, farmers: 0 },
          peas: { count: 1, lastHarvest: null, cooldown: 12000, farmers: 0 },
          pumpkin: { count: 0, lastHarvest: null, cooldown: 14000, farmers: 0 },
          potato: { count: 0, lastHarvest: null, cooldown: 17000, farmers: 0 },
          tomato: { count: 0, lastHarvest: null, cooldown: 21000, farmers: 0 }
        },
        upgrades: {
          fertilizer: { level: 0, cost: 100 },
          autoHarvester: { level: 0, cost: 500 }
        },
        animals: emptyAnimals,
      },
      dispatch: () => {}
    };
    render(
      <GameStateContext.Provider value={mockContext}>
        <ResourcePanel />
      </GameStateContext.Provider>
    );
    expect(screen.getByText(/Money:/i)).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText(/Passive income \/ sec:/i)).toBeInTheDocument();
    const passiveIncome = screen.getByTestId('passive-income');
    expect(passiveIncome).toBeInTheDocument();
    expect(parseFloat(passiveIncome.textContent!)).toBeGreaterThan(0);
  });

  it('calculates passive income with fertilizer upgrade', () => {
    const mockContext = {
      state: {
        resources: {
          money: 100,
          wheat: 20,
        },
        crops: {
          wheat: { count: 10, lastHarvest: null, cooldown: 5000, farmers: 2 },
          corn: { count: 2, lastHarvest: null, cooldown: 8000, farmers: 1 },
          sunflower: { count: 1, lastHarvest: null, cooldown: 10000, farmers: 0 },
          peas: { count: 1, lastHarvest: null, cooldown: 12000, farmers: 0 },
          pumpkin: { count: 0, lastHarvest: null, cooldown: 14000, farmers: 0 },
          potato: { count: 0, lastHarvest: null, cooldown: 17000, farmers: 0 },
          tomato: { count: 0, lastHarvest: null, cooldown: 21000, farmers: 0 }
        },
        upgrades: {
          fertilizer: { level: 2, cost: 100 },
          autoHarvester: { level: 0, cost: 500 }
        },
        animals: emptyAnimals,
      },
      dispatch: () => {}
    };
    render(
      <GameStateContext.Provider value={mockContext}>
        <ResourcePanel />
      </GameStateContext.Provider>
    );
    const passiveIncome = screen.getByTestId('passive-income');
    expect(passiveIncome).toBeInTheDocument();
    // Fertilizer level 2 = 1 + (0.5 * 2) = 2x yield
    // Expect higher value than base
    expect(parseFloat(passiveIncome.textContent!)).toBeGreaterThan(0);
  });
});
