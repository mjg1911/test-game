# Basic UI Skeleton Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a modular UI skeleton for the idle farm game with atomic stub components, layout, and demo actions, enabling fast expansion and clear testability.

**Architecture:** Atomic React SPA layout; five standalone components (ResourcePanel, CropField, AnimalPen, UpgradeShop, AutomationControls) composed in App.tsx. Each component has stub content, demo buttons, and basic state.

**Tech Stack:** React + TypeScript + Vite; minimal CSS modules; Jest/React Testing Library for tests.

---

### Task 1: ResourcePanel Stub Component

**Files:**
- Create: `vite-project/src/components/ResourcePanel.tsx`
- Modify: `vite-project/src/App.tsx`
- Test: `vite-project/src/__tests__/ResourcePanel.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react';
import ResourcePanel from '../components/ResourcePanel';

test('renders ResourcePanel with labels and buttons', () => {
  render(<ResourcePanel />);
  expect(screen.getByText('Resources')).toBeInTheDocument();
  expect(screen.getByText('Show Money')).toBeInTheDocument();
  expect(screen.getByText('Show Produce')).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**
Run: `npm test src/__tests__/ResourcePanel.test.tsx`
Expected: FAIL - "ResourcePanel not found"

**Step 3: Write minimal implementation**

```tsx
export default function ResourcePanel() {
  return (
    <div>
      <h2>Resources</h2>
      <button>Show Money</button>
      <button>Show Produce</button>
    </div>
  );
}
```

**Step 4: Run test to verify it passes**
Run: `npm test src/__tests__/ResourcePanel.test.tsx`
Expected: PASS

**Step 5: Commit**
```bash
git add src/components/ResourcePanel.tsx src/__tests__/ResourcePanel.test.tsx src/App.tsx
```

---

### Task 2: CropField Stub Component

**Files:**
- Create: `vite-project/src/components/CropField.tsx`
- Modify: `vite-project/src/App.tsx`
- Test: `vite-project/src/__tests__/CropField.test.tsx`

**Step 1: Write failing test ... (similar pattern: label/title, Plant/Harvest buttons)**
**Step 2-5: As above**

---

### Task 3: AnimalPen Stub Component

**Files:**
- Create: `vite-project/src/components/AnimalPen.tsx`
- Modify: `vite-project/src/App.tsx`
- Test: `vite-project/src/__tests__/AnimalPen.test.tsx`

**Step 1: Write failing test ... (label/title, Buy/Collect buttons)**
**Step 2-5: As above**

---

### Task 4: UpgradeShop Stub Component

**Files:**
- Create: `vite-project/src/components/UpgradeShop.tsx`
- Modify: `vite-project/src/App.tsx`
- Test: `vite-project/src/__tests__/UpgradeShop.test.tsx`

**Step 1: Write failing test ... (label/title, Buy Upgrade button)**
**Step 2-5: As above**

---

### Task 5: AutomationControls Stub Component

**Files:**
- Create: `vite-project/src/components/AutomationControls.tsx`
- Modify: `vite-project/src/App.tsx`
- Test: `vite-project/src/__tests__/AutomationControls.test.tsx`

**Step 1: Write failing test ... (label/title, Enable Automation toggle/button)**
**Step 2-5: As above**

---

### Task 6: Compose in App.tsx

**Files:**
- Modify: `vite-project/src/App.tsx`
- Test: `vite-project/src/__tests__/App.test.tsx`

**Step 1: Write test that all stub components render**
**Step 2: Run test to verify it fails (missing components)**
**Step 3: Place each modular component in correct layout**
**Step 4: Run test to verify it passes**
**Step 5: Commit**

---

### Task 7: Basic CSS/Style Separation

**Files:**
- Modify/Create: `vite-project/src/App.css` or per-component CSS module

**Step 1: Add minimal styling for section layout and visual separation.**
**Step 2: Verify layout visually and tweak as needed.**
**Step 3: Commit style changes.**

---

### Task 8: Pixel Art Placeholders

**Files:**
- Modify/Create: `vite-project/src/components/PixelArtCanvas.tsx`/img assets per section

**Step 1: Add canvas or static image stub to one or more components.**
**Step 2: Confirm placeholder renders.**
**Step 3: Commit.**

---

### Task 9: Quick Manual/Visual Test

**Files:**
- Test: Run all components, check layout visually, try demo buttons

**Step 1: Open app in browser**
**Step 2: Confirm all sections, buttons, demo state/action feedback.**
**Step 3: Commit if tweaks needed.**

---

### Task 10: Final Verification & Commit

**Files:**
- Test: `npm test`, visual confirmation, layout checks

**Step 1: Run all tests & verify layout**
**Step 2: Commit with summary message

---

Plan complete and saved to `docs/plans/2026-03-12-basic-ui-skeleton-plan.md`. Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach would you like to use?