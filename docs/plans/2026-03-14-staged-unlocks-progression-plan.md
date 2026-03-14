# Staged Unlocks Progression Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement progressive unlock system for crops, animals, and upgrades with sequential reveal and milestone-based upgrade visibility

**Architecture:** Add unlock state to game state, define unlock costs config, add unlock actions to reducer, update UI components to respect locks

**Tech Stack:** React, TypeScript, localStorage persistence

---

### Task 1: Add Unlock Configuration

**Files:**
- Modify: `src/gameState.ts:1-60`

**Step 1: Add unlock cost constants**

Add after line 8:
```typescript
export const CROP_UNLOCK_COSTS: Record<string, number> = {
  wheat: 0,
  corn: 0,
  sunflower: 600,
  peas: 2500,
  pumpkin: 12000,
  potato: 70000,
  tomato: 200000
};

export const ANIMAL_UNLOCK_COSTS: Record<string, number> = {
  chicken: 5000,
  rabbit: 15000,
  duck: 40000,
  sheep: 100000,
  goat: 250000,
  pig: 600000,
  cow: 1500000
};

export const CROP_ORDER = ['wheat', 'corn', 'sunflower', 'peas', 'pumpkin', 'potato', 'tomato'];
export const ANIMAL_ORDER = ['chicken', 'rabbit', 'duck', 'sheep', 'goat', 'pig', 'cow'];
```

**Step 2: Commit**
```bash
git add src/gameState.ts
git commit -m "feat: add unlock cost configuration"
```

---

### Task 2: Update Game State with Unlock Fields

**Files:**
- Modify: `src/gameState.ts:17-60`

**Step 1: Modify getInitialGameState**

Replace the function to include unlock fields:
```typescript
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
      wheat: 0, corn: 0, sunflower: 0, peas: 0, pumpkin: 0, potato: 0, tomato: 0,
      eggs: 0, milk: 0, wool: 0, bacon: 0, cheese: 0, fur: 0, feathers: 0
    },
    upgrades: {
      fertilizer: { level: 0, cost: 100 },
      autoHarvester: { level: 0, cost: 500 }
    },
    unlockedCrops: ['wheat', 'corn'],
    revealedCrops: ['wheat', 'corn', 'sunflower'],
    unlockedAnimals: [],
    revealedAnimals: ['chicken']
  }
}
```

**Step 2: Commit**
```bash
git add src/gameState.ts
git commit -m "feat: add unlock state fields to initial game state"
```

---

### Task 3: Add Unlock Actions to Provider

**Files:**
- Modify: `src/providers/GameStateProvider.tsx:103-125`

**Step 1: Update GameState interface**

Add to interface around line 103:
```typescript
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
```

**Step 2: Add action types**

Modify line ~111-122 to add:
```typescript
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
```

**Step 3: Add reducer cases**

Add before the `default:` case in reducer (~line 390):
```typescript
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
```

**Step 4: Import constants**

Add to top of file after existing imports:
```typescript
import { CROP_UNLOCK_COSTS, ANIMAL_UNLOCK_COSTS, CROP_ORDER, ANIMAL_ORDER } from '../gameState';
```

**Step 5: Run tests**
```bash
npm test
```

**Step 6: Commit**
```bash
git add src/providers/GameStateProvider.tsx
git commit -m "feat: add UNLOCK_CROP and UNLOCK_ANIMAL actions to reducer"
```

---

### Task 4: Add Helper Functions

**Files:**
- Modify: `src/providers/GameStateProvider.tsx`

**Step 1: Add helper functions after getIncomeMultiplier (~line 21)**

```typescript
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
```

**Step 2: Commit**
```bash
git add src/providers/GameStateProvider.tsx
git commit -m "feat: add unlock helper functions"
```

---

### Task 5: Update CropField Component

**Files:**
- Modify: `src/components/CropField.tsx:50-150`

**Step 1: Import new helpers**

Update import line 2:
```typescript
import { useGameStateContext, getIncomeMultiplier, getRevealedUnlockedCrops, getRevealedLockedCrops, getCropUnlockCost } from '../providers/GameStateProvider';
```

**Step 2: Update render logic**

