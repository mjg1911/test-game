# Crop Implementation Template (Wheat Example)

This document explains how Wheat was implemented. Use this as a template for adding new crops or animals.

---

## 1. Data Structure (gameState.ts)

### Interface Definition
```typescript
export interface CropData {
  count: number;           // Number of plots owned
  lastHarvest: number | null; // Timestamp of last harvest
  cooldown: number;        // Time in ms between harvests
}

export interface AnimalData {
  count: number;
  lastHarvest: number | null;
  cooldown: number;
  produceType: string;     // 'eggs', 'milk', 'wool'
}
```

### Initial State
Add your new crop to `getInitialGameState()`:
```typescript
crops: {
  wheat: { count: 0, lastHarvest: null, cooldown: 5000 },
  corn: { count: 0, lastHarvest: null, cooldown: 8000 },
  // Add new crop here, e.g.:
  // alpaca: { count: 0, lastHarvest: null, cooldown: 15000 },
},
```

### Resources
Add the harvested resource to resources:
```typescript
resources: {
  money: 50,
  wheat: 0,
  corn: 0,
  eggs: 0,
  milk: 0,
  // Add new resource here, e.g.:
  // wool: 0,
},
```

---

## 2. Configuration (CropField.tsx / AnimalPen.tsx)

### Cost Formula
Price increases by 15% for each plot owned:
```typescript
const getCost = (baseCost: number, count: number) => 
  Math.floor(baseCost * Math.pow(1.15, count));
```

Define crop/animal properties:
```typescript
const CROP_CONFIG = {
  wheat: { baseCost: 10, cooldown: 5000 },
  corn: { baseCost: 20, cooldown: 8000 },
  // Add new crop config here, e.g.:
  // alpaca: { baseCost: 50, cooldown: 15000 },
};

const ANIMAL_CONFIG = {
  cow: { baseCost: 100, cooldown: 10000 },
  chicken: { baseCost: 25, cooldown: 5000 },
};
```

| Property | Description |
|----------|-------------|
| baseCost | Starting price for first plot |
| cooldown | Milliseconds between harvests |

---

## 3. Reducer Actions (GameStateProvider.tsx)

### BUY_PLOT / BUY_ANIMAL Action
- Checks if player has enough money
- Calculates cost using formula: `baseCost * 1.15^count`
- Increments count
- Sets lastHarvest on first purchase (starts cooldown)

```typescript
case 'BUY_PLOT': {
  const cropConfig = {
    wheat: { baseCost: 10, cooldown: 5000 },
    corn: { baseCost: 20, cooldown: 8000 },
  };
  const config = cropConfig[action.crop];
  
  const count = state.crops[action.crop].count;
  const cost = Math.floor(config.baseCost * Math.pow(1.15, count));
  
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
```

### COLLECT_CROP / COLLECT_ANIMAL Action
- Checks if cooldown has passed
- Rewards: `sellPrice * count` for money
- Rewards: `count` for the resource (wheat, eggs, etc.)
- Resets lastHarvest timestamp

```typescript
case 'COLLECT_CROP': {
  const crop = state.crops[action.crop];
  if (!crop || crop.count === 0) return state;
  
  const lastHarvest = crop.lastHarvest || Date.now();
  const elapsed = Date.now() - lastHarvest;
  if (elapsed < crop.cooldown) return state;

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
```

---

## 4. UI Component (CropField.tsx)

### Display Shows
- Current count of plots owned
- Next cost (scaling)
- Countdown timer or READY indicator

```tsx
// Cost display
const currentCost = getCost(CROP_CONFIG[selectedCrop].baseCost, state.crops[selectedCrop].count);

// Timer logic
const getTimeRemaining = (lastHarvest: number | null, cooldown: number) => {
  if (!lastHarvest) return { ready: true, text: 'READY' };
  const elapsed = Date.now() - lastHarvest;
  const remaining = Math.max(0, cooldown - elapsed);
  if (remaining === 0) return { ready: true, text: '⏰ READY!' };
  const seconds = Math.ceil(remaining / 1000);
  return { ready: false, text: `⏳ ${seconds}s` };
};
```

---

## 5. Quick Reference: Adding a New Crop

| File | Changes |
|------|---------|
| `gameState.ts` | Add to `crops` object + add resource |
| `CropField.tsx` | Add to `CROP_CONFIG` + dropdown option |
| `GameStateProvider.tsx` | Add to crop config in BUY_PLOT + COLLECT_CROP + sellPrices |

---

## Example: Adding Alpaca (Produces Wool)

1. **gameState.ts**
```typescript
alpaca: { count: 0, lastHarvest: null, cooldown: 15000 }
// + add wool: 0 to resources
```

2. **CropField.tsx**
```typescript
const CROP_CONFIG = {
  // existing...
  alpaca: { baseCost: 50, cooldown: 15000 }
};
// + add option to select dropdown: <option value="alpaca">🦙 Alpaca</option>
```

3. **GameStateProvider.tsx**
```typescript
// In BUY_PLOT:
const cropConfig = {
  // existing...
  alpaca: { baseCost: 50, cooldown: 15000 },
};

// In COLLECT_CROP:
const sellPrices = { 
  wheat: 15, 
  corn: 30,
  alpaca: 40  // Add sell price
};
```

---

## Key Mechanics Summary

| Feature | Formula/Value |
|---------|---------------|
| Cost scaling | `baseCost * 1.15^count` |
| Wheat cooldown | 5000ms (5s) |
| Corn cooldown | 8000ms (8s) |
| Chicken cooldown | 5000ms (5s) |
| Cow cooldown | 10000ms (10s) |
| Wheat sell price | $15 per plot |
| Corn sell price | $30 per plot |

That's it! The UI will automatically display the new crop with scaling costs and collect rewards based on plot count.
