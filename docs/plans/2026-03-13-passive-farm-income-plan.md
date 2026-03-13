# Passive Farm Income Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform crops from manual harvest to passive $/s income, with upgradeable farms per crop.

**Architecture:** Add upgrade levels to crops, replace manual collection with automatic income tick, update UI to show farms and upgrades.

**Tech Stack:** React, TypeScript, localStorage persistence

---

### Task 1: Update GameState Types

**Files:**
- Modify: `src/gameState.ts:1-25`
- Test: `src/__tests__/gameState.test.ts`

**Step 1: Write the failing test**

```typescript
// In src/__tests__/gameState.test.ts, add test for new crop structure
test('initial state has upgradeLevel on crops', () => {
  const state = getInitialGameState();
  expect(state.crops.wheat.fertilizerLevel).toBe(0);
  expect(state.crops.wheat.irrigationLevel).toBe(0);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- gameState.test.ts`
Expected: FAIL with "Property 'fertilizerLevel' does not exist"

**Step 3: Update CropData interface and initial state**

In `src/gameState.ts`:
```typescript
export interface CropData {
  count: number;
  lastHarvest: number | null;
  cooldown: number;
  farmers: number;
  fertilizerLevel: number;
  irrigationLevel: number;
}
```

Update initial state to include upgrade levels (all start at 0).

**Step 4: Run test to verify it passes**

Run: `npm test -- gameState.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/gameState.ts src/__tests__/gameState.test.ts
git commit -m "feat: add upgrade levels to crop data"
```

---

### Task 2: Add Passive Income Actions to Reducer

**Files:**
- Modify: `src/providers/GameStateProvider.tsx:84-94`
- Modify: `src/providers/GameStateProvider.tsx:95-339`

**Step 1: Write the failing test**

```typescript
// Add test for passive income action
test('ADD_PASSIVE_INCOME adds money based on crop farms', () => {
  const state = {
    ...getInitialGameState(),
    crops: {
      wheat: { count: 1, lastHarvest: null, cooldown: 5000, farmers: 0, fertilizerLevel: 0, irrigationLevel: 0 }
    },
    resources: { ...getInitialGameState().resources, money: 0 }
  };
  // Wheat: 15 sell / 5 sec = 3 $/s * 1 farm = 3
  const newState = reducer(state, { type: 'ADD_PASSIVE_INCOME', crop: 'wheat' });
  expect(newState.resources.money).toBe(3);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- GameStateProvider.test.tsx`
Expected: FAIL with "Action type 'ADD_PASSIVE_INCOME' not allowed"

**Step 3: Add ADD_PASSIVE_INCOME and UPGRADE_FARM actions**

In `GameStateProvider.tsx`, add to GameAction type:
```typescript
| { type: 'ADD_PASSIVE_INCOME'; crop: string }
| { type: 'UPGRADE_FARM'; crop: string; upgradeType: 'fertilizer' | 'irrigation' }
```

Add reducer cases after existing cases:
```typescript
case 'ADD_PASSIVE_INCOME': {
  const crop = state.crops[action.crop];
  if (!crop || crop.count === 0) return state;
  
  const sellPrices: Record<string, number> = {
    wheat: 15, corn: 30, sunflower: 45, peas: 65, pumpkin: 85, potato: 110, tomato: 145
  };
  const baseCooldowns: Record<string, number> = {
    wheat: 5000, corn: 8000, sunflower: 10000, peas: 12000, pumpkin: 14000, potato: 17000, tomato: 21000
  };
  
  const sellPrice = sellPrices[action.crop] || 15;
  const cooldown = baseCooldowns[action.crop] || 5000;
  const baseIncomePerFarm = sellPrice / (cooldown / 1000);
  const multiplier = Math.pow(1.15, (crop.fertilizerLevel || 0) + (crop.irrigationLevel || 0));
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
  const crop = state.crops[action.crop];
  if (!crop || crop.count === 0) return state;
  
  const level = action.upgradeType === 'fertilizer' 
    ? (crop.fertilizerLevel || 0) 
    : (crop.irrigationLevel || 0);
  const cost = Math.floor(100 * Math.pow(2, level)); // Base 100, doubles each level
  
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
```

**Step 4: Run test to verify it passes**

Run: `npm test -- GameStateProvider.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/providers/GameStateProvider.tsx src/__tests__/GameStateProvider.test.tsx
git commit -m "feat: add passive income and farm upgrade actions"
```

---

### Task 3: Add Passive Income Tick to Game Loop

**Files:**
- Modify: `src/providers/GameStateProvider.tsx:384-400`

**Step 1: Write the failing test**

```typescript
test('passive income tick runs every second', () => {
  jest.useFakeTimers();
  const { state } = renderHookWithProvider();
  
  jest.advanceTimersByTime(1000);
  // Should have dispatched ADD_PASSIVE_INCOME for wheat
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- GameStateProvider.test.tsx`
Expected: FAIL (no tick implemented yet)

**Step 3: Add passive income interval**

Replace the existing auto-sell timer (lines 384-400) with passive income tick:
```typescript
// Passive income tick: add income every second
React.useEffect(() => {
  const interval = setInterval(() => {
    const cropKeys = Object.keys(state.crops) as (keyof typeof state.crops)[];
    for (const cropKey of cropKeys) {
      const crop = state.crops[cropKey];
      if (crop && crop.count > 0) {
        dispatch({ type: 'ADD_PASSIVE_INCOME', crop: cropKey });
      }
    }
  }, 1000);
  return () => clearInterval(interval);
}, [state]);
```

**Step 4: Run test to verify it passes**

Run: `npm test -- GameStateProvider.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/providers/GameStateProvider.tsx
git commit -m "feat: add passive income tick every second"
```

---

### Task 4: Update CropField UI

**Files:**
- Modify: `src/components/CropField.tsx`

**Step 1: Write the failing test**

```typescript
// In CropField.test.tsx
test('shows farm count instead of plot count', () => {
  render(<CropField />);
  expect(screen.getByText(/Farms:/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- CropField.test.tsx`
Expected: FAIL with "Unable to find text matching /Farms:/"

**Step 3: Update CropField UI**

In `src/components/CropField.tsx`:

1. Replace "Plots:" with "Farms:" (line 102)
2. Replace "Buy" button with "Buy Farm" 
3. Remove "Collect" button and farmer section
4. Add "Upgrade" button showing fertilizer/irrigation levels and costs
5. Show passive $/s per crop (already exists, verify it's correct)

Key UI changes:
- Remove: Collect button, Farmer section
- Change: "Plots" → "Farms", "Buy" → "Buy Farm"  
- Add: Upgrade buttons for fertilizer and irrigation per crop
- Show: Upgrade levels and costs

**Step 4: Run test to verify it passes**

Run: `npm test -- CropField.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/CropField.tsx src/__tests__/CropField.test.tsx
git commit -m "feat: update CropField UI for passive farm income"
```

---

### Task 5: Run Full Test Suite

**Step 1: Run all tests**

Run: `npm test`
Expected: ALL PASS

**Step 2: Run lint**

Run: `npm run lint`
Expected: No errors

**Step 3: Build project**

Run: `npm run build`
Expected: BUILD SUCCESS

**Step 4: Commit**

```bash
git add .
git commit -m "feat: implement passive farm income system"
```

---

### Task 6: Verify in Browser (Manual)

Open browser and verify:
1. Farms generate passive $/s automatically
2. Buying more farms increases income
3. Upgrade buttons work and increase income multiplier
4. Costs scale correctly
