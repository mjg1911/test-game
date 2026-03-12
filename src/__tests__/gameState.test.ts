import { getInitialGameState } from "../gameState"

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
  expect(state.resources.money).toBe(500);
  expect(state.upgrades.fertilizer.level).toBe(0);
  expect(state.upgrades.fertilizer.cost).toBe(100);
  expect(state.upgrades.autoHarvester.level).toBe(0);
  expect(state.upgrades.autoHarvester.cost).toBe(500);
});
