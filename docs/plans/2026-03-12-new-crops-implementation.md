# Add Sunflower, Peas, Pumpkin, Potato, Tomato Crops Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add five new crops with gentle-to-steep cost/value scaling into the idle farm game.

**Architecture:** Extend existing crop config, state, UI, and test coverage to support new crops. Each crop will use the same mechanics but differ in cost, cooldown, and sell price for progression. All crops appear in the farm UI and autosave logic.

**Tech Stack:** React, TypeScript, localStorage, pixel art assets, manual/test-driven validation.

---

### Task 1: Update CROP_CONFIG in CropField.tsx

**Files:**
- Modify: `src/components/CropField.tsx` (lines 5-7)
- Test: `src/__tests__/CropField.test.tsx`

**Step 1:** Extend CROP_CONFIG object with five new crops and their values from the design table.
**Step 2:** Confirm CropField component lists these crops.

### Task 2: Update Initial State in gameState.ts

**Files:**
- Modify: `src/gameState.ts` (lines 16-19)
- Test: `src/__tests__/gameState.test.ts`

**Step 1:** Add new crops to crops initialization, with count: 0, lastHarvest: null, and their cooldowns.
**Step 2:** Add new crops to resources initialization, with value: 0.

### Task 3: Update Providers/Reducers for New Crops

**Files:**
- Modify: `src/providers/GameStateProvider.tsx`
- Test: `src/__tests__/GameStateProvider.test.tsx`

**Step 1:** Ensure provider logic (buy, collect, update, save/load) supports new crops.
**Step 2:** Confirm correct initialization, actions, and state mutation for new crops.

### Task 4: Update UI and ResourcePanel Display

**Files:**
- Modify: `src/components/ResourcePanel.tsx`
- Modify: `src/components/CropField.tsx` UI
- Test: `src/__tests__/ResourcePanel.test.tsx`

**Step 1:** Ensure UI loops and displays new crops correctly, visually and numerically.
**Step 2:** Check ResourcePanel for proper resource tracking and display for new crops.

### Task 5: Testing and Validation

**Files:**
- Modify: `src/__tests__/CropField.test.tsx`
- Modify: `src/__tests__/gameState.test.ts`
- Modify: `src/__tests__/GameStateProvider.test.tsx`
- Modify: `src/__tests__/ResourcePanel.test.tsx`

**Step 1:** Add/extend tests for new crops – Buy, Collect, Sell logic, progression, state update.
**Step 2:** Run tests, confirm correct logic and autosave.

### Task 6: Pixel Art Placeholder

**Files:**
- Reference: `src/assets/crop-dummy.png`
- Future: Add/update actual pixel art assets for each crop

**Step 1:** Ensure UI uses dummy asset for new crops;
**Step 2:** Document need for custom art later.

---

## Testing Instructions

- Run `npm test` to validate logic and UI for new crops. All new crops should appear, behave correctly, and autosave should persist changes.

## Commit Instructions

- Commit after each task completion.
- Use descriptive messages such as "feat: add sunflower crop config" or "test: validate tomato purchase logic".

## Handoff

Plan complete and saved to `docs/plans/2026-03-12-new-crops-implementation.md`. Two execution options:

1. **Subagent-Driven (this session)** — Fast step-by-step, agent reviews after each task.
2. **Parallel Session (separate)** — Batch execution in a new session, with checkpoints.

Which approach would you like to use?