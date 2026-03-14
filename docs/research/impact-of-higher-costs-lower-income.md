# Research: Impact of Increasing Costs & Reducing Income for Farms (Idle Farm Game)

## Overview

This document analyzes the likely player experience and technical impact if we:
1. **Increase the prices of all farms sharply**
2. **Reduce all crops' per-second value by 90% (i.e., gain is only 10% of previous)**

## How to Apply The Changes

### 1. How to Increase Farm Prices

- **Change the price scaling exponent** in `getCost` in `src/components/CropField.tsx`:
  ```js
  // Before
  const getCost = (baseCost, count) => Math.floor(baseCost * Math.pow(1.15, count));
  // After (example for drastic price growth)
  const getCost = (baseCost, count) => Math.floor(baseCost * Math.pow(1.25, count));
  ```

- **Raise all CROP_CONFIG baseCost values** for every crop (double, triple, etc. for even stronger effect).

### 2. How to Reduce Value Per Second by 90%

- Lower all crop `sellPrice` values in `CROP_CONFIG` by 90% (multiply by 0.1):
  ```js
  // Before
  wheat: { baseCost: 10, cooldown: 5000, sellPrice: 15 },
  // After
  wheat: { baseCost: 10, cooldown: 5000, sellPrice: 1.5 },
  // (Repeat for all crops)
  ```
- Alternatively, multiply all income (per-second) calculations by 0.1, but the more robust long-term fix is to adjust `sellPrice`.

## Anticipated Gameplay Impact

### Economic & Gameplay Feel
- **Farm purchases will become much more expensive!**
  - Exponential scaling means the price increases much more steeply with each purchase
  - Players will unlock and buy new farms at a much slower rate—pacing will slow considerably
- **Income per second drops to 1/10th of previous**
  - Every upgrade or new farm "feels" weaker and progress to next goal takes much longer
  - Players must wait 10 times longer for upgrades, unlocks, or big purchases
- **Net Result**: The entire game shifts from rapid/arcade-style progression to a "true idle/clicker" pacing where patience and long AFK (away from keyboard) play is rewarded

### Pros & Cons
**Pros:**
- Greatly increases longevity (long-term engagement/retention)
- Prevents players from racing through all crops and upgrades too quickly

**Cons/Warnings:**
- Early game may become frustrating/boring if not carefully rebalanced
- Players may churn (quit) if progress feels too slow at the start
- May require "early burst" design, login bonuses, or achievement multipliers to keep engagement high

### Game Design Recommendations
- Test income curves at milestones (10, 25, 50, 100 farms) to ensure no purchases require hours/days in early game
- Leave room for tuning (can soften early game, but keep late game slow)
- Consider gradual ramp for price scaling (e.g., exponent increases slowly across early/mid/late game)

## Example of Modified CROP_CONFIG for 90% Lower Yields
```js
const CROP_CONFIG = {
  wheat: { baseCost: 30, cooldown: 5000, sellPrice: 1.5 },
  corn: { baseCost: 60, cooldown: 8000, sellPrice: 3 },
  sunflower: { baseCost: 90, cooldown: 10000, sellPrice: 4.5 },
  peas: { baseCost: 120, cooldown: 12000, sellPrice: 6.5 },
  pumpkin: { baseCost: 150, cooldown: 14000, sellPrice: 8.5 },
  potato: { baseCost: 210, cooldown: 17000, sellPrice: 11 },
  tomato: { baseCost: 300, cooldown: 21000, sellPrice: 14.5 },
};
```
And price scaling in `getCost`:
```js
const getCost = (baseCost, count) => Math.floor(baseCost * Math.pow(1.25, count));
```

## Final Thoughts
- These changes produce a much slower, longer-paced idle game.
- There is a risk of stalling out new players—test and consider “first-play” or “welcome” bonuses to offset.
- Document all changes and keep parameterization modular for future rebalance cycles.

---

For further balancing, run simulated playthroughs with various pace multipliers, and tweak starting resources or bonuses as needed.
