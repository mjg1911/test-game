export interface CropData {
  count: number;
  lastHarvest: number | null;
  cooldown: number;
}

export interface AnimalData {
  count: number;
  lastHarvest: number | null;
  cooldown: number;
  produceType: string;
}

export function getInitialGameState() {
  return {
    crops: {
      wheat: { count: 0, lastHarvest: null, cooldown: 5000 },
      corn: { count: 0, lastHarvest: null, cooldown: 8000 }
    },
    animals: {
      cow: { count: 0, lastHarvest: null, cooldown: 10000, produceType: 'milk' },
      chicken: { count: 0, lastHarvest: null, cooldown: 5000, produceType: 'eggs' }
    },
    resources: {
      money: 50,
      wheat: 0,
      corn: 0,
      eggs: 0,
      milk: 0
    },
    upgrades: {
      fertilizer: { level: 0, cost: 100 },
      autoHarvester: { level: 0, cost: 500 }
    }
  }
}
