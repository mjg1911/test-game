# Idle Farm Game: Crop Price & Value Per Second Research

## Where Are Crop Price/Value Handled?

### 1. How Crop Prices and Yields Are Structured

#### Core Data Source
- All prices and crop yields are centered in an object named `CROP_CONFIG` in `src/components/CropField.tsx`.
    ```js
    const CROP_CONFIG = {
      wheat:     { baseCost: 10,   cooldown: 5000,  sellPrice: 15   },
      corn:      { baseCost: 20,   cooldown: 8000,  sellPrice: 30   },
      sunflower: { baseCost: 30,   cooldown: 10000, sellPrice: 45   },
      peas:      { baseCost: 40,   cooldown: 12000, sellPrice: 65   },
      pumpkin:   { baseCost: 50,   cooldown: 14000, sellPrice: 85   },
      potato:    { baseCost: 70,   cooldown: 17000, sellPrice: 110  },
      tomato:    { baseCost: 100,  cooldown: 21000, sellPrice: 145  }
    };
    ```
- These values match the table in `docs/plans/2026-03-12-new-crops-design.md`.

#### Dynamic Cost (Price per Crop Farm)
- Buying additional farms for a crop increases its price, using exponential scaling:
    ```js
    const getCost = (baseCost, count) => Math.floor(baseCost * Math.pow(1.15, count));
    ```
    - `baseCost` is from `CROP_CONFIG`
    - The `count` is how many of that crop you already own (meaning price rises for each purchase)

### 2. Value/Income per Second

#### Yield Calculation
- Each crop has a `sellPrice` (the gain per harvest)
- Each crop has a `cooldown` in milliseconds (how long per harvest)
- Therefore, the basic yield rate per farm is:
    ```
    yield_per_second = sellPrice / (cooldown / 1000)
    total_income_per_second = yield_per_second * count * upgrade_multiplier
    ```
- Upgrades (“fertilizer” and “irrigation”) further multiply yield:
    - Fertilizer: +25% income per level (`1 + 0.25*level`)
    - Irrigation: +10% income per level (`1 + 0.1*level`)
- In UI, the yield per second per crop is calculated and displayed as:
    ```js
    incomePerSecond = Math.floor(
      (count * sellPrice * fertilizerMultiplier * irrigationMultiplier) / (cooldown / 1000)
    )
    ```

#### Where Is This Used?
- Calculated in both the farm UI (per-crop in `CropField.tsx`) and summary (`ResourcePanel.tsx`)
- ResourcePanel adds up all crops’ per-second income for “Passive income”
- All values (cost, yield, upgrades) can be traced and changed via `CROP_CONFIG` and its usage

### 3. Game State (Where the Data Lives)

- Initial crop/farm state is set in `src/gameState.ts` in the `getInitialGameState` function
    - This includes starting counts, last harvest times, upgrade levels for each crop
- Resources (money and crops harvested) are tracked here as well

## How Can These Values Be Changed for Balancing?

- To tweak base price/cost, cooldown, or sell price for a crop:  
  Edit `CROP_CONFIG` in `src/components/CropField.tsx`
    - e.g., Change `baseCost`, `cooldown`, or `sellPrice` for any crop
- To change how cost scales for each new farm:  
  Edit the exponent or base in `getCost` in `CropField.tsx`
- To increase/decrease yield from upgrades:  
  Change the multipliers in the upgrade logic (lines 59-60)

## Summary Table

| Parameter        | Set In File(s)                     | Change Process          |
|------------------|------------------------------------|------------------------|
| baseCost         | CropField.tsx (`CROP_CONFIG`)      | Edit the value         |
| sellPrice        | CropField.tsx, ResourcePanel.tsx   | Edit the value         |
| cooldown         | CropField.tsx, gameState.ts        | Edit the value         |
| price scaling    | CropField.tsx (`getCost`)          | Edit formula           |
| per-sec yield    | CropField.tsx, ResourcePanel.tsx   | Edit sellPrice/cooldown|
| upgrade impact   | CropField.tsx (multiplier code)    | Edit multiplier logic  |

## Code Location Map

- `src/components/CropField.tsx`  
  - `CROP_CONFIG`: Where to change/copy core values
  - `getCost()`: Dynamic buy price scaling
  - Income per second logic per crop; displayed in UI

- `src/gameState.ts`  
  - Initial crop state, links cooldown and tracking

- `src/components/ResourcePanel.tsx`  
  - Totals up all crop income per second for display

- `docs/plans/2026-03-12-new-crops-design.md`  
  - Reference for initial design values, use as a guide

## Example Formula

Let’s say you want to balance “peas”:
- Want to make peas more lucrative but slow to grow:  
  Change in `CROP_CONFIG`—
  - “peas”: `{ baseCost: 40, cooldown: 15000, sellPrice: 80 }`
- Want it to be cheaper to buy more peas farms:  
  In `getCost`, lower the exponent (e.g., from 1.15 to 1.10)

---

This research can be updated whenever you rebalance values or need to track pricing/yield code locations.
