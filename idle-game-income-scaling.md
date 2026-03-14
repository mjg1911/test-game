# Idle Game Item Income Scaling Patterns

Idle (incremental) games commonly use a progression where each purchased item or upgrade provides passive income (e.g., coins, cookies, cash) per second. Items are typically unlocked sequentially, and each new item is more expensive but gives a much larger income. The value gained per item or upgrade tends to follow a scaling formula that can be linear, exponential, or geometric.

## 1. General Patterns in Idle Game Item Scaling

- **Exponential/Geometric Growth**: Typically each new item gives 3x to 10x the previous item's income (but costs also rise dramatically).
- **Upgrade Multipliers**: Sometimes, upgrades apply a multiplier only to a specific item (e.g. double the output of item 1), compounding gains.
- **Increasing Costs**: Buying more copies of the same item rapidly increases the price (cost scaling)—usually exponentially.

---

## 2. Example: Cookie Clicker Building Incomes

In Cookie Clicker, each building type has a fixed base output (cookies/second), and the base output increases by roughly a factor of 2-5 with each new item:

| Item                  | Income/sec (base) | Base Cost | Cost Multiplier |
|-----------------------|------------------|-----------|-----------------|
| Cursor                | 0.1              | 15        | 1.15x           |
| Grandma               | 1                | 100       | 1.15x           |
| Farm                  | 8                | 1100      | 1.15x           |
| Mine                  | 47               | 12,000    | 1.15x           |
| Factory               | 260              | 130,000   | 1.15x           |
| Bank                  | 1,400            | 1,400,000 | 1.15x           |
| Temple                | 7,800            | 20,000,000| 1.15x           |
| Wizard Tower          | 44,000           | 330,000,000| 1.15x          |
| Shipment              | 260,000          | 5,100,000,000| 1.15x        |
| Alchemy Lab           | 1,600,000        | 75,000,000,000| 1.15x       |
| Portal                | 10,000,000       | 1,000,000,000,000| 1.15x     |
| Time Machine          | 65,000,000       | 14,000,000,000,000| 1.15x    |
| Antimatter Condenser  | 430,000,000      | 170,000,000,000,000| 1.15x   |
| Prism                 | 2,900,000,000    | 21,000,000,000,000,000| 1.15x |

**Formula:**
- For each building, output scales as:
  - `income = base × amount_owned × (product of upgrades)`
- Each new building is roughly 5-8× the previous one, cost is exponentially higher.
- **Cost to buy n-th building:**
  - `cost = base_cost × (1.15 ^ (amount_owned))`

**Upgrades and Multipliers for Grandma:**
- Basic Grandma: 1 cookie/sec
- Early upgrades (for purchasing 1, 5, 25, 50, etc. Grandmas) multiply output:
  - Forwards from grandma (1+): +0.5 cookies/grandma
  - Steel-plated rolling pins (5+): ×2 output
  - Lubricated dentures (25+): ×2 output (compounds with previous)
  - Synergy upgrades: Multiply output by 1.5–3.0× based on other buildings
- Other multipliers: Elder Pledge, Heavenly Chips, sugar lumps, global milk upgrades, etc.

**Sample Grandmas Output (with upgrades):**
- With just 5 grandmas and basic upgrades: Output ≈ 5 × 1 × 2 [steel-plated] ×1.5 [synergy] = 15 cookies/sec
- At high numbers and all upgrades, output increases by many thousands × base!

---

## 3. Example: AdVenture Capitalist Businesses

AdVenture Capitalist features businesses, each with a higher base payout and exponentially-increasing cost. The income per business progresses as follows (typical values, source: forums/wikis):

| Business        | Base Payout/sec |
|-----------------|----------------|
| Lemonade Stand  | 1              |
| Newspaper       | 7              |
| Car Wash        | 58             |
| Pizza Delivery  | 440            |
| Donut Shop      | 3,600          |
| Shrimp Boat     | 28,000         |
| Hockey Team     | 216,000        |
| Movie Studio    | 1,728,000      |
| Bank            | 13,824,000     |
| Oil Company     | 110,592,000    |

**Observations:** Each new item generally gives ~7x the previous. Upgrades and managers multiply the output further.

---

## 4. Dope Slinger Tycoon: Scaling Inference

While Dope Slinger Tycoon’s exact values require direct source access, based on genre standards and player accounts:
- **Item 1 (e.g. Weed)**: Low cost, gives X cash/sec
- **Item 2 (Magic Mushrooms)**: ~5-10× higher cost, gives ~5-10× cash/sec
- **Subsequent items**: Each new drug/item exponentially increases base output (usually by 4-8×); upgrades multiply output.

**Formula Example:**
```
income_per_sec[item] = base_output[item] × number_owned[item] × all_multipliers[item]
```

---

## 5. Typical Mathematical Formulas

- **Income per item:** Linear for amount, exponential for item tier
  - `income = base × amount_owned × upgrades`
- **Item cost scaling:**
  - `next_cost = base_cost × cost_multiplier ^ amount_owned`
- **New item scaling:**
  - `base_next = base_prev × scaling_factor` (scaling_factor usually 4–8 in idle games)

---

## 6. References
- [Cookie Clicker Buildings Wiki (archived)](https://web.archive.org/web/20230321213632/https://cookieclicker.fandom.com/wiki/Buildings)
- [AdVenture Capitalist Community Wiki (archived)](https://web.archive.org/web/20230222223445/https://adventure-capitalist.fandom.com/wiki/Businesses)
- [Idle Game Design Patterns (dev.to)](https://dev.to/zigurous/the-math-behind-idle-incremental-games-4ope)

---

## 7. Summary Table: Idle Game Item Incomes

| Game                 | Item 1 (per sec) | Item 2 (per sec) | Item 3 (per sec) | Scaling per Tier      |
|----------------------|------------------|------------------|------------------|----------------------|
| Cookie Clicker       | 0.1              | 1                | 8                | ~8×, ~6×             |
| AdVenture Capitalist | 1                | 7                | 58               | ~7×, ~8×             |
| Dope Slinger Tycoon* | X                | ~5-10× X         | ~5-10× (item 2)  | ~5-10× per new item*  |

*approximate, based on analysis and public gameplay

---

**Key Takeaway:**
Most idle games increase the income per second per item by 5–10x with each new type, but upgrades and multipliers can rapidly escalate earnings. This compounding is core to the "idle/progress" experience and motivates continual unlocking of new items.
