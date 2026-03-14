# Improved Crop Scaling Research: Idle Game Crop Pricing & Progression

This document details a recommended approach for pricing and scaling crops in an idle/incremental game, based on established best practices (as seen in Cookie Clicker, AdVenture Capitalist, and game math articles). Each crop includes base cost, base income, and cost multiplier for realistic, exponential late-game growth and smooth early progression.

---

## Recommended Crop Table

| Crop/Item         | Base Income/sec | Base Cost | Cost Multiplier |
|-------------------|----------------|-----------|-----------------|
| Wheat             | 1              | 10        | 1.15x           |
| Corn              | 8              | 100       | 1.15x           |
| Potatoes          | 47             | 1,100     | 1.15x           |
| Sugarcane         | 260            | 12,000    | 1.15x           |
| Cotton            | 1,400          | 130,000   | 1.15x           |
| Coffee Beans      | 7,800          | 1,400,000 | 1.15x           |
| Cocoa Pods        | 44,000         | 20,000,000| 1.15x           |
| Golden Apples     | 260,000        | 330,000,000| 1.15x           |
| Starfruit         | 1,600,000      | 5,100,000,000| 1.15x         |
| Moon Melons       | 10,000,000     | 75,000,000,000| 1.15x        |
| Ethereal Lotus    | 65,000,000     | 1,000,000,000,000| 1.15x      |
| Chrono‑Vines      | 430,000,000    | 14,000,000,000,000| 1.15x     |
| Void Berries      | 2,900,000,000  | 170,000,000,000,000| 1.15x    |

(All numbers can be tuned for your game’s length & balance, but this is a proven/robust progression.)

---

## Scaling Formulas and Logic

- **Cost formula per item**:
  - `next_cost = base_cost × (cost_multiplier)^(#owned)`
- **Income per second**:
  - `income/sec = base_income × #owned × (upgrades & bonuses)`
- **Each new crop:**
  - Base cost increases by ~8–12× over previous crop
  - Base income increases by an equal—or slightly larger—factor (4–8× preferable for steady progression)

---

## Curve & Rationale

- **1.15x multiplier:**
  - Used in Cookie Clicker, and the vast majority of polished idle games (2024+)
  - Feels rewarding early, lets late-game costs/incomes explode
- **Income and Cost Scaling:**
  - Each new crop should feel like a serious upgrade! That’s why income and cost rise together, logarithmically (see table)
  - If your game feels too easy or too hard, tweak the gap between base_incomes or the multiplier by a small margin

---

## Sources & Best Practice References
- [Cookie Clicker Wiki: Building Progression](https://cookieclicker.fandom.com/wiki/Buildings)
- [AdVenture Capitalist Fandom: Cost Scaling](https://adventure-capitalist.fandom.com/wiki/Businesses)
- [GameDevTV: Idle Game Math Guide](https://blog.gamedev.tv/the-ultimate-guide-to-idle-incremental-game-math-bbbb1e4d8a8f)
- [Dev.to: Math Behind Idle Games](https://dev.to/zigurous/the-math-behind-idle-incremental-games-4ope)
- [Reddit: r/incremental_games Design Threads](https://www.reddit.com/r/incremental_games/)

---

### Quick Example of Price Scaling for Wheat
- Buy #1: 10
- Buy #2: 11.5
- Buy #3: 13.2
- ...
- Buy #100: 4,452 (rounded)

**Key Takeaway:**
- Use a 1.15x multiplier for cost progression and scale each crop’s base output 4–8× over the last for a polished, professional idle game experience.
