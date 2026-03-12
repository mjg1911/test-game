export function getInitialGameState() {
  return {
    crops: { wheat: 0, corn: 0 },
    animals: { cow: 0, chicken: 0 },
    resources: { money: 0, eggs: 0 },
    upgrades: { fertilizer: 0, autoHarvester: 0 }
  }
}
