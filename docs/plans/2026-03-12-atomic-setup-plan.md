# Atomic Idle Farm Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Scaffold a modern, atomic idle farm game using Vite + React + TypeScript, modular folders, and atomic pixel art integration.

**Architecture:** Modular React SPA—easy testability, autosave with localStorage, pixel art via Canvas (or PNG assets). Standard folders for source, components, hooks, and assets. Focus on atomic UI actions and easy expansion.

**Tech Stack:** Vite, React, TypeScript, Canvas API, atomic PNG assets

---

### Task 1: Scaffold Vite + React + TypeScript Project
**Files:**
- Create: Entire project folder, e.g. `idle-farm-atomic/`
- Entry: `src/`

**Step 1:** Run `npm create vite@latest` and choose React + TypeScript template
**Step 2:** Confirm new folders: `/src`, `/public`
**Step 3:** Commit initial template

---

### Task 2: Atomic Folder Structure
**Files:**
- Create: `/assets`, `/components`, `/hooks` inside `/src`

**Step 1:** Add folders to `/src` directory
**Step 2:** Add placeholder files in each (dummy asset/image in `/assets`, `PixelArtCanvas.tsx` in `/components`, `useCanvasDraw.ts` in `/hooks`)
**Step 3:** Commit folder structure and placeholders

---

### Task 3: Pixel Art Canvas Integration
**Files:**
- Create: `src/components/PixelArtCanvas.tsx`
- Asset: `src/assets/crop-dummy.png`, `animal-dummy.png`
- Hook: `src/hooks/useCanvasDraw.ts`

**Step 1:** Write a simple test: Render PixelArtCanvas with dummy crop asset
**Step 2:** Run project, confirm canvas is displayed, with image or draw function
**Step 3:** Implement initial Canvas draw logic (draw pixel/grid, load dummy asset)
**Step 4:** Commit PixelArtCanvas and asset integration

---

### Task 4: Validate Atomic Setup and Pixel Art
**Files:**
- Test: Run project and confirm atomic UI, pixel art renders on Canvas
- Document: Add quick-readme section or log for atomic setup validation

**Step 1:** Run app, validate folder structure, modularity, and Canvas
**Step 2:** Record quick atomic test log (screenshot or simple .log file)
**Step 3:** Commit validation/test notes

---

Plan complete and saved to `docs/plans/2026-03-12-atomic-setup-plan.md`. Proceeding now with subagent-driven task execution for Task 1: Scaffold Vite + React + TypeScript Project.