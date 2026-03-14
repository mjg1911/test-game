# Design: Staged Crop and Upgrade Unlocks Progression System

**Date:** 2026-03-14
**Feature:** Issue #20 - Progressive unlock system for crops, animals, and upgrades

## Overview

Implement a staged progression system where crops, animals, and upgrades unlock sequentially as players accumulate wealth. This creates a sense of progression, prevents early overwhelm, and provides clear goals.

## 1. Data Structure

### New State Fields
```typescript
interface GameState {
  // ... existing fields
  unlockedCrops: string[];     // ['wheat', 'corn']
  revealedCrops: string[];     // Crops visible to player (next + unlocked)
  unlockedAnimals: string[];   // ['chicken']
  revealedAnimals: string[];   // Animals visible to player
}
```

### Unlock Configuration
```typescript
const CROP_UNLOCK_COSTS: Record<string, number> = {
  wheat: 0,        // Starter
  corn: 0,         // Starter
  sunflower: 600,
  peas: 2500,
  pumpkin: 12000,
  potato: 70000,
  tomato: 200000
};

const ANIMAL_UNLOCK_COSTS: Record<string, number> = {
  chicken: 5000,
  rabbit: 15000,
  duck: 40000,
  sheep: 100000,
  goat: 250000,
  pig: 600000,
  cow: 1500000
};
```

## 2. Starting State

- `unlockedCrops: ['wheat', 'corn']`
- `revealedCrops: ['wheat', 'corn', 'sunflower']` - next crop always revealed
- `unlockedAnimals: []`
- `revealedAnimals: ['chicken']` - first animal revealed

## 3. Unlock Progression

### Crops (Sequential Reveal)
| Crop | Unlock Cost |
|------|-------------|
| Wheat | Free (starter) |
| Corn | Free (starter) |
| Sunflower | 600 |
| Peas | 2,500 |
| Pumpkin | 12,000 |
| Potato | 70,000 |
| Tomato | 200,000 |

### Animals (Late Game)
| Animal | Unlock Cost |
|--------|-------------|
| Chicken | 5,000 |
| Rabbit | 15,000 |
| Duck | 40,000 |
| Sheep | 100,000 |
| Goat | 250,000 |
| Pig | 600,000 |
| Cow | 1,500,000 |

## 4. Upgrade Unlock Rules

- **Visibility**: Fertilizer/Irrigation upgrades for a crop become **visible** when player owns **20 or more** of that crop
- **Progression**: After purchasing an upgrade level, the next level becomes visible
- **Requirement display**: Locked upgrades show "Requires 20 [crop] farms"

## 5. UI Changes

### CropField Component
- Filter crops to only show `revealedCrops`
- Display lock icon with unlock cost for hidden crops in a separate "Unlock" section
- Only unlocked crops can be purchased

### AnimalPen Component
- Hide locked animals entirely (sequential reveal)
- Show unlock button with price for revealed but locked animals

### UpgradeShop Component
- Show locked upgrades with visual lock indicator
- Display requirement (e.g., "Requires 20 wheat farms")
- Show hover tooltip with upgrade benefits

## 6. Actions

```typescript
type GameAction =
  // ... existing actions
  | { type: 'UNLOCK_CROP'; crop: string }
  | { type: 'UNLOCK_ANIMAL'; animal: string };
```

### Reducer Logic
- `UNLOCK_CROP`: Deduct cost, add to `unlockedCrops`, reveal next crop
- `UNLOCK_ANIMAL`: Deduct cost, add to `unlockedAnimals`, reveal next animal

## 7. Persistence

- Unlock state saved to localStorage with game state
- Migration logic: existing saves get default unlocked/revealed values

## 8. Testing Considerations

- Test sequential unlocks work correctly
- Test upgrade visibility at 20 crop threshold
- Test save/load preserves unlock state
- Test UI correctly hides/shows based on state
