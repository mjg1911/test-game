# Code Review Report: Part 2

> Generated: 2026-03-12  
> Reviewer: Big Pickle  
> Agent: GPT-4.1 (Round 2)

---

## 🎉 Good News!

GPT-4.1 fixed **most** of the issues from Part 1! This is impressive work.

### What Was Fixed ✅

| File | Issue | Status |
|------|-------|--------|
| `gameState.ts` | Added interfaces, growth tracking, starting money | ✅ Fixed |
| `ResourcePanel.tsx` | Now uses game context, shows real values | ✅ Fixed |
| `CropField.tsx` | Plant/harvest with crop selection, growth % | ✅ Fixed |
| `AnimalPen.tsx` | Buy/collect with animal selection | ✅ Fixed |
| `UpgradeShop.tsx` | Upgrade list with costs, max levels | ✅ Fixed |
| `AutomationControls.tsx` | Working automation interval | ✅ Fixed |
| `App.tsx` | Clean layout, removed boilerplate | ✅ Fixed |
| `GameStateProvider.tsx` | All reducer actions with validation | ✅ Fixed |

---

## Remaining Issues

### 1. `src/hooks/useCanvasDraw.ts` - Still Not Connected to Game State

**Problem:** Draws static pixel art, doesn't reflect actual game state.

**Current Code (lines 13-18):**
```typescript
// Draw simple pixel grid (dummy crop)
ctx.fillStyle = '#497d36';
ctx.fillRect(40, 80, 48, 32);
ctx.fillStyle = '#ffe66d';
ctx.fillRect(56, 96, 16, 8);
```

**Fix:**
```typescript
import { useContext, useEffect } from 'react';
import { GameStateContext } from '../providers/GameStateProvider';

const useCanvasDraw = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const { state } = useContext(GameStateContext);
  const canvas = canvasRef.current;

  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background (dirt)
    ctx.fillStyle = '#4a3520';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw crops based on state
    const wheatCount = state.crops.wheat?.count || 0;
    const cornCount = state.crops.corn?.count || 0;

    // Draw wheat (yellow)
    ctx.fillStyle = '#ffe66d';
    for (let i = 0; i < wheatCount && i < 8; i++) {
      ctx.fillRect(10 + (i * 15), 20, 8, 16);
    }

    // Draw corn (orange-yellow)
    ctx.fillStyle = '#ffa500';
    for (let i = 0; i < cornCount && i < 8; i++) {
      ctx.fillRect(10 + (i * 15), 50, 10, 20);
    }

    // Draw animals
    const chickenCount = state.animals.chicken?.count || 0;
    const cowCount = state.animals.cow?.count || 0;

    // Draw chickens (white)
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < chickenCount && i < 5; i++) {
      ctx.fillRect(10 + (i * 20), 90, 12, 12);
    }

    // Draw cows (brown/white)
    ctx.fillStyle = '#8b4513';
    for (let i = 0; i < cowCount && i < 3; i++) {
      ctx.fillRect(10 + (i * 40), 105, 25, 15);
    }
  }, [canvas, state]);
};

export default useCanvasDraw;
```

---

### 2. Tests Need Updating

The tests are looking for old dummy text. Update them to match new UI.

#### `src/__tests__/gameState.test.ts`
```typescript
test("initial state has correct structure", () => {
  const state = getInitialGameState();
  
  expect(state.crops.wheat.count).toBe(0);
  expect(state.crops.wheat.plantedAt).toBeNull();
  expect(state.crops.wheat.growthTime).toBe(5000);
  
  expect(state.animals.cow.count).toBe(0);
  expect(state.animals.cow.produceReady).toBe(false);
  
  expect(state.resources.money).toBe(50);
});
```

#### `src/__tests__/AnimalPen.test.tsx`
```typescript
test("renders AnimalPen with animal selection", () => {
  render(<AnimalPen />);
  
  expect(screen.getByText('Animal Pen')).toBeInTheDocument();
  expect(screen.getByText(/Buy chicken/i)).toBeInTheDocument();
  expect(screen.getByText(/Collect/i)).toBeInTheDocument();
});
```

#### `src/__tests__/ResourcePanel.test.tsx`
```typescript
test("renders resource values from context", () => {
  render(<ResourcePanel />);
  
  expect(screen.getByText(/Money:/i)).toBeInTheDocument();
  expect(screen.getByText(/Eggs:/i)).toBeInTheDocument();
  expect(screen.getByText(/Wheat:/i)).toBeInTheDocument();
  expect(screen.getByText(/Corn:/i)).toBeInTheDocument();
  expect(screen.getByText(/Milk:/i)).toBeInTheDocument();
});
```

#### `src/__tests__/UpgradeShop.test.tsx`
```typescript
test("renders upgrades with costs", () => {
  render(<UpgradeShop />);
  
  expect(screen.getByText('Upgrade Shop')).toBeInTheDocument();
  expect(screen.getByText(/fertilizer/i)).toBeInTheDocument();
  expect(screen.getByText(/autoHarvester/i)).toBeInTheDocument();
});
```

#### `src/__tests__/GameStateProvider.test.tsx`
Update the malformed state test to expect new structure (lines 145-149):
```typescript
expect(result.current.state).toMatchObject({
  crops: { 
    wheat: { count: 0, plantedAt: null, growthTime: 5000 }, 
    corn: { count: 0, plantedAt: null, growthTime: 8000 } 
  },
  animals: { 
    cow: { count: 0, produceReady: false, produceType: 'milk' }, 
    chicken: { count: 0, produceReady: false, produceType: 'eggs' } 
  },
  resources: { money: 50 },
  upgrades: { 
    fertilizer: { level: 0, cost: 100 }, 
    autoHarvester: { level: 0, cost: 500 } 
  }
});
```

---

### 3. Missing Feature: Animal Production Timer

**Problem:** Animals have `produceReady: false` but nothing sets them to `true`. Animals need a timer to start producing.

**Fix in `GameStateProvider.tsx`:**

Add a 'TICK' action and a production timer:

```typescript
case 'TICK': {
  const newAnimals = { ...state.animals };
  
  Object.entries(newAnimals).forEach(([animalName, animal]) => {
    if (animal.count > 0 && !animal.produceReady) {
      // Random chance to produce based on cooldown
      const shouldProduce = Math.random() < 0.1; // 10% chance per tick
      
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
```

Or add to `AutomationControls.tsx` useEffect to dispatch a TICK action periodically.

---

### 4. Missing Feature: Sell Resources

**Problem:** No way to sell harvested crops/produce for money.

**Fix - Add SELL_RESOURCES action to reducer:**
```typescript
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
```

**Fix - Add Sell button to ResourcePanel:**
```typescript
const handleSell = (resource: string) => {
  const amount = state.resources[resource] || 0;
  if (amount > 0) {
    dispatch({ type: 'SELL_RESOURCES', resource, amount });
  }
};

// Add to JSX:
{state.resources.wheat > 0 && (
  <button onClick={() => handleSell('wheat')}>Sell Wheat</button>
)}
```

---

## Summary Checklist

- [ ] Fix `useCanvasDraw.ts` to connect to game state
- [ ] Update tests to match new UI text
- [ ] Add animal production timer logic
- [ ] Add SELL_RESOURCES action
- [ ] Add Sell buttons to ResourcePanel
- [ ] Run tests to verify all pass

---

## Final Verdict

**Great progress, GPT-4.1!** You went from ~20% complete to ~85% complete. Just a few more things to polish off.

Once these last items are fixed, the game will be playable!
