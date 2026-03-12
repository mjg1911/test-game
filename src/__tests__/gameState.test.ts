import { getInitialGameState } from "../gameState"

test("initial state has 0 for all items", () => {
  const state = getInitialGameState()
  expect(state.crops.wheat).toBe(0)
  expect(state.crops.corn).toBe(0)
  expect(state.animals.cow).toBe(0)
  expect(state.animals.chicken).toBe(0)
  expect(state.resources.money).toBe(0)
  expect(state.resources.eggs).toBe(0)
  expect(state.upgrades.fertilizer).toBe(0)
  expect(state.upgrades.autoHarvester).toBe(0)
})
