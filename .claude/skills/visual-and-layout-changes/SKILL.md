---
name: visual-and-layout-changes
description: Use when a request or bug report in dashboard-ui is about how the UI looks or moves, such as colors, invisible or wrong-colored text, fonts, control sizes, spacing, alignment, compact or responsive behavior, flashes, or content that shifts.
---

# Visual, color and layout changes

Goal: fix what the user sees, checked against what they see rather than against what the code suggests should render. The rules behind this skill are in AGENTS.md → Styling & theme and Layout & responsiveness.

## Start from a screenshot

For a reported visual bug, ask the user for a screenshot before editing, and read it with your image tool. Visual bugs usually depend on which surface an element sits on, which the code alone doesn't show, and guessing costs rounds that change nothing. Measure the screenshot (pixel offsets, bounding boxes) rather than eyeballing it.

Fix only what was reported, with no side adjustments to opacity, spacing or color along the way. If two requests conflict through a single token, say so and ask which wins.

## Colors: surface first

- Identify the surface the element renders on: the dark page and cards, or a light surface (slide-out panel, modal, dropdown, popover, tooltip). Portals such as dropdowns and popovers render outside the panel that opened them.
- Pick from that surface's palette in `DEFAULT_COLORS` (the table in AGENTS.md). Text that seems missing but can be copied is white on white: a dark-surface token such as `TEXT_PRIMARY` used on a light surface.
- If an antd component spans two surfaces (a `Select`'s control on the page, its dropdown portal on white), don't set its `colorText`; pin the portal side in `src/styles/antd.css` as the existing `.ant-select-dropdown` rules do.
- If only autofilled inputs are white on white, the light surface is missing `color-scheme: light` (see `src/styles/index.css`); no other CSS reaches that color.

## Fonts

Inline `fontFamily` and antd font tokens do nothing, because `#root *` forces Geist with `!important`. Monospace goes through the `manifest-code` class.

## Sizes

If a control has the wrong height, look for a `size` prop on it, an inline `height`, a nested `ConfigProvider` around it, and a global `!important` rule on its selector in `src/styles/*.css`. The intended values live in `src/constants/layout/controls.ts` and `TOOLBAR_CONTROL`; change those constants, not individual components. A toolbar label that sits off-center usually lacks `boxSizing: 'border-box'` or `lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT`.

## Responsive and timing behavior

- First ask whether the viewport is even the right signal. The sidebar (collapsible and resizable) and open panels change the available width at the same viewport size, so measure the container with `useElementWidth`; keep `useMediaQuery` for behavior that depends on the window.
- Anything tied to an animated width reads the measured width, not the toggle flag.
- For "this should give way before that", put `flexShrink: 100000` and `minWidth: 0` on the less important sibling instead of adding a threshold.
- A threshold you can't avoid comes from measuring what the content really needs, not from a constant in another component.
- For sub-second flashes, add temporary `logger.debug` calls with `performance.now()` at the suspected mount points, reproduce, read the log, then remove them. Two loading states in one wait must render identically (`FullPageLoader`, same label or none).

## Layout-shift check

Before finishing, check the change against these:
- Opening a panel doesn't move the page (the `useScrollLock` lock and the content pane's `scrollbar-gutter: stable` are intact).
- Column widths don't change between rows or pages (long text ellipsizes).
- Nothing renders a placeholder that later widens; render nothing until the value is known.
- The first paint uses the real width (`useElementWidth` measures in a layout effect).
- Optional flex children render conditionally, because a zero-width child still takes a `gap`.

## Verify

Run `npm run check-all`, then ask the user for a screenshot of the result in the states that matter: sidebar collapsed and expanded, panel open, narrow and wide.
