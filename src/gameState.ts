export interface CropData {
  count: number;
  lastHarvest: number | null;
  cooldown: number;
  farmers: number;
  fertilizerLevel: number;
  irrigationLevel: number;
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
      wheat: { count: 0, lastHarvest: null, cooldown: 5000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      corn: { count: 0, lastHarvest: null, cooldown: 8000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      sunflower: { count: 0, lastHarvest: null, cooldown: 10000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      peas: { count: 0, lastHarvest: null, cooldown: 12000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      pumpkin: { count: 0, lastHarvest: null, cooldown: 14000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      potato: { count: 0, lastHarvest: null, cooldown: 17000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      tomato: { count: 0, lastHarvest: null, cooldown: 21000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
    },
    animals: {
      cow: { count: 0, lastHarvest: null, cooldown: 100000, produceType: 'milk' },
      chicken: { count: 0, lastHarvest: null, cooldown: 50000, produceType: 'eggs' },
      sheep: { count: 0, lastHarvest: null, cooldown: 80000, produceType: 'wool' },
      pig: { count: 0, lastHarvest: null, cooldown: 120000, produceType: 'bacon' },
      goat: { count: 0, lastHarvest: null, cooldown: 90000, produceType: 'cheese' },
      rabbit: { count: 0, lastHarvest: null, cooldown: 60000, produceType: 'fur' },
      duck: { count: 0, lastHarvest: null, cooldown: 70000, produceType: 'feathers' }
    },
    resources: {
      money: 30,
      wheat: 0,
      corn: 0,
      sunflower: 0,
      peas: 0,
      pumpkin: 0,
      potato: 0,
      tomato: 0,
      eggs: 0,
      milk: 0,
      wool: 0,
      bacon: 0,
      cheese: 0,
      fur: 0,
      feathers: 0
    },
    upgrades: {
      fertilizer: { level: 0, cost: 100 },
      autoHarvester: { level: 0, cost: 500 }
    }
  }
}
