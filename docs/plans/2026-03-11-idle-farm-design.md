# Idle Farm Browser Game Design (Pixel Art, Modular, Vibe Coding Friendly)

**Date:** 2026-03-11

## 1. Overall Structure
- React SPA for desktop browser—modular components for each feature
- Pixel art graphics via Canvas or small image assets
- All progress auto-saved to localStorage
- Player actions: crop/animal management, upgrades, automation

## 2. Component Breakdown
- CropField: Plant/harvest logic, progress bar/button, pixel art
- AnimalPen: Buy/collect/sell, each animal modular, pixel art
- UpgradeShop: List/modal, atomic purchase logic
- AutomationControls: Toggle automation, quick access UI
- ResourcePanel: Tracks/display money, produce, yields
- PixelArtCanvas: Smallest asset-drawing functions per farm element
- GameState: Divides crops, animals, money, upgrades for easy test/development

## 3. UI Layout & Player Flow
- Column layout: ResourcePanel (top), FarmDashboard (middle, with CropField/AnimalPen), UpgradeShop (side/modal), AutomationControls (bottom/floating)
- All actions are button-driven, immediate feedback
- UI wireframes are atomic and actionable

## 4. Error Handling & Testing
- Non-blocking UI feedback for errors
- Each component/action is independently tested (manual/quick tests)
- Autosave is validated and robust

## 5. Persistence & Unlocks
- LocalStorage for saves; load/reset logic easy to test
- Unlocks handled modularly: milestones unlock new features/UI, keeping scope tight
- Export/import can be added later