Replace the mapping at line 53 to filter revealed crops:
```typescript
const unlockedCrops = getRevealedUnlockedCrops(state);
const lockedCrops = getRevealedLockedCrops(state);

return (
  <div>
    <div className="pixel-grid">
      {unlockedCrops.map(crop => {
        // existing crop rendering logic
      })}
    </div>
    
    {lockedCrops.length > 0 && (
      <div style={{ marginTop: 16 }}>
        <h4 style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>🔒 Locked Crops</h4>
        <div className="pixel-grid">
          {lockedCrops.map(crop => {
            const cost = getCropUnlockCost(crop);
            const emoji = crop === 'sunflower' ? '🌻' : crop === 'peas' ? '🫛' : crop === 'pumpkin' ? '🎃' : crop === 'potato' ? '🥔' : '🍅';
            
            return (
              <div key={crop} className="pixel-stat" style={{ 
                padding: 12, 
                background: '#f0f0f0', 
                borderRadius: 8, 
                border: '2px dashed #999',
                opacity: 0.7
              }}>
                <div className="pixel-stat-label" style={{ fontSize: 14, marginBottom: 4 }}>
                  🔒 {emoji} {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </div>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 10, color: '#888' }}>UNLOCK COST</div>
                  <div style={{ fontSize: 18, fontWeight: 'bold', color: '#666' }}>${formatMoney(cost)}</div>
                </div>
                <button 
                  className="pixel-button" 
                  style={{ 
                    fontSize: 11, 
                    padding: '8px 16px',
                    marginTop: 8,
                    background: state.resources.money < cost ? '#aaa' : undefined,
                    cursor: state.resources.money < cost ? 'not-allowed' : 'pointer'
                  }}
                  onClick={() => dispatch({ type: 'UNLOCK_CROP', crop })}
                  disabled={state.resources.money < cost}
                >
                  Unlock
                </button>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
```

**Step 3: Run tests**
```bash
npm test
```

**Step 4: Commit**
```bash
git add src/components/CropField.tsx
git commit -m "feat: add crop unlock UI to CropField"
```

---

### Task 6: Update AnimalPen Component

**Files:**
- Modify: `src/components/AnimalPen.tsx`

**Step 1: Read current AnimalPen**

First check if file exists and its structure.

**Step 2: Add unlock functionality**

Add imports and state logic similar to CropField:
```typescript
import { useGameStateContext, getRevealedUnlockedAnimals, getRevealedLockedAnimals, getAnimalUnlockCost } from '../providers/GameStateProvider';

// In component:
const unlockedAnimals = getRevealedUnlockedAnimals(state);
const lockedAnimals = getRevealedLockedAnimals(state);

// Add unlock section at bottom
{lockedAnimals.length > 0 && (
  <div style={{ marginTop: 16 }}>
    <h4>🔒 Locked Animals</h4>
    {lockedAnimals.map(animal => {
      const cost = getAnimalUnlockCost(animal);
      return (
        <div key={animal}>
          <span>🔒 {animal}</span>
          <button onClick={() => dispatch({ type: 'UNLOCK_ANIMAL', animal })} disabled={state.resources.money < cost}>
            Unlock (${cost})
          </button>
        </div>
      );
    })}
  </div>
)}
```

**Step 3: Commit**
```bash
git add src/components/AnimalPen.tsx
git commit -m "feat: add animal unlock UI to AnimalPen"
```

---

### Task 7: Update UpgradeShop for Crop-Specific Upgrades

**Files:**
- Modify: `src/components/UpgradeShop.tsx`

**Step 1: Add crop-specific upgrade logic**

The upgrade shop needs to show per-crop fertilizer/irrigation upgrades. This is a larger change - we'll add a "Crop Upgrades" section.

**Step 2: Add new state for per-crop upgrade tracking**

Actually, looking at the current gameState, the fertilizer/irrigation levels are stored per-crop in the CropData. So we need to render per-crop upgrades in CropField (which already shows them at lines 125-141).

The key change is: show upgrade button ONLY when crop count >= 20.

**Step 3: Modify CropField upgrade visibility**

Update lines 125-141 in CropField to check crop count:
```typescript
{hasFarms && (
  <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px dashed rgba(0,0,0,0.2)' }}>
    {data.count >= 20 ? (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 9, color: '#888' }}>
          ↑ Fertilizer {fertilizerLevel} | Irrigation {irrigationLevel}
        </div>
        <button 
          className="pixel-button" 
          style={{ fontSize: 10, padding: '6px 12px' }}
          onClick={() => handleUpgrade(crop, nextUpgrade.type)}
          disabled={state.resources.money < upgradeCost}
        >
          {nextUpgrade.name} (${formatMoney(upgradeCost)})
        </button>
      </div>
    ) : (
      <div style={{ fontSize: 9, color: '#888', fontStyle: 'italic' }}>
        🔒 Upgrades unlock at 20 farms
      </div>
    )}
  </div>
)}
```

**Step 4: Commit**
```bash
git add src/components/CropField.tsx
git commit -m "feat: add upgrade visibility threshold (20 farms)"
```

---

### Task 8: Run Full Tests and Build

**Step 1: Run tests**
```bash
npm test
```

**Step 2: Run build**
```bash
npm run build
```

**Step 3: If lint exists, run it**
```bash
npm run lint
```

**Step 4: Commit any changes**
```bash
git add .
git commit -m "feat: complete staged unlocks progression system"
```

---

## Summary

Tasks: 8
- Task 1-2: Configuration and state setup
- Task 3-4: Reducer actions and helpers
- Task 5-7: UI components for crops, animals, upgrades
- Task 8: Testing and final verification
