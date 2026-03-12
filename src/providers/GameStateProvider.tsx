import React, { createContext, useContext, useReducer } from 'react';
import { getInitialGameState } from '../gameState';

const initialState = getInitialGameState();

export const GameStateContext = createContext({
  state: initialState,
  dispatch: () => {}
});

function reducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      const newAnimals = { ...state.animals };
      Object.entries(newAnimals).forEach(([animalName, animal]) => {
        if (animal.count > 0 && !animal.produceReady) {
          // Randomly produce with 10% chance per tick
          const shouldProduce = Math.random() < 0.1;
          if (shouldProduce) {
            newAnimals[animalName] = {
              ...animal,
              produceReady: true
            };
          }
        }
      });
      return {
        ...state,
        animals: newAnimals
      };
    }
    case 'PLANT_CROP': {
      const cropConfig = {
        wheat: { cost: 10, growthTime: 5000 },
        corn: { cost: 20, growthTime: 8000 }
      };
      const cost = cropConfig[action.crop]?.cost || 10;
      const growthTime = cropConfig[action.crop]?.growthTime || 5000;

      if (state.resources.money < cost) {
        return state;
      }
      return {
        ...state,
        crops: {
          ...state.crops,
          [action.crop]: {
            ...state.crops[action.crop],
            count: state.crops[action.crop].count + action.amount,
            plantedAt: Date.now(),
            growthTime,
          },
        },
        resources: {
          ...state.resources,
          money: state.resources.money - cost,
        },
      };
    }
    case 'HARVEST_CROP': {
      // Only allow if crop is grown
      const crop = state.crops[action.crop];
      if (!crop || crop.count === 0 || !crop.plantedAt) return state;
      const isReady = Date.now() - crop.plantedAt >= crop.growthTime;
      if (!isReady) return state;
      return {
        ...state,
        resources: {
          ...state.resources,
          money: state.resources.money + (action.profit || 0),
          [action.crop]: (state.resources[action.crop] || 0) + crop.count,
        },
        crops: {
          ...state.crops,
          [action.crop]: {
            ...crop,
            count: 0,
            plantedAt: null,
          },
        },
      };
    }
    case 'BUY_ANIMAL': {
      const animal = state.animals[action.animal];
      if (state.resources.money < action.cost) return state;
      return {
        ...state,
        animals: {
          ...state.animals,
          [action.animal]: {
            ...animal,
            count: animal.count + action.amount,
          },
        },
        resources: {
          ...state.resources,
          money: state.resources.money - action.cost,
        },
      };
    }
    case 'COLLECT_PRODUCE': {
      const animal = state.animals[action.animal];
      if (!animal || !animal.produceReady || animal.count === 0) return state;
      const produceType = animal.produceType;
      return {
        ...state,
        animals: {
          ...state.animals,
          [action.animal]: {
            ...animal,
            produceReady: false,
          },
        },
        resources: {
          ...state.resources,
          [produceType]: (state.resources[produceType] || 0) + animal.count,
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
          return JSON.parse(saved);
        }
      } catch (e) {
        // Error loading state, fallback
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
