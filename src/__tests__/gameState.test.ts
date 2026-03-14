import { getInitialGameState } from "../gameState"
import { cropConfig, reducer, getIncomeMultiplier } from "../providers/GameStateProvider"

test("initial state has upgradeLevel on crops", () => {
  const state = getInitialGameState();
  expect(state.crops.wheat.fertilizerLevel).toBe(0);
  expect(state.crops.wheat.irrigationLevel).toBe(0);
});

test("initial state has $30 starting money", () => {
  const state = getInitialGameState();
  expect(state.resources.money).toBe(30);
});

test("farm cost multiplier is 1.15 for wheat", () => {
  const state = getInitialGameState();
  state.crops.wheat.count = 1;
  state.resources.money = 100;
  const newState = reducer(state, { type: 'BUY_PLOT', crop: 'wheat' });
  const expectedCost = Math.floor(cropConfig.wheat.baseCost * Math.pow(getIncomeMultiplier('wheat'), 1));
  expect(state.resources.money - newState.resources.money).toBe(expectedCost);
});

test("initial state has correct structure", () => {
  const state = getInitialGameState();
  expect(state.crops.wheat.count).toBe(0);
  expect(state.crops.wheat.lastHarvest).toBeNull();
  expect(state.crops.wheat.cooldown).toBe(1000);
  expect(state.crops.corn.count).toBe(0);
  expect(state.crops.corn.lastHarvest).toBeNull();
  expect(state.crops.corn.cooldown).toBe(1000);
  expect(state.crops.potatoes.count).toBe(0);
  expect(state.crops.potatoes.lastHarvest).toBeNull();
  expect(state.crops.potatoes.cooldown).toBe(1000);
  expect(state.crops.sugarcane.count).toBe(0);
  expect(state.crops.sugarcane.lastHarvest).toBeNull();
  expect(state.crops.sugarcane.cooldown).toBe(1000);
  expect(state.crops.cotton.count).toBe(0);
  expect(state.crops.cotton.lastHarvest).toBeNull();
  expect(state.crops.cotton.cooldown).toBe(1000);
  expect(state.crops.coffeeBeans.count).toBe(0);
  expect(state.crops.coffeeBeans.lastHarvest).toBeNull();
  expect(state.crops.coffeeBeans.cooldown).toBe(1000);
  expect(state.crops.cocoaPods.count).toBe(0);
  expect(state.crops.cocoaPods.lastHarvest).toBeNull();
  expect(state.crops.cocoaPods.cooldown).toBe(1000);
  expect(state.crops.goldenApples.count).toBe(0);
  expect(state.crops.goldenApples.lastHarvest).toBeNull();
  expect(state.crops.goldenApples.cooldown).toBe(1000);
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

test("crop income matches research paper values", () => {
  const state = getInitialGameState();
  state.crops.wheat.count = 1;
  state.resources.money = 30;
  const withIncome = reducer(state, { type: 'ADD_PASSIVE_INCOME', crop: 'wheat' });
  const income = withIncome.resources.money - 30;
  expect(income).toBeCloseTo(0.1, 5);
});
