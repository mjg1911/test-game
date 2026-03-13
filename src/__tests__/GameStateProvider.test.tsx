import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { GameStateProvider, useGameStateContext, reducer } from '../providers/GameStateProvider';
import { getInitialGameState } from '../gameState';

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

  describe('ADD_PASSIVE_INCOME', () => {
    it('ADD_PASSIVE_INCOME adds money based on crop farms', () => {
      const initialState = getInitialGameState();
      initialState.crops.wheat.count = 1;
      initialState.resources.money = 500;
      
      const newState = reducer(initialState, { type: 'ADD_PASSIVE_INCOME', crop: 'wheat' });
      
      // wheat has 1 farm, base income = 15 sell / 5 sec = 3 $/s
      // With 0 upgrades: 3 * 1 * 1.15^0 = 3
      expect(newState.resources.money).toBe(503);
    });

    it('passive income tick adds money every second for each crop with farms', async () => {
      vi.useFakeTimers();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <GameStateProvider>{children}</GameStateProvider>
      );
      
      const { result } = renderHook(() => useGameStateContext(), { wrapper });
      
      // Buy a plot of wheat using the real action
      act(() => {
        result.current.dispatch({ type: 'BUY_PLOT', crop: 'wheat' });
      });
      
      // Verify state was updated - wheat should have count = 1, money should be less
      expect(result.current.state.crops.wheat.count).toBe(1);
      const moneyAfterBuy = result.current.state.resources.money;
      expect(moneyAfterBuy).toBeLessThan(500);
      
      // Advance time by 3 seconds (should add 3 * 3 = 9 for wheat farms)
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      // Money should have increased
      expect(result.current.state.resources.money).toBeGreaterThan(moneyAfterBuy);
      
      vi.useRealTimers();
    });

    it('UPGRADE_FARM increases upgrade level and deducts cost', () => {
      const initialState = getInitialGameState();
      initialState.crops.wheat.count = 1;
      initialState.resources.money = 500;
      
      const newState = reducer(initialState, { type: 'UPGRADE_FARM', crop: 'wheat', upgradeType: 'fertilizer' });
      
      // Cost = 100 * 2^0 = 100
      expect(newState.crops.wheat.fertilizerLevel).toBe(1);
      expect(newState.resources.money).toBe(400); // Started with 500
    });

    it('UPGRADE_FARM does nothing when crop count is 0', () => {
      const initialState = getInitialGameState();
      initialState.crops.wheat.count = 0;
      initialState.resources.money = 500;
      
      const newState = reducer(initialState, { type: 'UPGRADE_FARM', crop: 'wheat', upgradeType: 'fertilizer' });
      
      expect(newState.crops.wheat.fertilizerLevel).toBe(0);
      expect(newState.resources.money).toBe(500);
    });

    it('UPGRADE_FARM does nothing when insufficient money', () => {
      const initialState = getInitialGameState();
      initialState.crops.wheat.count = 1;
      initialState.resources.money = 50;
      
      const newState = reducer(initialState, { type: 'UPGRADE_FARM', crop: 'wheat', upgradeType: 'fertilizer' });
      
      expect(newState.crops.wheat.fertilizerLevel).toBe(0);
      expect(newState.resources.money).toBe(50);
    });

    it('UPGRADE_FARM works with irrigation upgrade type', () => {
      const initialState = getInitialGameState();
      initialState.crops.wheat.count = 1;
      initialState.resources.money = 500;
      
      const newState = reducer(initialState, { type: 'UPGRADE_FARM', crop: 'wheat', upgradeType: 'irrigation' });
      
      expect(newState.crops.wheat.irrigationLevel).toBe(1);
      expect(newState.resources.money).toBe(400);
    });

    it('UPGRADE_FARM does nothing with invalid crop name', () => {
      const initialState = getInitialGameState();
      initialState.crops.wheat.count = 1;
      initialState.resources.money = 500;
      
      const newState = reducer(initialState, { type: 'UPGRADE_FARM', crop: 'invalid_crop', upgradeType: 'fertilizer' });
      
      expect(newState.resources.money).toBe(500);
    });

    it('ADD_PASSIVE_INCOME does nothing when crop count is 0', () => {
      const initialState = getInitialGameState();
      initialState.crops.wheat.count = 0;
      initialState.resources.money = 500;
      
      const newState = reducer(initialState, { type: 'ADD_PASSIVE_INCOME', crop: 'wheat' });
      
      expect(newState.resources.money).toBe(500);
    });

    it('ADD_PASSIVE_INCOME does nothing with invalid crop name', () => {
      const initialState = getInitialGameState();
      initialState.crops.wheat.count = 1;
      initialState.resources.money = 500;
      
      const newState = reducer(initialState, { type: 'ADD_PASSIVE_INCOME', crop: 'invalid_crop' });
      
      expect(newState.resources.money).toBe(500);
    });
  });
});
