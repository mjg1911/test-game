import React, { createContext, useContext, useReducer } from 'react';
import { getInitialGameState } from '../gameState';

const initialState = getInitialGameState();

export const cropConfig = {
  wheat: { baseCost: 10, cooldown: 5000 },
  corn: { baseCost: 20, cooldown: 8000 },
  sunflower: { baseCost: 30, cooldown: 10000 },
  peas: { baseCost: 40, cooldown: 12000 },
  pumpkin: { baseCost: 50, cooldown: 14000 },
  potato: { baseCost: 70, cooldown: 17000 },
  tomato: { baseCost: 100, cooldown: 21000 }
};

export function getFarmerCost(cropKey: string, farmersOwned: number): number {
  const config = cropConfig[cropKey as keyof typeof cropConfig];
  if (!config) return Infinity;
  return Math.floor(100 * config.baseCost * Math.pow(1.15, farmersOwned));
}

export const GameStateContext = createContext({
  state: initialState,
  dispatch: (action: any) => {}
});

function reducer(state, action) {
  switch (action.type) {
    case 'BUY_PLOT': {
      const crop = state.crops[action.crop];
      if (!crop) return state; // Crop not in state (legacy save)
      
      const config = cropConfig[action.crop];
      if (!config) return state;
      
      const count = crop.count;
      const cost = Math.floor(config.baseCost * Math.pow(1.15, count)); // 15% more each time
      
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

      const sellPrices = {
        wheat: 15,
        corn: 30,
        sunflower: 45,
        peas: 65,
        pumpkin: 85,
        potato: 110,
        tomato: 145
      };
      const profit = (sellPrices[action.crop] || 15) * crop.count;

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

      const sellPrices: Record<string, number> = {
        wheat: 15,
        corn: 30,
        sunflower: 45,
        peas: 65,
        pumpkin: 85,
        potato: 110,
        tomato: 145
      };
      
      const farmers = crop.farmers || 0;
      const sellPrice = sellPrices[action.crop] || 15;
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
            count: crop.count - totalToSell,
            lastHarvest: Date.now(),
          },
        },
      };
    }
    case 'BUY_ANIMAL': {
      const animal = state.animals[action.animal];
      const animalConfig = {
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
      const cost = Math.floor(config.baseCost * Math.pow(1.15, count));
      
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
      const animalConfig = {
        cow: { baseCost: 1000, cooldown: 100000 },
        chicken: { baseCost: 250, cooldown: 50000 },
        sheep: { baseCost: 350, cooldown: 80000 },
        pig: { baseCost: 600, cooldown: 120000 },
        goat: { baseCost: 400, cooldown: 90000 },
        rabbit: { baseCost: 150, cooldown: 60000 },
        duck: { baseCost: 200, cooldown: 70000 }
      };
      const config = animalConfig[action.animal];
      const moneyEarned = config ? config.baseCost * animal.count : 0;

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
      const prices = { wheat: 15, corn: 30, eggs: 5, milk: 10 };
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

  // Auto-sell timer: check for ready crops with farmers every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const cropKeys = Object.keys(state.crops) as (keyof typeof state.crops)[];
      for (const cropKey of cropKeys) {
        const crop = state.crops[cropKey];
        if (crop && crop.count > 0 && (crop.farmers || 0) > 0) {
          const lastHarvest = crop.lastHarvest || Date.now();
          const elapsed = Date.now() - lastHarvest;
          if (elapsed >= crop.cooldown) {
            dispatch({ type: 'AUTO_SELL', crop: cropKey });
          }
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}
