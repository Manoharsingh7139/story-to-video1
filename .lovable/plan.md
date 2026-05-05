
# Fix broken layouts on slides 17–20

Slides 17–20 use the new `process-flow`, `timeline`, `pyramid`, and `cycle` layouts. Each has a layout bug that breaks the visual.

## Bugs

1. **`process-flow` (slide 17)** — Each step is a flex row containing a centered column AND a `flex: 1` connector line. Because the column is vertically centered and the connector sits at row-mid height, the connector line ends up vertically misaligned with the circles, and the `›` chevron floats. Items also size unevenly when text wraps differently.

2. **`timeline` (slide 18)** — Items use `min-width: 140` inside `flex justify-between`, with above/below labels having `min-height: 100`. The dot ends up at different vertical positions per item because the item heights vary with body length. Result: dots don't sit on the line.

3. **`pyramid` (slide 19)** — Bands have `min-width: 280px`, which forces every band to be at least 280px wide. With small widthPct values (30%) and a narrow container, all top bands collapse to the same `minWidth`, destroying the pyramid shape (rectangular blocks instead of tapering).

4. **`cycle` (slide 20)** — The biggest break. Nodes are positioned in absolute pixels (`left: cx + cos*r - 70`, with cx=360, r=220) inside an HTML div, while the SVG circle behind them uses a `viewBox="0 0 720 560"` that scales to fit. The HTML pixel coords don't scale with the SVG, so on any container size other than exactly 720×560 the nodes float far away from the dashed circle.

## Fixes

Rewrite the four layout branches in `src/components/prototype/SlideView.tsx`:

- **process-flow** — Replace the per-item flex+connector pattern with a CSS grid of N equal columns + a single absolutely-positioned connector line spanning between the first and last circle centers. Circles get `position: relative; z-index: 1` so they overlay the line cleanly.

- **timeline** — Same grid approach: N equal columns, dot pinned to vertical center of each column with `position: absolute; top: 50%`, year/label/body text absolutely positioned above or below the dot via `bottom: calc(50% + 28px)` / `top: calc(50% + 28px)`. Removes the variable-height alignment problem.

- **pyramid** — Drop `minWidth: 280`. Use proportional widths only (top 30% → base 90%) capped by `maxWidth: 900`. Add `clipPath: polygon(...)` so each band actually tapers like a pyramid slice rather than rendering as plain rectangles. Slight per-band brightness variation keeps the bands distinguishable on dark themes.

- **cycle** — Use a square container with `aspect-ratio: 1/1` and percentage-based positioning. Both the SVG (viewBox 0–100) and the HTML node divs (`left: ${50 + cos*38}%`) use the same percent coordinate space, so circle and nodes always line up regardless of container size. Each node uses `transform: translate(-50%, -50%)` so its center sits on the orbit.

No changes to types, sample deck content, or chat/intent code. Only the four `case` branches in `SlideView.tsx` are touched.

## File touched

- `src/components/prototype/SlideView.tsx` — rewrite four layout branches (~130 lines).
