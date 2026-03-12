export interface CropData {
  count: number;
  plantedAt: number | null; // timestamp
  growthTime: number;
}

export interface AnimalData {
  count: number;
  produceReady: boolean;
  produceType: string; // 'eggs', 'milk', 'wool'
  collectCooldown: number;
}

export function getInitialGameState() {
  return {
    crops: {
      wheat: { count: 0, plantedAt: null, growthTime: 5000 },
      corn: { count: 0, plantedAt: null, growthTime: 8000 }
    },
    animals: {
      cow: { count: 0, produceReady: false, produceType: 'milk', collectCooldown: 10000 },
      chicken: { count: 0, produceReady: false, produceType: 'eggs', collectCooldown: 5000 }
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
