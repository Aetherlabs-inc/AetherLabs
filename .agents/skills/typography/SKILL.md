---
name: typography
description: Define and adjust responsive typography scales, font sizes, and hierarchy using a ratio-based system (e.g., golden ratio) with platform readability guidance (Apple HIG). Use when updating body/UI font sizing, heading scale, or responsive type behavior across AetherLabs apps.
---

# Typography Scale Workflow

## Goal
Create a consistent, readable typographic system that scales across screen sizes with a ratio-based ladder.

## Steps
1) Identify the scope: app-only or shared UI (prefer shared in `packages/ui/src/theme.css` unless app-specific).
2) Set a base size (e.g., 16px) and a ratio (e.g., 1.618).
3) Define CSS variables for the scale (`--font-base`, `--font-ratio`, `--step-1`, `--step-2`, ...).
4) Apply the scale to headings and body text.
5) Ensure minimum readable body size (Apple HIG guidance: readable body sizes ~14–17px depending on context).
6) Validate in key screens and adjust tracking/line-height only if needed.

## Recommended Structure (theme.css)
- `:root` defines the scale variables.
- `body` sets base font-size using `--font-base`.
- `h1..h6` map to scale steps.
- Use `clamp()` sparingly if you want fluid scaling.

## Example Scale (Golden Ratio)
```css
:root {
  --font-base: 16px;
  --font-ratio: 1.618;
  --step-1: calc(var(--font-base) * var(--font-ratio));
  --step-2: calc(var(--step-1) * var(--font-ratio));
  --step-3: calc(var(--step-2) * var(--font-ratio));
  --step-4: calc(var(--step-3) * var(--font-ratio));
}
```

## Notes
- Keep body/UI text at or above 16px when possible.
- Use smaller sizes only for labels/metadata.
- Preserve existing font families unless explicitly requested.
