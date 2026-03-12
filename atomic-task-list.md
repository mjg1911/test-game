# Idle Farm Game Atomic Task List

## 1. Set up the project
1.a: Initialize a new React app/project
1.b: Create root folders: /src, /assets, /components, /hooks
1.c: Add pixel art support: set up Canvas or asset system

## 2. Core Game State
2.a: Define basic game state structure (crops, animals, resources, upgrades)
2.b: Implement React state/store for game state
2.c: Add localStorage autosave: save on every action/timer
2.d: Add localStorage load: restore state on page load

## 3. Basic UI Skeleton
3.a: Scaffold Resource Panel (top bar UI)
3.b: Scaffold Crop Field component (main section)
3.c: Scaffold Animal Pen component (main section)
3.d: Scaffold Upgrade Shop component (side/modal)
3.e: Scaffold Automation Controls component (bottom/floating)
3.f: Place Canvas for pixel art display

## 4. Crop System
4.a: Add Plant Crop button and action
4.b: Implement crop growth timer/progress logic
4.c: Add Harvest Crop button and action
4.d: Draw crop pixel art asset on Canvas
4.e: Feedback: show resource gain after harvest

## 5. Animal System
5.a: Add Buy Animal button and action
5.b: Add Collect Product button and action
5.c: Add Sell Animal button and action
5.d: Draw animal pixel art asset on Canvas
5.e: Feedback: show product gain after collection

## 6. Resource Management
6.a: Add Sell Resource button and action
6.b: Update Resource Panel with all totals
6.c: Feedback: update money, product counts immediately

## 7. Upgrade Shop
7.a: Set up Upgrade Shop UI/modal
7.b: Add logic for purchasing upgrades (automation, bonuses)
7.c: Feedback: show purchased upgrades and their effects

## 8. Automation Controls
8.a: Add Automation toggle buttons in UI
8.b: Add automation logic for crop actions
8.c: Add automation logic for animal product collection

## 9. Error Handling & Feedback
9.a: Show alert/message if action cannot be performed (e.g., insufficient money)
9.b: Handle unexpected/corrupt state gracefully (reset/fallback)

## 10. Testing and Validation
10.a: Write manual test/quick log for each main action
10.b: (Optional) Add simple automated test for state changes
10.c: Validate autosave/load functionality

## 11. Progressive Unlocks
11.a: Add logic to unlock new crops based on milestones (e.g., X harvested)
11.b: Add logic to unlock new animals/upgrades as player advances

## 12. Polish and Extras
12.a: Improve pixel art assets and layout
12.b: Add optional export/import buttons for save files
12.c: Refine UI for rapid feedback and ease-of-use
