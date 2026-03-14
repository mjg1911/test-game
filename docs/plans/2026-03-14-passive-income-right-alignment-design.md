# Passive Income Right Alignment: Design Doc

**Date:** 2026-03-14

## Overview
Align the passive (progressive) income display to the right side of the Resource panel row, with money on the left. Layout should look visually sharp and stay polished for typical and long values, while remaining robust on smaller screens. Implementation follows project style (no inline styles, only theme variables for spacing).

## UI and React Structure
- In `ResourcePanel.tsx`, wrap the money and passive income display blocks in a single `<div className="resource-header-container">`.
- Display values with existing `.resource` classes, using `.resource-value` for each number to enable font scaling/overflow logic.

**Example JSX:**
```jsx
<div className="resource-header-container">
  <div className="resource"><span className="resource-value">${money}</span></div>
  <div className="resource"><span className="resource-value">{passiveIncome}</span></div>
</div>
```

## CSS / Layout
- `.resource-header-container`: display: flex, justify-content: space-between, align-items: center, flex-wrap: wrap.
- Padding, gap, sizing via var(--space-md) and var(--space-xs) — as defined in root theme.
- `.resource:last-child`: text-align: right for the passive income value (right edge alignment).
- Responsive (max-width: 600px): switch to column stack, passive income stays right-aligned.

**Example CSS:**
```css
.resource-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 0 var(--space-md);
  width: 100%;
}
.resource-header-container .resource {
  min-width: 0;
  flex: 1 1 0;
}
.resource-header-container .resource:last-child {
  text-align: right;
}
@media (max-width: 600px) {
  .resource-header-container {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-xs);
    padding: 0 var(--space-xs);
  }
  .resource-header-container .resource:last-child {
    text-align: right;
  }
}
```

## Handling Large Numbers
- `.resource-value`: font-size: clamp(14px, 3vw, 20px);
- overflow-x: auto and white-space: nowrap to prevent breakage.

**Example CSS:**
```css
.resource-value {
  font-size: clamp(14px, 3vw, 20px);
  overflow-x: auto;
  display: inline-block;
  white-space: nowrap;
  max-width: 100%;
}
```

## Testing
- Visual check for left/right alignment at all window widths
- Validate non-overlap for big numbers
- Automated/unit regression (ensure test ids unchanged)

## Accessibility
- aria-label attributes on resource values for screen reader clarity
- Semantic HTML structure with proper heading hierarchy
- Tests verify presence of aria-label attributes

-- END --
