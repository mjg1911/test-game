# Basic Game State Structure Design (Idle Farm Game)

**Date:** 2026-03-12

## Game State Structure

The game state is an atomic JS object with four main categories:
- **crops**: Object mapping crop name → count (integer, >= 0)
- **animals**: Object mapping animal name → count (integer, >= 0)
- **resources**: Object mapping resource name → count (integer, >= 0)
- **upgrades**: Object mapping upgrade name → count (integer, >= 0)

### Example
```js
{
  crops: { wheat: 34, corn: 12 },
  animals: { cow: 2, chicken: 6 },
  resources: { money: 1200, eggs: 15 },
  upgrades: { fertilizer: 1, autoHarvester: 0 }
}
```

- Values are simple integers; no per-item metadata.
- Structure prioritizes ease of serialization (JSON), testing, and modular UI updates.
- Chosen for maximal simplicity, reliability, and future extensibility.

## Rationale
- Flat object supports atomic actions per design spec; consistent with modular UI/component architecture.
- Serialization and autosave are trivial (JSON.stringify and JSON.parse).
- Easily supports per-category and per-item operations as required by gameplay.

*Approved by user as of 2026-03-12.*