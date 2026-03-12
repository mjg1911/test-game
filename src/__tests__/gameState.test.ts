import { getInitialGameState } from "../gameState"

test("initial state has correct structure", () => {
  const state = getInitialGameState();
  expect(state.crops.wheat.count).toBe(0);
  expect(state.crops.wheat.plantedAt).toBeNull();
  expect(state.crops.wheat.growthTime).toBe(5000);
  expect(state.crops.corn.count).toBe(0);
  expect(state.crops.corn.plantedAt).toBeNull();
  expect(state.crops.corn.growthTime).toBe(8000);
  expect(state.animals.cow.count).toBe(0);
  expect(state.animals.cow.produceReady).toBe(false);
  expect(state.animals.cow.produceType).toBe('milk');
  expect(state.animals.chicken.count).toBe(0);
  expect(state.animals.chicken.produceReady).toBe(false);
  expect(state.animals.chicken.produceType).toBe('eggs');
  expect(state.resources.money).toBe(50);
  expect(state.upgrades.fertilizer.level).toBe(0);
  expect(state.upgrades.fertilizer.cost).toBe(100);
  expect(state.upgrades.autoHarvester.level).toBe(0);
  expect(state.upgrades.autoHarvester.cost).toBe(500);
});
