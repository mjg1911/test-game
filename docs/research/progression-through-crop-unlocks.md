# Research & Proposal: Staged Crop and Upgrade Unlocks in Idle Farm Game

## Introduction & Motivation

In many successful idle games, limiting the initial game options helps funnel players through a carefully curated onboarding and progression experience. Starting with only a couple of accessible crops encourages mastery, prevents early overwhelm, and gives a strong sense of accomplishment as new crops and game systems are unlocked using gold (the main currency). This staged system also provides opportunities for milestone-based pacing, game longevity, and controlled difficulty spikes.

## Initial State: Two Starter Crops—No Early Upgrades

- **Starter Crops:** Wheat and Corn (example: simple, familiar, easily balanced)
- **No crop upgrades or advanced features at the start**
- New players see only these two, with few or no distractions/unlock prompts

## Unlocking System for Crops and Upgrades

### All Additional Crops Are Locked Initially
- Crops (Sunflower, Peas, Pumpkin, Potato, Tomato, etc.) move to a locked state
- Each locked crop is displayed with a visual lock and the price to unlock in the “Upgrade” tab
- Same for all upgrade systems (fertilizer, irrigation, automation, etc.)

### Unlock Method: Gold (Money) Based
- **Unlock is always by paying money (not ‘wait X minutes’, not ‘have X clicks’)**
- This retains player agency and rewards idle + active play

#### When Does Each Unlock Become Visible?
- **Recommended:** All locked crops & upgrades are visible in the upgrade tab from the start—but are greyed out and clearly indicate the unlock price
- **Optional (for pacing):** Hide the next unlock(s) until prerequisite is reached (see below for advanced options)

### Suggested Logic for Unlock Visibility & Pricing

#### Visibility
- *Default Recommendation*: Show all possible unlocks in the tab UI with lock icons and prices—the player sees what’s coming, expects progress and can set goals
- *Reveal Sequentially*: Next crop or upgrade becomes visible only after unlocking the previous one, OR after other milestones (see below)

#### Unlock Requirements/Costs
- **Money Threshold:** Each crop unlocks for a substantial gold amount, rising steeply via an encouraging cost curve (e.g. 5x-10x the previous unlock)
- **Example suggested curve:**
    - Wheat & Corn: free
    - Sunflower: 600 gold
    - Peas: 2,500 gold
    - Pumpkin: 12,000 gold
    - Potato: 70,000 gold
    - Tomato: 200,000 gold
    - Crop upgrades: Unlock for additional gold after their crop is unlocked
    - Automation: 2x-5x the cost of last crop unlock

- **Milestone/Hybrid Option:** Instead of only money, combine with number of farms (e.g. "buy 25 wheat AND pay 2,500 gold to unlock peas"), but avoid hard time-gating

### Unlocking Upgrades
- Upgrades (e.g. fertilizer/irrigation) are **locked for all crops** at the beginning
- Each upgrade is listed in the Upgrade tab, associated with its crop (e.g. "Unlock fertilizer upgrades for sunflower: 15,000 gold")
- Upgrades become available either:
    - **After unlocking the associated crop** (default)
    - **Or after both a crop and a milestone (e.g. own 50 total farms, or reach passive income threshold)**

#### UpgradeTab UI Details
- Locked upgrades should always be *visible* but not interactable until requirements met
- Hover/tooltips can preview the benefits of unlocking

### Progression Pacing and Experience
- **Early game is focused and simple**: clear goals, quick to the first few unlocks
- **Mid and late game**: each new crop brings a sense of major progress and adds mechanical depth
- **Progress is controllable**: if players are speeding through, up subsequent unlock costs to stretch the content
- **High gold requirements ensure old crops stay relevant** (as earning sources for upgrade unlocks)

#### Inspirations/References
- Many idle/clicker games use this pattern, e.g. Adventure Capitalist, Cookie Clicker, Universal Paperclips
- Showing next unlocks visually as “coming soon” boosts player anticipation

### Optional/Advanced: Unlock Triggers
- *Soft prerequisite*: Hide next crop until earning X per second, or until buying X of any farm
- *Prestige/Retirement*: Unlock crops/upgrades on future runs with enhanced pacing
- *Achievement-based unlocks*: Special crops/upgrades require both money and achievements for variety

## Summary: Implementation Plan for Staged Unlocks
1. Start game with only wheat and corn unlocked and visible; all others locked
2. The Upgrade tab displays all locked crops & upgrades, with unlock price & requirements clearly stated
3. Player can spend gold to unlock crops or upgrades at any time
4. Crop-specific upgrades (fertilizer, irrigation) become available to unlock only after that crop is unlocked
5. All unlocks are money-based; optionally layer in farm/milestone requirements for more complexity
6. Balance unlock costs to shape pacing and sense of achievement

---

This system delivers a modular, scalable progression path. It enables later rebalance and frequent new content/stages via simple config tweaks. Further design and tuning can iterate on this baseline for optimal player experience.
