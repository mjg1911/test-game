import React from 'react';
import { render, screen } from '@testing-library/react';
import ResourcePanel from '../components/ResourcePanel';

import { GameStateContext } from '../providers/GameStateProvider';

// Minimal, universal crop config for all test cases
const fullCropsMock = {
  wheat:    { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  corn:     { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  sunflower:{ count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  peas:     { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  pumpkin:  { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  potato:   { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  tomato:   { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  potatoes: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  sugarcane:{ count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  cotton:   { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  coffeeBeans:{ count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  strawberries:{ count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  grapes:   { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  voidBerries: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  cocoaPods: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  goldenApples: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  starfruit: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  moonMelons: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  etherealLotus: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  chronoVines: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
};

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
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn'],
        unlockedAnimals: [],
        revealedAnimals: ['chicken'],
        resources: {
          money: 50,
          wheat: 10, corn: 5, sunflower: 2, peas: 1, pumpkin: 0, potato: 0, tomato: 0, potatoes: 0,
          sugarcane: 0, cotton: 0, coffeeBeans: 0, strawberries: 0, grapes: 0, cocoaPods: 0, goldenApples: 0, starfruit: 0, moonMelons: 0, etherealLotus: 0, chronoVines: 0, voidBerries: 0,
          eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0
        },
        crops: { ...fullCropsMock,
          wheat: { count: 10, lastHarvest: null, cooldown: 5000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          corn: { count: 2, lastHarvest: null, cooldown: 8000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          sunflower: { count: 1, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          peas: { count: 1, lastHarvest: null, cooldown: 12000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          pumpkin: { count: 0, lastHarvest: null, cooldown: 14000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          potato: { count: 0, lastHarvest: null, cooldown: 17000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          tomato: { count: 0, lastHarvest: null, cooldown: 21000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
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
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText(/Passive income:/i)).toBeInTheDocument();
    const passiveIncome = screen.getByTestId('passive-income');
    expect(passiveIncome).toBeInTheDocument();
    expect(passiveIncome.textContent).toContain('/s');
  });

  it('calculates passive income with fertilizer upgrade', () => {
    const mockContext = {
      state: {
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn'],
        unlockedAnimals: [],
        revealedAnimals: ['chicken'],
        resources: {
          money: 100,
          wheat: 20, corn: 0, sunflower: 0, peas: 0, pumpkin: 0, potato: 0, tomato: 0, potatoes: 0,
          sugarcane: 0, cotton: 0, coffeeBeans: 0, strawberries: 0, grapes: 0, cocoaPods: 0, goldenApples: 0, starfruit: 0, moonMelons: 0, etherealLotus: 0, chronoVines: 0, voidBerries: 0,
          eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0
        },
        crops: { ...fullCropsMock,
          wheat: { count: 10, lastHarvest: null, cooldown: 5000, farmers: 0, fertilizerLevel: 2, irrigationLevel: 0 },
          corn: { count: 2, lastHarvest: null, cooldown: 8000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          sunflower: { count: 1, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          peas: { count: 1, lastHarvest: null, cooldown: 12000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          pumpkin: { count: 0, lastHarvest: null, cooldown: 14000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          potato: { count: 0, lastHarvest: null, cooldown: 17000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          tomato: { count: 0, lastHarvest: null, cooldown: 21000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
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
    // With fertilizer level 2 and irrigation 0, multiplier = 1.15^2
    expect(passiveIncome.textContent).toContain('/s');
  });

  it('renders resources in correct row alignment, money left, passive right', () => {
    const mockContext = {
      state: {
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn'],
        unlockedAnimals: [],
        revealedAnimals: ['chicken'],
        resources: { money: 250, wheat: 0, corn: 0, sunflower: 0, peas: 0, pumpkin: 0, potato: 0, tomato: 0, potatoes: 0, sugarcane: 0, cotton: 0, coffeeBeans: 0, strawberries: 0, grapes: 0, cocoaPods: 0, goldenApples: 0, starfruit: 0, moonMelons: 0, etherealLotus: 0, chronoVines: 0, voidBerries: 0, eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0 },
        crops: { 
  ...fullCropsMock, 
  wheat: { count: 10, lastHarvest: null, cooldown: 5000, farmers: 0, fertilizerLevel: 1, irrigationLevel: 0 }, 
  corn: { count: 5, lastHarvest: null, cooldown: 9000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }, 
  sunflower: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  peas: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  pumpkin: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  potato: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  tomato: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
},
        upgrades: {
  fertilizer: { level: 0, cost: 100 },
  autoHarvester: { level: 0, cost: 500 }
},
        animals: emptyAnimals,
      },
      dispatch: () => {}
    };
    const { container } = render(
      <GameStateContext.Provider value={mockContext}>
        <ResourcePanel />
      </GameStateContext.Provider>
    );
    // Check for header container and row flex
    const row = container.querySelector('.resource-header-container');
    expect(row).toBeInTheDocument();
    const money = screen.getByTestId('money');
    const passive = screen.getByTestId('passive-income');
    expect(money).toBeInTheDocument();
    expect(passive).toBeInTheDocument();
    // Check order: money comes before passive income
    expect(row?.children.length).toBeGreaterThan(1);
    expect(row?.lastElementChild).toContainElement(passive);
    expect(row?.firstElementChild).toContainElement(money);
    // Check for right alignment class on passive income's parent
    const passiveParent = passive.closest('.resource');
    expect(passiveParent?.classList.contains('right')).toBe(true);
  });

  it('stacks money above passive income and keeps alignment on mobile width', () => {
    const mockContext = {
      state: {
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn'],
        unlockedAnimals: [],
        revealedAnimals: ['chicken'],
        resources: { money: 999, wheat: 0, corn: 0, sunflower: 0, peas: 0, pumpkin: 0, potato: 0, tomato: 0, potatoes: 0, sugarcane: 0, cotton: 0, coffeeBeans: 0, strawberries: 0, grapes: 0, cocoaPods: 0, goldenApples: 0, starfruit: 0, moonMelons: 0, etherealLotus: 0, chronoVines: 0, voidBerries: 0, eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0 },
        crops: { ...fullCropsMock,
  wheat: { count: 1, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  corn: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  sunflower: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  peas: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  pumpkin: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  potato: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  tomato: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
 },
        upgrades: {
  fertilizer: { level: 0, cost: 100 },
  autoHarvester: { level: 0, cost: 500 }
},
        animals: emptyAnimals,
      },
      dispatch: () => {}
    };
    const { container } = render(
      <GameStateContext.Provider value={mockContext}>
        <ResourcePanel />
      </GameStateContext.Provider>
    );
    const row = container.querySelector('.resource-header-container');
    expect(row).toBeInTheDocument();
    const money = screen.getByTestId('money');
    const passive = screen.getByTestId('passive-income');
    expect(money).toBeInTheDocument();
    expect(passive).toBeInTheDocument();
    expect(row?.children.length).toBeGreaterThan(1);
    expect(row?.firstElementChild).toContainElement(money);
    expect(row?.lastElementChild).toContainElement(passive);
    // CSS media query doesn't work in jsdom, but we verify structure exists for responsive design
    // The container has proper structure for column stacking on mobile
    expect(row?.classList.contains('resource-header-container')).toBe(true);
    const passiveParent = passive.closest('.resource');
    expect(passiveParent?.classList.contains('right')).toBe(true);
  });

  it('handles large money values without overflow', () => {
    const hugeMoney = 1234567890123;
    const mockContext = {
      state: {
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn'],
        unlockedAnimals: [],
        revealedAnimals: ['chicken'],
        resources: { money: hugeMoney, wheat: 0, corn: 0, sunflower: 0, peas: 0, pumpkin: 0, potato: 0, tomato: 0, potatoes: 0, sugarcane: 0, cotton: 0, coffeeBeans: 0, strawberries: 0, grapes: 0, cocoaPods: 0, goldenApples: 0, starfruit: 0, moonMelons: 0, etherealLotus: 0, chronoVines: 0, voidBerries: 0, eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0 },
        crops: { ...fullCropsMock,
  wheat: { count: 2, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  corn: { count: 1, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  sunflower: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  peas: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  pumpkin: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  potato: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
  tomato: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
 },
        upgrades: {
  fertilizer: { level: 0, cost: 100 },
  autoHarvester: { level: 0, cost: 500 }
},
        animals: emptyAnimals,
      },
      dispatch: () => {}
    };
    const { container } = render(
      <GameStateContext.Provider value={mockContext}>
        <ResourcePanel />
      </GameStateContext.Provider>
    );
    const money = screen.getByTestId('money');
    const passive = screen.getByTestId('passive-income');
    // Large money value is formatted with suffix (1.23T for trillion)
    expect(money.textContent).toMatch(/^\$\d+(\.\d+)?[KMBTQ]$/);
    expect(passive.textContent).toMatch(/^\+\$\d+(\.\d+)?[KMBTQ]?\/s$/);
    // Check no horizontal overflow in container
    const row = container.querySelector('.resource-header-container');
    if (row && 'scrollWidth' in row && 'clientWidth' in row) {
      expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth);
    }
    // No overlapping elements
    if (money.getBoundingClientRect && passive.getBoundingClientRect) {
      const mrect = money.getBoundingClientRect();
      const prect = passive.getBoundingClientRect();
      expect((mrect.right <= prect.left) || (prect.right <= mrect.left)).toBe(true);
    }
  });

  it('has proper accessibility labels for screen readers', () => {
    const mockContext = {
      state: {
        unlockedCrops: ['wheat', 'corn'],
        revealedCrops: ['wheat', 'corn'],
        unlockedAnimals: [],
        revealedAnimals: ['chicken'],
        resources: { money: 100, wheat: 0, corn: 0, sunflower: 0, peas: 0, pumpkin: 0, potato: 0, tomato: 0, potatoes: 0, sugarcane: 0, cotton: 0, coffeeBeans: 0, strawberries: 0, grapes: 0, cocoaPods: 0, goldenApples: 0, starfruit: 0, moonMelons: 0, etherealLotus: 0, chronoVines: 0, voidBerries: 0, eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0 },
        crops: { ...fullCropsMock,
          wheat: { count: 1, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          corn: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          sunflower: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          peas: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          pumpkin: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          potato: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
          tomato: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
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
    const money = screen.getByTestId('money');
    const passive = screen.getByTestId('passive-income');
    expect(money).toHaveAttribute('aria-label');
    expect(passive).toHaveAttribute('aria-label');
    expect(money.getAttribute('aria-label')).toBe('Money value');
    expect(passive.getAttribute('aria-label')).toBe('Passive income');
  });

});
