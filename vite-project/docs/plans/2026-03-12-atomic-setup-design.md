# Idle Farm Atomic Setup & Pixel Art Design

**Date:** 2026-03-12

## 1. Project Scaffolding
- Vite + React + TypeScript (modern, modular, fast)
- Atomic folder structure:
  - `/src` – main app entry and logic
  - `/assets` – pixel art and static image assets
  - `/components` – modular UI (CropField, AnimalPen, UpgradeShop, PixelArtCanvas, etc)
  - `/hooks` – reusable atomic React hooks (useCanvasDraw, useAutosave, etc)

## 2. Pixel Art Integration
- PixelArtCanvas.tsx renders `<canvas>` grid for farm elements
- Drawing code for crops/animals: animated with Canvas API or fallback to small PNGs in `/assets`
- `/assets`: holds atomic farm element assets (e.g. crop-wheat.png, animal-cow.png)
- `/hooks`: powers Canvas draw/update, autosave, etc
- Testing: dummy pixel asset and crop drawing on init to validate atomic logic

## 3. Approvals & Expansion
- User confirmed all atomic structure, pixel art, and Canvas choices
- Expansion: add assets, drawing functions, and hooks as project grows

---
Approved by user: 2026-03-12
