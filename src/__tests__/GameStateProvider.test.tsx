import React from 'react';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { GameStateProvider, useGameStateContext } from '../providers/GameStateProvider';

describe('GameStateProvider', () => {
  // Clean localStorage before each test
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('provides initial game state object', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameStateProvider>{children}</GameStateProvider>
    );
    const { result } = renderHook(() => useGameStateContext(), { wrapper });
    expect(result.current.state).toMatchObject({
      crops: {
        wheat: { count: 0, lastHarvest: null, cooldown: expect.any(Number) },
        corn: { count: 0, lastHarvest: null, cooldown: expect.any(Number) },
      },
      animals: {
        cow: { count: 0, lastHarvest: null, cooldown: expect.any(Number), produceType: 'milk' },
        chicken: { count: 0, lastHarvest: null, cooldown: expect.any(Number), produceType: 'eggs' },
      },
      resources: {
        money: expect.any(Number),
        wheat: expect.any(Number),
        corn: expect.any(Number),
        eggs: expect.any(Number),
        milk: expect.any(Number),
      },
      upgrades: {
        fertilizer: { level: expect.any(Number), cost: expect.any(Number) },
        autoHarvester: { level: expect.any(Number), cost: expect.any(Number) },
      },
    });
    expect(typeof result.current.dispatch).toBe('function');
  });
  // ... keep other tests unchanged ...

  it('does not import malformed game state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <GameStateProvider>{children}</GameStateProvider>
    );
    const { result } = renderHook(() => useGameStateContext(), { wrapper });
    const invalid = { foo: 'bar' };
    act(() => {
      result.current.dispatch({ type: 'IMPORT_STATE', state: invalid });
    });
    // Should remain unchanged
    expect(result.current.state).toMatchObject({
      crops: {
        wheat: { count: 0, lastHarvest: null, cooldown: expect.any(Number) },
        corn: { count: 0, lastHarvest: null, cooldown: expect.any(Number) },
      },
      animals: {
        cow: { count: 0, lastHarvest: null, cooldown: expect.any(Number), produceType: 'milk' },
        chicken: { count: 0, lastHarvest: null, cooldown: expect.any(Number), produceType: 'eggs' },
      },
      resources: {
        money: expect.any(Number),
        eggs: expect.any(Number),
      },
      upgrades: {
        fertilizer: { level: expect.any(Number), cost: expect.any(Number) },
        autoHarvester: { level: expect.any(Number), cost: expect.any(Number) },
      },
    });
  });
});
