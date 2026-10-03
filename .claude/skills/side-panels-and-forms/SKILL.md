---
name: side-panels-and-forms
description: Use when adding or changing a slide-out side panel, a filter panel, or the form fields inside a panel in dashboard-ui.
---

# Side panels and forms

Goal: a panel that looks and behaves like every other one, with a light surface, a header aligned with the app header, an edge-to-edge frame that doesn't shift the page, and a compact vertical form. The rules are in AGENTS.md → Panels & forms.

## Pick the shared component

- Form panel: `SlideOutPanel` from `src/components/display/panels/slide-out`. It wraps an antd vertical `Form`, `useSlideOutPanelForm` (initial values, submit, cancel) and the footer with its cancel and primary buttons.
- Other content: `SlideOutPanel` with `contentOnly`, or `AnimationWrapper` directly. A panel with its own form state (plans, roles) passes its actions as data, `footer={{ onCancel, onPrimary, primaryLabel, … }}`; the frame renders `PanelFooter` pinned below the scrolling body. Never render `PanelFooter` or an inner scroll container yourself: the padded body is the scroller, so its scrollbar runs along the panel edge.
- Every panel (create, edit, manage, attach, filter) has a title only, no subtitle; the shared header has no subtitle prop.
- Filters: `FilterPanel` from `src/components/display/panels/filter`, configured with `FilterField[]` (`multiSelect`, `dropdown`, `buttonGroup`, `dateRange`). `ClusterInsightsView.tsx` has a full example.

These already apply `PANEL_SURFACE_CLASS`, the light `PANEL_THEME_TOKENS`, the scroll lock and the shared header. A hand-built panel frame loses all four.

## Keep these intact when extending the shared panels

- Scroll lock: `useScrollLock(open)` is counted, so a panel over a panel works. Pages scroll in the content pane (`APP_CONFIGS.LAYOUT.CONTENT_ID`), not the window; the lock hides the pane's overflow, and the pane's `scrollbar-gutter: stable` keeps the page in place. Panels are fixed and reach the real screen edge without offsets; don't set a panel's `right` negative.
- Header height: `SLIDE_OUT.HEADER.height` is `HEADER_LAYOUT.HEIGHT_PX`, so the panel's top bar lines up with the app header. Change `HEADER_LAYOUT`, not the panel.
- Surface: everything inside is on white, so use `SURFACE_*` and `TEXT_ON_SURFACE*` colors; dark-surface text tokens render invisible here.
- Width: panels can expand and collapse with an animated width. Layout inside that depends on width reads `useElementWidth`, not the expand flag.

## Form fields

- Each field is an antd vertical `Form.Item` with `className="form-item-compact"`, 16px apart; add `no-asterisk` to hide the required mark while keeping validation.
- Filter fields get the same treatment through `FilterFieldRenderer` (`FILTER_PANEL.ITEM_CLASS`, `FILTER_PANEL.ITEM`). The filter panel uses `Form component={false}` rather than a `<form>` element because it can open inside a form panel.
- Filter labels are sentence case ("Filter by severity") and live in the feature's constants.
- Inputs, selects and pickers take no `size` prop and no inline `height`; their size comes from the global tokens.

## Before you finish, check

- Opening and closing the panel doesn't move the page, and the panel reaches the right edge of the screen.
- The panel header lines up with the app header.
- Text and controls inside the panel are visible (no dark-surface tokens).
- `npm run check-all` passes; ask the user for a screenshot with the panel open.
