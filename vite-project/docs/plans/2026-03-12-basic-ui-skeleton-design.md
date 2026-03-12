# Basic UI Skeleton Design for Idle Farm Game

**Date:** 2026-03-12

## 1. Top-Level UI Layout
- App.tsx renders five main atomic components:
  1. `ResourcePanel` (top)
  2. `FarmDashboard` (middle – vertical stack of `CropField` & `AnimalPen`)
  3. `UpgradeShop` (side/modal)
  4. `AutomationControls` (bottom/floating)
- Layout uses flex/column structure for clarity and modularity.

## 2. Component Details & Stubs
Each component is standalone, displays label/title, and sample actionable buttons:

### ResourcePanel
- Title: "Resources"
- Sample buttons: "Show Money", "Show Produce"
- Placeholder for resource values

### FarmDashboard
- Title: "Farm Dashboard"
- Holds `CropField` and `AnimalPen` as stacked children.

### CropField
- Title: "Crop Field"
- Buttons: "Plant Crop", "Harvest Crop"
- Placeholder for crop count/status

### AnimalPen
- Title: "Animal Pen"
- Buttons: "Buy Animal", "Collect Produce"
- Placeholder for animal count/status

### UpgradeShop
- Title: "Upgrade Shop"
- Button: "Buy Upgrade" (simple modal/alert logic)
- Placeholder for upgrades

### AutomationControls
- Title: "Automation Controls"
- Toggle button: "Enable Automation"
- Placeholder for automation status

## 3. Data Flow, Error Handling & Testing
- Actions update local stub state (useState): demo counters/toggles for immediate feedback.
- All feedback is isolated within each component for clarity.
- Errors or failed demo actions display a visible alert/message within the stub.
- Each component will have a minimal render/action test.

## 4. Pixel Art Placeholder
- Optionally: Each section can display a basic placeholder pixel art (empty canvas or static image).

## 5. Next Steps
- Commit design doc
- Invoke writing-plans skill to produce implementation plan as per project workflow.

---
Approved by user: sections and content verified 2026-03-12.