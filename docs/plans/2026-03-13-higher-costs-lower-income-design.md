# Design: Higher Costs & Lower Income (Issue #19)

**Date:** 2026-03-13

## Overview

Make the game slower and more challenging by increasing farm costs and reducing income.

## Changes Summary

| Parameter | Current | New |
|-----------|---------|-----|
| Farm cost multiplier | 1.15 | 1.3 |
| Crop sell prices | 100% | 10% (90% reduction) |
| Animal cost multiplier | 1.15 | 1.3 |
| Animal sell prices | 100% | 10% |
| Starting money | $500 | $30 |

## Files to Modify

1. **`src/gameState.ts`** - Starting money ($30)
2. **`src/providers/GameStateProvider.tsx`** - Cost multipliers (1.3) and sell prices (10%)
3. **`src/components/CropField.tsx`** - Display cost calculation (1.3)
4. **`src/__tests__/gameState.test.ts`** - Update expected starting money

## Implementation Details

### Cost Multipliers
- Farm costs: `Math.floor(baseCost * Math.pow(1.3, count))`
- Animal costs: `Math.floor(baseCost * Math.pow(1.3, count))`
- Upgrade costs: Keep current (already uses 2.0)

### Sell Price Reduction
- Crops: Multiply by 0.1 (SELL_PRICES keys)
- Animals: Multiply by 0.1 (config.baseCost used for earnings)

### Passive Income
- Automatically reduced since it uses sell prices
- No separate change needed

## Testing

- Update `gameState.test.ts` to expect $30 starting money
- Run all tests to verify no regressions