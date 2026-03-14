# Improved Animal Scaling Research: Idle Game Animal Pricing & Progression

This document details a recommended approach for pricing and scaling animals in an idle/incremental game. Designed for late-game balance, these values ensure that animal upgrades feel significant and challenging. The table below presents base cost, base income, and cost multiplier for each animal type, providing exponential late-game growth while keeping the gameplay engaging.

---

## Recommended Animal Table

| Animal/Item      | Base Income/sec    | Base Cost            | Cost Multiplier |
|------------------|-------------------|----------------------|-----------------|
| Chicken          | 50,000,000        | 5,000,000,000        | 1.17            |
| Pig              | 350,000,000       | 60,000,000,000       | 1.17            |
| Cow              | 2,100,000,000     | 800,000,000,000      | 1.17            |
| Sheep            | 14,000,000,000    | 11,000,000,000,000   | 1.17            |
| Llama            | 90,000,000,000    | 155,000,000,000,000  | 1.17            |
| Alpaca           | 600,000,000,000   | 2,150,000,000,000,000| 1.17            |
| Ostrich          | 4,200,000,000,000 | 30,000,000,000,000,000| 1.17           |
| Bison            | 28,000,000,000,000| 420,000,000,000,000,000| 1.17          |
| Icefox           | 210,000,000,000,000| 6,000,000,000,000,000,000| 1.17        |
| Golden Yak       | 1,200,000,000,000,000| 82,000,000,000,000,000,000| 1.17      |
| Phoenix Hen      | 9,000,000,000,000,000| 1,150,000,000,000,000,000,000| 1.17    |
| Dragon Cow       | 62,000,000,000,000,000| 16,000,000,000,000,000,000,000| 1.17   |

(Numbers designed for ultra-late game. Adjust for your economic curve as needed.)

---

## Scaling Formulas and Logic

- **Cost formula per animal**:
  - `next_cost = base_cost × (cost_multiplier)^(#owned)`
- **Income per second**:
  - `income/sec = base_income × #owned × (upgrades & bonuses)`
- **Each new animal:**
  - Base cost increases by ~12–18× the previous animal
  - Base income increases by a similar or slightly higher factor to ensure meaningful progress

---

## Curve & Rationale

- **1.17x multiplier:**
  - Slightly steeper than crops to balance massive late-game values
  - Keeps late-game progression challenging, suitable for expert/advanced players
- **Income and Cost Scaling:**
  - Each new animal feels legendary and game-changing
  - Provides both goals and rewards for reaching the highest echelons of the progression curve
  - Numbers can be further tuned for pacing and user feedback

---

## Sources & Best Practice References
- [Cookie Clicker Wiki: Building Progression](https://cookieclicker.fandom.com/wiki/Buildings)
- [AdVenture Capitalist Fandom: Cost Scaling](https://adventure-capitalist.fandom.com/wiki/Businesses)
- [GameDevTV: Idle Game Math Guide](https://blog.gamedev.tv/the-ultimate-guide-to-idle-incremental-game-math-bbbb1e4d8a8f)
- [Dev.to: Math Behind Idle Games](https://dev.to/zigurous/the-math-behind-idle-incremental-games-4ope)
- [Reddit: r/incremental_games Design Threads](https://www.reddit.com/r/incremental_games/)

---

### Example Price Scaling for Chicken

- Buy #1: 5,000,000,000
- Buy #2: 5,850,000,000
- Buy #3: 6,844,500,000
- ...
- Buy #20: 99,878,982,172 (rounded)

**Key Takeaway:**  
Use a higher cost multiplier and ultra-late-game animals to keep gameplay compelling for advanced players. Progress through the animal ladder should feel both ambitious and rewarding.
