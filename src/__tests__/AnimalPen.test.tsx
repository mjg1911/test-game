import { render, screen } from '@testing-library/react';
import AnimalPen from '../components/AnimalPen';
import { GameStateContext } from '../providers/GameStateProvider';
import { vi } from 'vitest';

function renderWithContext(mockState) {
  return render(
    <GameStateContext.Provider value={mockState}>
      <AnimalPen />
    </GameStateContext.Provider>
  );
}

test('renders AnimalPen with animal grid', () => {
  const mockGameState = {
    state: {
      animals: {
        chicken: { count: 1, lastHarvest: null, cooldown: 50000 },
        cow: { count: 0, lastHarvest: null, cooldown: 100000 },
        sheep: { count: 0, lastHarvest: null, cooldown: 80000 },
        pig: { count: 0, lastHarvest: null, cooldown: 120000 },
        goat: { count: 0, lastHarvest: null, cooldown: 90000 },
        rabbit: { count: 0, lastHarvest: null, cooldown: 60000 },
        duck: { count: 0, lastHarvest: null, cooldown: 70000 },
      },
      resources: { money: 100000, eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0 },
      revealedAnimals: ['chicken', 'cow', 'sheep', 'pig', 'goat', 'rabbit', 'duck'],
      unlockedAnimals: ['chicken', 'cow', 'sheep', 'pig', 'goat', 'rabbit', 'duck'],
    },
    dispatch: vi.fn(),
  };
  renderWithContext(mockGameState);
  expect(screen.getByText(/Chicken/)).toBeInTheDocument();
  expect(screen.getByText(/Cow/)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Buy/i })).toHaveLength(7);
  expect(screen.getAllByRole('button', { name: /Collect/i })).toHaveLength(7);
});
