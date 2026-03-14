import React, { createContext, useContext, useReducer } from 'react';
import { getInitialGameState, CROP_UNLOCK_COSTS, ANIMAL_UNLOCK_COSTS, CROP_ORDER, ANIMAL_ORDER } from '../gameState';

const UPGRADE_BASE_COST = 100;
const UPGRADE_COST_EXPONENT = 2;
const INCOME_MULTIPLIER = 1.3;

const SELL_PRICES: Record<string, number> = {
  wheat: 1.5, corn: 3, sunflower: 4.5, peas: 6.5, pumpkin: 8.5, potato: 11, tomato: 14.5
};

const BASE_COOLDOWNS: Record<string, number> = {
  wheat: 5000, corn: 8000, sunflower: 10000, peas: 12000, pumpkin: 14000, potato: 17000, tomato: 21000
};

const initialState = getInitialGameState();

interface CropConfig {
  baseCost: number;
  cooldown: number;
}
export const cropConfig: { [key: string]: CropConfig } = {
  wheat: { baseCost: 10, cooldown: 5000 },
  corn: { baseCost: 20, cooldown: 8000 },
  sunflower: { baseCost: 30, cooldown: 10000 },
  peas: { baseCost: 40, cooldown: 12000 },
  pumpkin: { baseCost: 50, cooldown: 14000 },
  potato: { baseCost: 70, cooldown: 17000 },
  tomato: { baseCost: 100, cooldown: 21000 }
};

export function getIncomeMultiplier(farmersOwned: number): number {
  return Math.pow(INCOME_MULTIPLIER, farmersOwned);
}

export function isCropUnlocked(crop: string, state: GameState): boolean {
  return state.unlockedCrops.includes(crop);
}

export function isCropRevealed(crop: string, state: GameState): boolean {
  return state.revealedCrops.includes(crop);
}

export function isAnimalUnlocked(animal: string, state: GameState): boolean {
  return state.unlockedAnimals.includes(animal);
}

export function isAnimalRevealed(animal: string, state: GameState): boolean {
  return state.revealedAnimals.includes(animal);
}

export function getCropUnlockCost(crop: string): number {
  return CROP_UNLOCK_COSTS[crop] || 0;
}

export function getAnimalUnlockCost(animal: string): number {
  return ANIMAL_UNLOCK_COSTS[animal] || 0;
}

export function getRevealedUnlockedCrops(state: GameState): string[] {
  return state.revealedCrops.filter(crop => state.unlockedCrops.includes(crop));
}

export function getRevealedLockedCrops(state: GameState): string[] {
  return state.revealedCrops.filter(crop => !state.unlockedCrops.includes(crop));
}

export function getRevealedUnlockedAnimals(state: GameState): string[] {
  return state.revealedAnimals.filter(animal => state.unlockedAnimals.includes(animal));
}

export function getRevealedLockedAnimals(state: GameState): string[] {
  return state.revealedAnimals.filter(animal => !state.unlockedAnimals.includes(animal));
}

export function getFarmerCost(cropKey: string, farmersOwned: number): number {
  const config = cropConfig[cropKey as keyof typeof cropConfig];
  if (!config) return Infinity;
  return Math.floor(UPGRADE_BASE_COST * config.baseCost * Math.pow(INCOME_MULTIPLIER, farmersOwned));
}

export const GameStateContext = createContext({
  state: initialState,
  dispatch: (action: any) => {}
});

import type { CropData, AnimalData } from '../gameState';

interface CropsState {
  wheat: CropData;
  corn: CropData;
  sunflower: CropData;
  peas: CropData;
  pumpkin: CropData;
  potato: CropData;
  tomato: CropData;
}

interface AnimalsState {
  cow: AnimalData;
  chicken: AnimalData;
  sheep: AnimalData;
  pig: AnimalData;
  goat: AnimalData;
  rabbit: AnimalData;
  duck: AnimalData;
}

interface ResourcesState {
  money: number;
  wheat: number;
  corn: number;
  sunflower: number;
  peas: number;
  pumpkin: number;
  potato: number;
  tomato: number;
  eggs: number;
  milk: number;
  wool: number;
  bacon: number;
  cheese: number;
  fur: number;
  feathers: number;
}

