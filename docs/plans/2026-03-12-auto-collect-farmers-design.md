# Auto-Collect Farmers Feature Design

**Date:** 2026-03-12

## Overview
Implements per-crop automation via buyable farmers. Each farmer automatically sells a stack of up to 10 (or whatever is available) on each crop's timer. Unlimited farmers per crop allowed, price escalates per farmer. Designed for robust, modular expansion.

---

## Requirements
- Players can buy farmers for each crop individually (unlimited, price increases per farmer).
- "Buy Farmer (price)" button per crop, shows owned farmers and updates price.
- Each farmer auto-sells one stack per timer (up to 10, or as available).
- Multiple farmers = multiple stacks sold per timer interval.
- Simple status text per crop: "Auto-sell active" when farmer owned.
- Money from auto-sell is credited instantly.
- Manual collection available for leftovers.
- No global automation interaction—per-crop logic only.

---

## Game State Changes
Extend crop data structure with a `farmers` property:

```js
crops: {
  wheat: { count: 12, lastHarvest: null, cooldown: 5000, farmers: 0 },
  corn: { count: 7, lastHarvest: null, cooldown: 8000, farmers: 1 },
  // ...
}
```

- Initial value: `farmers = 0` for all crops.
- Increase when player buys, tracked per crop.

---

## Per-Crop Auto-Collect Logic
- On each crop's timer completion:
    - For each farmer owned for that crop, auto-sell up to 10 units (or as available).
    - Repeat for total number of farmers.
    - Leftovers remain for manual collection.
- Money credited instantly for each batch sold.
- No popups/extra feedback for auto-sell events.

---

## UI Changes
In each crop tab:
- Add "Buy Farmer (price)" button.
    - Shows dynamic price based on current farmer count—example: `100 × baseCost × 1.15^farmersOwned`.
    - Shows current number owned for that crop.
    - Disabled if player lacks funds.
- Status text "Auto-sell active" shown when at least one farmer is owned for the crop.

---

## Pricing Logic
- First farmer price: `100 × baseCost`.
- Each additional farmer: price escalates by 1.15 per owned, e.g., `price = 100 × baseCost × 1.15^farmersOwned`.
- Price is displayed on "Buy Farmer" button, updates dynamically.

---

## Error Handling & Testability
- Prevent buying farmer if insufficient funds (show error message).
- Prevent buying if no plot owned for crop.
- Robust tests: buying farmer, auto-sell, money updates, UI display.
- Autosave handles new state property (`farmers`).

---

## Extensibility
- Logic allows for future upgrades, achievements, or special farmer types.
- Can add bonus effects or upgrades to farmers without breaking current mechanic.

---

## Success Criteria
- Farmer mechanic works as described: parallel auto-sell per timer, no limit on count, manual collection available, dynamic price logic and display.
- No negative impact on global automation, animal pens, or existing idle mechanics.

---

*End of design*
