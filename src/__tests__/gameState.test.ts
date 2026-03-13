import { getInitialGameState } from "../gameState"
import { cropConfig, reducer } from "../providers/GameStateProvider"

test("initial state has upgradeLevel on crops", () => {
  const state = getInitialGameState();
  expect(state.crops.wheat.fertilizerLevel).toBe(0);
  expect(state.crops.wheat.irrigationLevel).toBe(0);
});

test("initial state has $30 starting money", () => {
  const state = getInitialGameState();
  expect(state.resources.money).toBe(30);
});

test("farm cost multiplier is 1.3", () => {
  const state = getInitialGameState();
  state.crops.wheat.count = 1;
  state.resources.money = 100;
  const newState = reducer(state, { type: 'BUY_PLOT', crop: 'wheat' });
  const expectedCost = Math.floor(cropConfig.wheat.baseCost * Math.pow(1.3, 1));
  expect(state.resources.money - newState.resources.money).toBe(expectedCost);
});

test("initial state has correct structure", () => {
  const state = getInitialGameState();
expect(state.crops.wheat.count).toBe(0);
expect(state.crops.wheat.lastHarvest).toBeNull();
expect(state.crops.wheat.cooldown).toBe(5000);
expect(state.crops.corn.count).toBe(0);
expect(state.crops.corn.lastHarvest).toBeNull();
expect(state.crops.corn.cooldown).toBe(8000);
expect(state.crops.sunflower.count).toBe(0);
expect(state.crops.sunflower.lastHarvest).toBeNull();
expect(state.crops.sunflower.cooldown).toBe(10000);
expect(state.crops.peas.count).toBe(0);
expect(state.crops.peas.lastHarvest).toBeNull();
expect(state.crops.peas.cooldown).toBe(12000);
expect(state.crops.pumpkin.count).toBe(0);
expect(state.crops.pumpkin.lastHarvest).toBeNull();
expect(state.crops.pumpkin.cooldown).toBe(14000);
expect(state.crops.potato.count).toBe(0);
expect(state.crops.potato.lastHarvest).toBeNull();
expect(state.crops.potato.cooldown).toBe(17000);
expect(state.crops.tomato.count).toBe(0);
expect(state.crops.tomato.lastHarvest).toBeNull();
expect(state.crops.tomato.cooldown).toBe(21000);
  expect(state.animals.cow.count).toBe(0);
  expect(state.animals.cow.lastHarvest).toBeNull();
  expect(state.animals.cow.cooldown).toBe(100000);
  expect(state.animals.cow.produceType).toBe('milk');
  expect(state.animals.chicken.count).toBe(0);
  expect(state.animals.chicken.lastHarvest).toBeNull();
  expect(state.animals.chicken.cooldown).toBe(50000);
  expect(state.animals.chicken.produceType).toBe('eggs');
  expect(state.resources.money).toBe(30);
  expect(state.upgrades.fertilizer.level).toBe(0);
  expect(state.upgrades.fertilizer.cost).toBe(100);
  expect(state.upgrades.autoHarvester.level).toBe(0);
  expect(state.upgrades.autoHarvester.cost).toBe(500);
});
