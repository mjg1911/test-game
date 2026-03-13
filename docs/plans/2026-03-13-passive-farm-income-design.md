# Passive Farm Income Design

**Date:** 2026-03-13

## Overview

Transform the crop system from manual harvest to passive idle income. Each crop type becomes a "farm" that generates $/s automatically.

## Changes

### 1. Farm System
- Rename "Plots" to "Farms" in UI
- Each crop type (wheat, corn, sunflower, etc.) has its own farm count
- Income is generated automatically per second (no manual collection needed)
- Formula: `(baseSellPrice / cooldownSeconds) * farmCount * (1.15 ^ upgradeLevel)`

### 2. Game State Updates
- Add `upgradeLevel` to each crop in CropData
- Add `baseCooldown` (rename existing cooldown tracking)
- Calculate income per second dynamically

### 3. Upgrade System
- Each crop has its own upgrade level (starts at 0)
- Each upgrade multiplies that crop's income by 1.15x
- Upgrade cost formula: `baseUpgradeCost * (2 ^ upgradeLevel)`
- Two upgrade types per crop:
  - **Fertilizer**: +15% income per level
  - **Irrigation**: Additional +15% income per level (stacks with fertilizer)

### 4. UI Changes
- CropField component:
  - "Buy" button becomes "Buy Farm" 
  - Add "Upgrade" button showing current level and cost
  - Remove "Collect" button (no longer needed)
  - Remove "Farmer" system (replaced by passive income)
- Show $/s per crop in the crop label

### 5. Passive Income Tick
- Game loop ticks every second to add passive income
- Or use smaller tick interval with fractional amounts

## Acceptance Criteria
1. Each crop generates passive $/s automatically
2. Buying more farms increases income proportionally
3. Upgrading farms multiplies income by 1.15x per upgrade
4. Two upgrade types stack multiplicatively
5. Upgrade costs scale exponentially
6. UI reflects "farm" terminology, not "plots"
7. All existing tests pass or are updated
