# Idle Farm React Game State Design

**Date:** 2026-03-12

## 1. Architecture Overview
- [x] Central game state via React Context (`GameStateProvider`) with `useReducer` for updates
- [x] Unified state object matching farm features: crops, animals, resources, upgrades, automation controls
- [x] All major components access state and update logic via custom hook

## 2. LocalStorage Persistence & Import/Export
- [x] Provider loads saved game state from localStorage (if present) or falls back to `getInitialGameState`
- [x] Every state-changing action triggers localStorage save
- [ ] Export: Button downloads game state as JSON
- [ ] Import: Button/upload parses JSON and updates state atomically via dispatch (with error handling)

## 3. Component Access & API
- [x] Components use custom hook to read state and dispatch actions directly
- [x] No prop drilling; state sync is immediate everywhere
- [x] API exposes: `gameState`, `dispatch` (simple actions, no Redux selectors needed)

## 4. Testing & Error Handling
- [x] Automated tests for all actions, reducer logic, localStorage sync, import/export
- [ ] Import/export robust against malformed/invalid file inputs

---
Validated with user and ready for implementation planning.
