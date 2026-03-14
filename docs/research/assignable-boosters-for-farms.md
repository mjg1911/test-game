# Research & Proposal: Assignable Boosters (Accountants/Farmhands/Others) with Influence Currency

## Overview
Expanding the booster system, we introduce a new prestige/meta-currency: **influence**. Instead of buying boosters with gold outright, players "donate" or "bribe officials" (spending gold) to generate influence per second. Influence is then used to permanently unlock or hire assignable boosters—adding a second, strategic resource for deeper progression, more meaningful gold sinks, and a rich player experience.

---

## Influence: Secondary Currency System

### What is Influence?
- Influence is earned by investing/spending gold through ongoing "Donations" or "Bribery" (themed to your audience—fun, quirky, or satirical).
- Once set up, you generate *influence per second* at a rate determined by your total gold invested in donations/bribes.
- Influence is never spent on crops or upgrades—*only* boosters and (optionally) exclusive meta-upgrades.

### How Influence Works
1. **Invest Gold via Donate/Bribe:**
   - Example: Spend 10,000 gold to increase influence/sec by 0.2 per sec; spend 100,000 more to reach 1.0 per sec, scaling with progress.
   - "Donation Level" or "Bribery Rank" is kept for flavor/progress.
   - Grants a visible influence/sec generator (with possible diminishing returns for balance).
2. **Accrue Influence Automatically:**
   - Influence accumulates passively and can be spent any time.
3. **Spend Influence to Unlock Boosters:**
   - Each assignable booster (Accountant/Farmhand/Spirit/etc.) costs influence (e.g., first = 25, next = 100, next = 500, etc.).
   - Boosters may have additional/variant powers if unlocked via influence (see "Corrupt Official" example).

---

## Interaction with Booster System

### Booster Purchase & Assignment
- Booster unlocks now require influence, creating opportunity cost and strategic tradeoff versus raw expansion.
- UI section in ResourcePanel (or UpgradeShop): "Donate/Bribe for Influence" with gold/influence rates shown, and an Influence Shop for boosters.

### Thematic Options
- "Donate to charity" (wholesome/clean); "Bribe local government" (satirical/funny); "Lobbyists", "Foundations", "Mysterious Patronage" (adds flavor, fits your worldbuilding)
- Optionally, different types of influence ("clean" vs. "corrupt") for even more depth—can affect which boosters are available or how they behave

### Gameplay/Design Impact
- **Meaningful Decisions:** Should a player buy their next farm, donate for long-term influence, or save up for a meta-booster?
- **Pacing:** Influence costs and gold->influence scaling can lengthen or compress late-game as desired.
- **Replay & Endgame:** Influence-based unlocks encourage new goals after regular gold upgrades/crops are capped.

---

## Example Resource & Progression Data
```js
resources = {
  gold: 34000,
  influence: 217,
  influencePerSec: 1.3,
};

boosters = [
  { id: 1, assignedTo: "wheat", effect: "doubleYield" },
]

shop = [
  { name: "Unlock Booster", cost: 100, currency: "influence" },
  // further meta-upgrades, exclusive items
]
```

---

## Unlocking Boosters: Influence Shop Example
- Influence Shop lists all booster unlocks, pricing in influence, with clear icons and assignment tools
- Influence-per-second and total is always visible for planning
- "Next unlock in: 200 influence" type signals
- Assign/reassign logic and effect tooltips as previously specified for boosters

---

## Design & Balancing Knobs
- Initial cost for influence/sec is low, ramps up as you invest more gold (encourages early engagement, late-game scaling)
- Booster costs in influence ramp up faster than gold income, ensuring boosters feel special
- Optionally vary booster effect based on "influence unlock type" (e.g., pure, corrupt, legendary)

---

## Advanced/Optional Features
- Exclusive upgrades/effects only available for influence, not gold
- "Influence Prestige": reset gold progress for mega-influence, unlocking even rarer boosters
   
---

## Summary
Adding an "influence" meta-currency via gold-to-influence investment for booster unlocks deepens the game's meta layer and prolongs progression, creating new avenues for strategic, meaningful player choice. This system also supports quirky worldbuilding and late-game engagement without disturbing the core idle loop.

(Prepared for `idle game\\docs\\research\\assignable-boosters-for-farms.md`)