interface UpgradesState {
  fertilizer: { level: number; cost: number };
  autoHarvester: { level: number; cost: number };
}

interface GameState {
  crops: CropsState;
  animals: AnimalsState;
  resources: ResourcesState;
  upgrades: UpgradesState;
  unlockedCrops: string[];
  revealedCrops: string[];
  unlockedAnimals: string[];
  revealedAnimals: string[];
}


type GameAction =
  | { type: 'BUY_PLOT'; crop: string }
  | { type: 'COLLECT_CROP'; crop: string }
  | { type: 'BUY_FARMER'; crop: string }
  | { type: 'AUTO_SELL'; crop: string }
  | { type: 'BUY_ANIMAL'; animal: string }
  | { type: 'COLLECT_ANIMAL'; animal: string }
  | { type: 'SELL_RESOURCES'; resource: string; amount: number }
  | { type: 'UPGRADE'; upgrade: string; cost: number }
  | { type: 'RESET' }
  | { type: 'ADD_PASSIVE_INCOME'; crop: string }
  | { type: 'UPGRADE_FARM'; crop: string; upgradeType: 'fertilizer' | 'irrigation' }
  | { type: 'UNLOCK_CROP'; crop: string }
  | { type: 'UNLOCK_ANIMAL'; animal: string };

