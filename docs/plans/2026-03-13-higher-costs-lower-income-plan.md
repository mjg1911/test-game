# Higher Costs & Lower Income Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement Issue #19: higher farm costs (1.3x), 90% income reduction, $30 starting money

**Architecture:** Modify cost multiplier constants and sell prices in provider and gameState files

**Tech Stack:** React, TypeScript, Vitest

---

### Task 1: Update Starting Money

**Files:**
- Modify: `src/gameState.ts:38`
- Test: `src/__tests__/gameState.test.ts:40`

**Step 1: Write the failing test**

```typescript
// In src/__tests__/gameState.test.ts, add a test case
test("initial state has $30 starting money", () => {
  const state = getInitialGameState();
  expect(state.resources.money).toBe(30);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- gameState.test.ts`
Expected: FAIL - expected 30, got 500

**Step 3: Write minimal implementation**

```typescript
// In src/gameState.ts line 38
money: 30,  // was 500
```

**Step 4: Run test to verify it passes**

Run: `npm test -- gameState.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/gameState.ts src/__tests__/gameState.test.ts
git commit -m "feat: reduce starting money to $30 (#19)"
```

---

### Task 2: Update Farm Cost Multiplier in Provider

**Files:**
- Modify: `src/providers/GameStateProvider.tsx:6`

**Step 1: Write the failing test**

```typescript
// Add to gameState.test.ts
test("farm cost multiplier is 1.3", () => {
  const config = cropConfig.wheat;
  const cost = Math.floor(config.baseCost * Math.pow(1.3, 1));
  expect(cost).toBe(13); // 10 * 1.3 = 13
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- gameState.test.ts`
Expected: FAIL - current multiplier is 1.15

**Step 3: Write minimal implementation**

```typescript
// In src/providers/GameStateProvider.tsx line 6
const INCOME_MULTIPLIER = 1.3;  // was 1.15
```

**Step 4: Run test to verify it passes**

Run: `npm test -- gameState.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/providers/GameStateProvider.tsx src/__tests__/gameState.test.ts
git commit -m "feat: increase farm cost multiplier to 1.3 (#19)"
```

---

### Task 3: Reduce Crop Sell Prices to 10%

**Files:**
- Modify: `src/providers/GameStateProvider.tsx:8-10`

**Step 1: Write the failing test**

```typescript
// Add to gameState.test.ts
test("crop sell prices are reduced to 10%", () => {
  const state = getInitialGameState();
  // Test that ADD_PASSIVE_INCOME produces 10% of previous
  const newState = reducer(state, { type: 'ADD_PASSIVE_INCOME', crop: 'wheat' });
  // With 0 farms, income should be 0
  const withFarm = reducer(
    { ...state, crops: { ...state.crops, wheat: { ...state.crops.wheat, count: 1 } } },
    { type: 'ADD_PASSIVE_INCOME', crop: 'wheat' }
  );
  // Should be small (10% of ~3/s = 0.3/s)
  const income = withFarm.resources.money - 30;
  expect(income).toBeLessThan(1);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- gameState.test.ts`
Expected: FAIL - income currently ~3/s

**Step 3: Write minimal implementation**

```typescript
// In src/providers/GameStateProvider.tsx lines 8-10
const SELL_PRICES: Record<string, number> = {
  wheat: 1.5, corn: 3, sunflower: 4.5, peas: 6.5, pumpkin: 8.5, potato: 11, tomato: 14.5
};
// Multiply all by 0.1 (was: 15, 30, 45, 65, 85, 110, 145)
```

**Step 4: Run test to verify it passes**

Run: `npm test -- gameState.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/providers/GameStateProvider.tsx src/__tests__/gameState.test.ts
git commit -m "feat: reduce crop sell prices to 10% (#19)"
```

---

### Task 4: Update CropField Display

**Files:**
- Modify: `src/components/CropField.tsx:14`

**Step 1: Write the failing test**

```typescript
// Add to CropField.test.ts
test("farm cost uses 1.3 multiplier", () => {
  // Test the getCost function
  const getCost = (baseCost: number, count: number) => Math.floor(baseCost * Math.pow(1.3, count));
  expect(getCost(10, 0)).toBe(10);
  expect(getCost(10, 1)).toBe(13);
  expect(getCost(10, 2)).toBe(17);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- CropField.test.ts`
Expected: FAIL - current uses 1.15

**Step 3: Write minimal implementation**

```typescript
// In src/components/CropField.tsx line 14
const getCost = (baseCost: number, count: number) => Math.floor(baseCost * Math.pow(1.3, count));
// was: Math.pow(1.15, count)
```

**Step 4: Run test to verify it passes**

Run: `npm test -- CropField.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/CropField.tsx src/__tests__/CropField.test.ts
git commit -m "feat: update CropField to use 1.3 cost multiplier (#19)"
```

---

### Task 5: Update Animal Cost Multiplier

**Files:**
- Modify: `src/providers/GameStateProvider.tsx:236`

**Step 1: Write the failing test**

```typescript
// Add to GameStateProvider.test.ts
test("animal cost uses 1.3 multiplier", () => {
  // Line 236 in provider uses 1.15 for animals
  const cost = Math.floor(250 * Math.pow(1.3, 1));
  expect(cost).toBe(325); // 250 * 1.3
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- GameStateProvider.test.ts`
Expected: FAIL

**Step 3: Write minimal implementation**

```typescript
// In src/providers/GameStateProvider.tsx line 236
const cost = Math.floor(config.baseCost * Math.pow(1.3, count));
// was: Math.pow(1.15, count)
```

**Step 4: Run test to verify it passes**

Run: `npm test -- GameStateProvider.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/providers/GameStateProvider.tsx
git commit -m "feat: increase animal cost multiplier to 1.3 (#19)"
```

---

### Task 6: Reduce Animal Sell Prices to 10%

**Files:**
- Modify: `src/providers/GameStateProvider.tsx:277`

**Step 1: Write the failing test**

```typescript
// Add to GameStateProvider.test.ts
test("animal sell prices reduced to 10%", () => {
  const state = getInitialGameState();
  const newState = reducer(state, { type: 'COLLECT_ANIMAL', animal: 'chicken' });
  // Should earn 10% of previous (was 250, now 25)
  expect(newState.resources.money).toBe(55); // 30 + 25
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- GameStateProvider.test.ts`
Expected: FAIL - currently 280 (30 + 250)

**Step 3: Write minimal implementation**

```typescript
// In src/providers/GameStateProvider.tsx line 277
const moneyEarned = (config ? config.baseCost * animal.count : 0) * 0.1;
// Multiply by 0.1 to reduce to 10%
```

**Step 4: Run test to verify it passes**

Run: `npm test -- GameStateProvider.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/providers/GameStateProvider.tsx
git commit -m "feat: reduce animal sell prices to 10% (#19)"
```

---

### Task 7: Run Full Test Suite

**Step 1: Run all tests**

Run: `npm test`
Expected: All pass

**Step 2: Commit**

```bash
git commit -m "chore: all tests pass for higher costs/lower income (#19)"
```