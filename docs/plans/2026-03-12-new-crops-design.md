# Idle Farm: New Crop Additions Design

## Project: Add Sunflower, Peas, Pumpkin, Potato, Tomato crops with gentle-to-steep cost/value scaling

### Crop Progression Table

| Crop      | baseCost | cooldown(ms) | sellPrice |
|-----------|----------|--------------|-----------|
| wheat     | 10       | 5000         | 15        |
| corn      | 20       | 8000         | 30        |
| sunflower | 30       | 10000        | 45        |
| peas      | 40       | 12000        | 65        |
| pumpkin   | 50       | 14000        | 85        |
| potato    | 70       | 17000        | 110       |
| tomato    | 100      | 21000        | 145       |

### Integration Steps

1. Update CROP_CONFIG in CropField.tsx to include all new crops
2. Extend gameState crops initialization to add new crops
3. Ensure UI automatically displays new crop options
4. Ensure resource values are tracked for new crops
5. Expand/adjust tests for full crop logic coverage
6. Placeholder pixel art for new crops (future upgrades possible)

Approved on: 2026-03-12

---

# End of Design Document