export function reducer(state: GameState, action: GameAction) {
  switch (action.type) {
    case 'BUY_PLOT': {
      const crop = state.crops[action.crop];
      if (!crop) return state; // Crop not in state (legacy save)
      
      const config = cropConfig[action.crop];
      if (!config) return state;
      
      const count = crop.count;
      const cost = Math.floor(config.baseCost * Math.pow(INCOME_MULTIPLIER, count));
      
      if (state.resources.money < cost) return state;

      return {
        ...state,
        crops: {
          ...state.crops,
          [action.crop]: {
            ...state.crops[action.crop],
            count: count + 1,
            lastHarvest: count === 0 ? Date.now() : state.crops[action.crop].lastHarvest,
            cooldown: config.cooldown,
          },
        },
        resources: {
          ...state.resources,
          money: state.resources.money - cost,
        },
      };
    }
    case 'COLLECT_CROP': {
      const crop = state.crops[action.crop];
      if (!crop || crop.count === 0) return state;
      
      const lastHarvest = crop.lastHarvest || Date.now();
      const elapsed = Date.now() - lastHarvest;
      if (elapsed < crop.cooldown) return state; // Not ready

      const profit = (SELL_PRICES[action.crop] || 15) * crop.count;

      return {
        ...state,
        resources: {
          ...state.resources,
          money: state.resources.money + profit,
          [action.crop]: (state.resources[action.crop] || 0) + crop.count,
        },
        crops: {
          ...state.crops,
          [action.crop]: {
            ...crop,
            lastHarvest: Date.now(),
          },
        },
      };
    }
    case 'BUY_FARMER': {
      const crop = state.crops[action.crop];
      if (!crop || crop.count === 0) return state;
      
      const farmers = crop.farmers || 0;
      const cost = getFarmerCost(action.crop, farmers);
      
      if (state.resources.money < cost) return state;

      return {
        ...state,
        crops: {
          ...state.crops,
          [action.crop]: {
            ...crop,
            farmers: farmers + 1,
          },
        },
        resources: {
          ...state.resources,
          money: state.resources.money - cost,
        },
      };
    }
    case 'AUTO_SELL': {
      const crop = state.crops[action.crop];
      if (!crop || crop.count === 0 || (crop.farmers || 0) === 0) return state;
      
      const lastHarvest = crop.lastHarvest || Date.now();
      const elapsed = Date.now() - lastHarvest;
      if (elapsed < crop.cooldown) return state; // Not ready

      const farmers = crop.farmers || 0;
      const sellPrice = SELL_PRICES[action.crop] || 15;
      const maxPerFarmer = 10;
      const totalToSell = Math.min(farmers * maxPerFarmer, crop.count);
      const profit = totalToSell * sellPrice;

      return {
        ...state,
        resources: {
          ...state.resources,
          money: state.resources.money + profit,
        },
        crops: {
          ...state.crops,
          [action.crop]: {
            ...crop,
            count: crop.count, // Keep plots permanent
            lastHarvest: Date.now(),
          },
        },
      };
    }
    case 'BUY_ANIMAL': {
      const animal = state.animals[action.animal];
const animalConfig: { [key: string]: { baseCost: number; cooldown: number } } = {
  cow: { baseCost: 1000, cooldown: 100000 },
  chicken: { baseCost: 250, cooldown: 50000 },
  sheep: { baseCost: 350, cooldown: 80000 },
  pig: { baseCost: 600, cooldown: 120000 },
  goat: { baseCost: 400, cooldown: 90000 },
  rabbit: { baseCost: 150, cooldown: 60000 },
  duck: { baseCost: 200, cooldown: 70000 }
};

      const config = animalConfig[action.animal];
      if (!config) return state;

      const count = state.animals[action.animal].count;
      const cost = Math.floor(config.baseCost * Math.pow(1.3, count));
      
      if (state.resources.money < cost) return state;

      return {
        ...state,
        animals: {
          ...state.animals,
          [action.animal]: {
            ...animal,
            count: count + 1,
            lastHarvest: count === 0 ? Date.now() : state.animals[action.animal].lastHarvest,
            cooldown: config.cooldown,
          },
        },
        resources: {
          ...state.resources,
          money: state.resources.money - cost,
        },
      };
    }
    case 'COLLECT_ANIMAL': {
      const animal = state.animals[action.animal];
      if (!animal || animal.count === 0) return state;
      
      const lastHarvest = animal.lastHarvest || Date.now();
      const elapsed = Date.now() - lastHarvest;
      if (elapsed < animal.cooldown) return state;

      const produceType = animal.produceType;
const animalConfig: { [key: string]: { baseCost: number; cooldown: number } } = {
  cow: { baseCost: 1000, cooldown: 100000 },
  chicken: { baseCost: 250, cooldown: 50000 },
  sheep: { baseCost: 350, cooldown: 80000 },
  pig: { baseCost: 600, cooldown: 120000 },
  goat: { baseCost: 400, cooldown: 90000 },
  rabbit: { baseCost: 150, cooldown: 60000 },
  duck: { baseCost: 200, cooldown: 70000 }
};

      const config = animalConfig[action.animal];
      const moneyEarned = (config ? config.baseCost * animal.count : 0) * 0.1;

      return {
        ...state,
        resources: {
          ...state.resources,
          [produceType]: (state.resources[produceType] || 0) + animal.count,
          money: state.resources.money + moneyEarned,
        },
        animals: {
          ...state.animals,
          [action.animal]: {
            ...animal,
            lastHarvest: Date.now(),
          },
        },
      };
    }
    case 'SELL_RESOURCES': {
      const { resource, amount } = action;
      const resourceAmount = state.resources[resource] || 0;
      const sellAmount = Math.min(amount, resourceAmount);
      if (sellAmount <= 0) return state;
      const prices: { [key: string]: number } = { wheat: 15, corn: 30, eggs: 5, milk: 10 };
      const price = prices[resource] || 1;
      return {
        ...state,
        resources: {
          ...state.resources,
          [resource]: resourceAmount - sellAmount,
          money: state.resources.money + (sellAmount * price)
        }
      };
    }
    case 'UPGRADE': {
      const upgrade = state.upgrades[action.upgrade];
      if (state.resources.money < action.cost) return state;
      return {
        ...state,
        upgrades: {
          ...state.upgrades,
          [action.upgrade]: {
            ...upgrade,
            level: (upgrade.level || 0) + 1,
          },
        },
        resources: {
          ...state.resources,
          money: state.resources.money - action.cost,
        },
      };
    }
    case 'RESET':
      return getInitialGameState();
    case 'ADD_PASSIVE_INCOME': {
      const crop = state.crops[action.crop as keyof typeof state.crops];
      if (!crop || crop.count === 0) return state;
      
      const sellPrice = SELL_PRICES[action.crop] || 15;
      const cooldown = BASE_COOLDOWNS[action.crop] || 5000;
      const baseIncomePerFarm = sellPrice / (cooldown / 1000);
      const multiplier = Math.pow(INCOME_MULTIPLIER, (crop.fertilizerLevel || 0) + (crop.irrigationLevel || 0));
      const income = baseIncomePerFarm * crop.count * multiplier;
      
      return {
        ...state,
        resources: {
          ...state.resources,
          money: state.resources.money + income,
        },
      };
    }
    case 'UPGRADE_FARM': {
      const crop = state.crops[action.crop as keyof typeof state.crops];
      if (!crop || crop.count === 0) return state;
      
      const level = action.upgradeType === 'fertilizer' 
        ? (crop.fertilizerLevel || 0) 
        : (crop.irrigationLevel || 0);
      const cost = Math.floor(UPGRADE_BASE_COST * Math.pow(UPGRADE_COST_EXPONENT, level));
      
      if (state.resources.money < cost) return state;
      
      return {
        ...state,
        crops: {
          ...state.crops,
          [action.crop]: {
            ...crop,
            [action.upgradeType === 'fertilizer' ? 'fertilizerLevel' : 'irrigationLevel']: level + 1,
          },
        },
        resources: {
          ...state.resources,
          money: state.resources.money - cost,
        },
      };
    }
    case 'UNLOCK_CROP': {
      const cropUnlockCost = CROP_UNLOCK_COSTS[action.crop] || 0;
      if (state.resources.money < cropUnlockCost) return state;
      
      const nextCropIndex = CROP_ORDER.indexOf(action.crop) + 1;
      const nextCrop = CROP_ORDER[nextCropIndex];
      
      return {
        ...state,
        unlockedCrops: [...state.unlockedCrops, action.crop],
        revealedCrops: nextCrop ? [...state.revealedCrops, nextCrop] : state.revealedCrops,
        resources: {
          ...state.resources,
          money: state.resources.money - cropUnlockCost
        }
      };
    }
    case 'UNLOCK_ANIMAL': {
      const animalUnlockCost = ANIMAL_UNLOCK_COSTS[action.animal] || 0;
      if (state.resources.money < animalUnlockCost) return state;
      
      const nextAnimalIndex = ANIMAL_ORDER.indexOf(action.animal) + 1;
      const nextAnimal = ANIMAL_ORDER[nextAnimalIndex];
      
      return {
        ...state,
        unlockedAnimals: [...state.unlockedAnimals, action.animal],
        revealedAnimals: nextAnimal ? [...state.revealedAnimals, nextAnimal] : state.revealedAnimals,
        resources: {
          ...state.resources,
          money: state.resources.money - animalUnlockCost
        }
      };
    }
    default:
      return state;
  }
}

