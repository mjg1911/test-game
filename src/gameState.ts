export interface CropData {
  count: number;
  lastHarvest: number | null;
  cooldown: number;
  farmers: number;
  fertilizerLevel: number;
  irrigationLevel: number;
}

export const CROP_UNLOCK_COSTS: Record<string, number> = {
  wheat: 0,
  corn: 0,
  potatoes: 500,
  sugarcane: 2500,
  cotton: 15000,
  coffeeBeans: 80000,
  cocoaPods: 500000,
  goldenApples: 3000000,
  starfruit: 20000000,
  moonMelons: 150000000,
  etherealLotus: 1000000000,
  chronoVines: 7500000000,
  voidBerries: 50000000000
};

export const CROP_ORDER = ['wheat', 'corn', 'potatoes', 'sugarcane', 'cotton', 'coffeeBeans', 'cocoaPods', 'goldenApples', 'starfruit', 'moonMelons', 'etherealLotus', 'chronoVines', 'voidBerries'];

export interface AnimalData {
  count: number;
  lastHarvest: number | null;
  cooldown: number;
  produceType: string;
}

export function getInitialGameState() {
  return {
    crops: {
      wheat: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      corn: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      potatoes: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      sugarcane: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      cotton: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      coffeeBeans: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      cocoaPods: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      goldenApples: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      starfruit: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      moonMelons: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      etherealLotus: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      chronoVines: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 },
      voidBerries: { count: 0, lastHarvest: null, cooldown: 1000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
    },
    unlockedCrops: ['wheat', 'corn'],
    revealedCrops: ['wheat', 'corn', 'potatoes'],
    resources: {
      money: 30,
      wheat: 0, corn: 0, potatoes: 0, sugarcane: 0, cotton: 0,
      coffeeBeans: 0, cocoaPods: 0, goldenApples: 0,
      starfruit: 0, moonMelons: 0, etherealLotus: 0,
      chronoVines: 0, voidBerries: 0,
      eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0
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
    upgrades: {
      fertilizer: { level: 0, cost: 100 },
      autoHarvester: { level: 0, cost: 500 }
    }
  }
}
