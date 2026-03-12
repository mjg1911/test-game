import React, { createContext, useContext, useReducer } from 'react';
import { getInitialGameState } from '../gameState';

const initialState = getInitialGameState();

export const GameStateContext = createContext({
  state: initialState,
  dispatch: () => {}
});

function reducer(state, action) {
  switch (action.type) {
    case 'BUY_PLOT': {
      const cropConfig = {
        wheat: { baseCost: 10, cooldown: 5000 },
        corn: { baseCost: 20, cooldown: 8000 }
      };
      const config = cropConfig[action.crop];
      if (!config) return state;
      
      const count = state.crops[action.crop].count;
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

      const sellPrices = { wheat: 15, corn: 30 };
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
    case 'BUY_ANIMAL': {
      const animal = state.animals[action.animal];
      const animalConfig = {
        cow: { baseCost: 100, cooldown: 10000 },
        chicken: { baseCost: 25, cooldown: 5000 }
      };
      const config = animalConfig[action.animal];
      if (!config) return state;

      const count = state.animals[action.animal].count;
      const cost = Math.floor(config.baseCost * Math.pow(1.15, count)); // 15% more each time
      
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
          money: state.resources.money - Math.floor(config.baseCost * Math.pow(1.15, count)),
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
      return {
        ...state,
        resources: {
          ...state.resources,
          [produceType]: (state.resources[produceType] || 0) + animal.count,
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
          return parsed;
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

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}