export function useGameStateContext() {
  return useContext(GameStateContext);
}

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialize state from localStorage or fallback to initial
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => {
      try {
        const saved = localStorage.getItem('idleFarmGameState');
        if (saved) {
          console.log('[INIT] Loaded state from localStorage');
          const parsed = JSON.parse(saved);
          console.log('[INIT] Loaded crops:', parsed.crops);
          // Merge with initial state to ensure new crops/animals are present
          const initial = getInitialGameState();
          return {
            ...initial,
            ...parsed,
            crops: { ...initial.crops, ...parsed.crops },
            animals: { ...initial.animals, ...parsed.animals },
            resources: { ...initial.resources, ...parsed.resources },
            upgrades: { ...initial.upgrades, ...parsed.upgrades },
          };
        }
      } catch (e) {
        console.log('[INIT] Error loading state:', e);
      }
      return getInitialGameState();
    }
  );

  // Save to localStorage on every state change
  React.useEffect(() => {
    try {
      localStorage.setItem('idleFarmGameState', JSON.stringify(state));
    } catch (e) {
      // Could add error feedback here if needed
    }
  }, [state]);

  // Passive income tick: add income every second for each crop with farms
  const stateRef = React.useRef(state);
  stateRef.current = state;
  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentState = stateRef.current;
      const cropKeys = Object.keys(currentState.crops) as (keyof typeof currentState.crops)[];
      for (const cropKey of cropKeys) {
        const crop = currentState.crops[cropKey];
        if (crop && crop.count > 0) {
          dispatch({ type: 'ADD_PASSIVE_INCOME', crop: cropKey });
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}
