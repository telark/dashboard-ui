# dashboard-ui agent guide

This is the canonical instruction file for coding agents working in this repo; `CLAUDE.md` only imports it. Procedures for recurring work live in `.claude/skills/<name>/SKILL.md`. They are plain Markdown, so any agent can open them; the [skills index](#skills-index) says when each one applies.

dashboard-ui is the operator-facing SPA for telark: React 19, TypeScript 6, Vite, Redux Toolkit, Ant Design 6. It has no backend logic of its own. `README.md` covers the backend services, dev ports, scripts, and branch and commit conventions.

## Repository map

| Path | Contents |
|---|---|
| `src/features/<feature>/` | One folder per feature: `clients/`, `components/`, `constants/`, `hooks/`, `models/`, `pages/`, `store/`, `utils/` as needed, public surface in `index.ts` |
| `src/features/shared/` | Constants, retry logic and utils shared by features |
| `src/components/` | Shared UI: `display/` (table, toolbar, panels, views, buttons…), `layout/` (header, sidebar), `animation/`, `error-boundary/` |
| `src/constants/` | App-wide constants, re-exported from `src/constants/index.ts`: `shared/colors.ts` (palette, pills), `layout/` (controls, buttons, panels, header, sidebar), `rest/`, `store/`, `pages/`, `config/` |
| `src/hooks/` | `layout/` (`useElementWidth`, `useMediaQuery`…), `panel/` (`useScrollLock`, `useSlideOutPanelForm`) and `useUsernamesByIds` |
| `src/interfaces/` | Shared prop and config interfaces (`layout/toolbar.ts`, `layout/panels.ts`, `layout/page.ts`…) |
| `src/utils/` | Shared helpers, including `layout/sort` (`useSortState`, `sortData`) |
| `src/api/` | HTTP client (`client/request.ts`, `client/normalize.ts`) and health checks |
| `src/store/` | Root Redux store: combines the feature slices from each `features/*/store/`, plus the persist config |
| `src/routes/AppRoutes.tsx` | Routes and the route-level `Suspense` |
| `src/styles/` | `index.css` (global font, `color-scheme`, scrollbar gutter), `antd.css` (surface-scoped antd overrides) |
| `src/logging/` | The project logger |
| `src/App.tsx` | Root `ConfigProvider`: the global antd theme tokens |
| `scripts/generate-licenses.mjs` | Writes `public/licenses.json`; runs as part of every build script |
| `Dockerfile`, `nginx/` | Production image; built by the telark repo's pipeline, not from here |
| `k6/` | Load-test scripts |

### Code navigation

If the code-review-graph MCP server is available and `list_graph_stats` shows this repo is indexed, prefer it for questions about callers, impact radius, affected flows and test coverage (`query_graph`, `get_impact_radius`, `get_affected_flows`, `detect_changes`), because it answers from the import and call graph instead of text matches. Otherwise use normal search. Some server versions add a `_tool` suffix to these names. If the graph's last update predates your edits, refresh it with `build_or_update_graph` first. The `graph-*` skills cover exploring, debugging, reviewing and refactoring.

## Working agreements

### 1. Surface assumptions

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:
- State your assumptions explicitly. For minor choices (naming, formatting, default values, which approach among equivalents), pick a reasonable option and note it rather than asking. For scope changes, destructive or irreversible actions, or requirements you can't infer from the request or the code, ask first.
- If multiple interpretations exist, present them; don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.

### 2. Simplicity first

Minimum code that solves the problem. Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical changes

Touch only what you must. Clean up only your own mess.

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it; don't delete it.

When your changes create orphans:
- Remove imports, variables and functions that your changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-driven execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

Verify each step against its success criterion before moving on. Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

### In this repo

- Comment only where the why is non-obvious (a hidden constraint, an invariant, a workaround), in at most two lines. Skip header comments that restate what a well-named function or constant does. If a comment needs more than two lines, the code probably needs simplifying instead.
- For an unused parameter, remove it and update every caller instead of renaming it `_x`. Keep a placeholder only when a signature you don't own forces it, because padded parameters make readers guess whether the value is ignored on purpose.
- Don't open browser windows or tabs (Playwright, browser extensions, or `npm run dev`, which opens Chrome through `--open`) unless the user asks, because it takes over their screen and a fresh profile is usually logged out anyway. For visual checks, ask for a screenshot.
- Commit messages are short, imperative, present tense, plain and human (`fix loading state across pages`), with no AI formatting and no agent references.

## Architecture & feature folders

- Read the surrounding files first and follow their component, hook and store patterns, naming and folder structure. Add a folder only when the task needs one.
- Before adding a component, look in `src/components/` and `src/features/shared/` for one that covers the case, and extend it instead of building a sibling.
- Redux state lives in Redux Toolkit slices in a feature's `store/`, combined in `src/store/index.ts`. Don't introduce a second state library or store pattern next to it.
- A capability shown by more than one feature, now or planned, gets its own `src/features/<name>/` folder with an `index.ts`, like `src/features/insights/`. Host features import its public pieces through that `index.ts` and keep only their own wiring, because nesting it under its first consumer forces the others to import its internals or move it later.
- Don't import another feature's internals (anything not exported from its `index.ts`). When something becomes shared, move it to `src/constants/`, `src/components/` or `src/features/shared/`, remove the old definition and update every caller, because a cross-feature import creates false ownership and coupling.
- Full-page loading uses `FullPageLoader` (`src/components/display/views/FullPageLoader.tsx`). Loaders that can follow each other during one wait must render identically (same size, same label or none), because a switch between two spinners reads as a glitch. Don't wrap a lazy route in a second `Suspense` when the route-level one in `src/routes/AppRoutes.tsx` already covers it.
- React Router keeps `navigate` state in `history.state.usr`, so a reload or a return to that entry delivers it again: read a one-shot message into component state, then clear it with `navigate(location, { replace: true, state: null })` (see `Login.tsx`).
- Login and register are card content inside `AuthLayout` (`src/features/auth/components/shared/AuthLayout.tsx`), which owns the theme, brand panel and card transition. It uses `useOutlet()` rather than `<Outlet/>`, because `<Outlet/>` renders the incoming page inside the exiting card mid-animation.
- The settings navigation that renders is `src/components/layout/sidebar/SettingsMenuItems.tsx`. `SETTINGS_CONSTANTS.SECTIONS` in `src/features/settings/constants/settings.ts` drives the section content, not the sidebar's icons or labels, so a nav change made only there never appears.
- Treat a resource as gone only on a definite not-found (`error.normalized.isNotFound`, attached by `src/api/client/normalize.ts`), not on any rejected request, because transient failures take the same fallback path and would disable actions on healthy items. The snapshot `unavailable` flag in `src/features/resources/applications/clients/snapshots.ts` works this way.
- Show people by username, resolving ids with `useUsernamesByIds` (`src/hooks/useUsernamesByIds.ts`, one `users/names` call open to every signed-in user), never as a raw user id; the raw identity goes only in the hover `title`. `ActorDisplay` (`src/components/display/users/`) renders an actor field with its avatar.
- A PATCH sends only the fields it changes. The exporter refuses a session write that carries a field only services write (`bootstrap`, `identities`, `status.invite`), even with its stored value, so never spread a stored record back (`{ ...user.status, phase }`).
- In `nginx/nginx.conf`, a location's `add_header` replaces the server's whole header set, so a location that adds a header repeats the full set (like the asset location) and serves its file in place: a `try_files` fallback redirect drops the headers.

## Constants & strings

- User-facing text (labels, tooltips, messages, empty states, notifications) and log messages live in constants, never inline in components or hooks: feature text in the feature's `constants/` (for example `src/features/insights/constants/texts.ts`), shared text under `src/constants/`. One place to edit keeps copy consistent and auditable.
- Config values (thresholds, sizes, timeouts, storage keys) are constants too. Pixel values that carry meaning (shared sizes, breakpoints, minimum widths) go in `src/constants/layout/` or the feature's constants.
- A literal repeated in two or more files moves into a shared constants file, because copies drift.
- Help text under a control stays short and plain. A longer explanation goes behind an info icon: antd `Tooltip` around `InfoCircleOutlined` with `tabIndex={0}` and `aria-label` set to the text.
- A constant needed outside its feature moves to the root `src/constants/` (see the feature-boundary rule above).
- UI text doesn't name internal vendors or tools (for example Kyverno). Say "the engine" or "the policy engine", or describe the effect, because naming them leaks implementation details and ties the copy to swappable infrastructure. Non-UI code and internal constants may use the names.
- UI copy, comments and docs use American English spelling ("enroll", "color", "canceled"), never British.

## Types

- No `any`. Lint only warns on it (`@typescript-eslint/no-explicit-any: warn`), so `check-all` won't stop you; `any` hides the errors TypeScript is there to catch. Existing `any` (such as the `render` parameter of `generateColumn` in `src/components/display/table/utils.tsx`) is not a pattern to copy.
- Known typings: antd form `Rule` from `antd/es/form` (the `antd` root doesn't export it); DiceBear `Style<object>` from `@dicebear/core` (`Style<unknown>` fails its `{}` constraint); form values as a typed interface or `Record<string, unknown>`; request errors as `ExtendedAxiosError` from `src/api/client/normalize.ts`; Redux actions as `PayloadAction<ActualPayload>`. Avoid `ReturnType<typeof genericFn>` without type arguments, since it resolves with the defaults and causes contravariance errors.
- Shared interfaces go in `src/interfaces/`, feature types in the feature's `models/`.

## Styling & theme

### Colors and surfaces

- Colors come from `DEFAULT_COLORS` in `src/constants/shared/colors.ts`, the only file where a color literal may appear (ESLint `no-restricted-syntax` enforces it). Map status meaning to `SUCCESS`, `DANGER`, `WARNING`, `INFO` or `NEUTRAL`. Vary opacity with `withAlpha(token, alpha)` instead of writing `rgba()`. Don't add keys: every status maps to an existing token (green is always `SUCCESS`).
- CSS files read the same tokens as `var(--color-<kebab-key>)` (for example `SUCCESS_HOVER` → `--color-success-hover`), set on `:root` by `applyColorVariables()` in `src/main.tsx`; for alpha in CSS use `color-mix(in srgb, var(--color-…) N%, transparent)`.
- The page is dark and overlays are light, and some token names lie. Decide the surface first, then pick from its palette:

  | Surface | Tokens | Traps |
  |---|---|---|
  | Dark: page, cards, settings cards | `PAGE_BG`, `SURFACE_ELEVATED*`, `BORDER_ELEVATED`, `TEXT_PRIMARY`, `TEXT_SECONDARY`, `TEXT_MUTED`, `TEXT_DISABLED`, `CHIP_CUSTOM_BG` | `TEXT_PRIMARY` is white; `BORDER_SUBTLE` is darker than `BORDER_DEFAULT` |
  | Light: slide-out panels, modals, dropdowns, popovers, tooltips | `SURFACE_WHITE`, `SURFACE_SUBTLE`, `SURFACE_HOVER`, `SURFACE_BORDER*`, `TEXT_ON_SURFACE`, `TEXT_ON_SURFACE_MUTED`, `TEXT_ON_SURFACE_DISABLED`, `CHIP_ON_SURFACE_*` | Dark-surface text tokens here render white on white |

  The wrong palette fails silently: `check-all` passes and the text still copies, so it looks like missing data. When something "shows nothing", suspect white on white first.
- Pills are the declared case color itself: spread `getPillSurface(accent)`, which returns the background and the text color, and don't set `color` yourself. Pass the accent as a `DEFAULT_COLORS` value (`SUCCESS`, `DANGER`, `WARNING`, `INFO`, `NEUTRAL`, `TEXT_MUTED`); any other value, or none, gives the neutral pill. Pill text is white on every case (user decision); `INFO` renders as `INFO_STRONG`, since the light `INFO` can't carry white text. Quick-filter pills use `getQuickFilterPillColors`.
- No box-shadow on buttons unless the user asks for it.

### Ant Design theme

- Work with antd rather than replacing or removing it. Global theming lives in the `ConfigProvider` in `src/App.tsx` (`token` and `components`). Match the existing token usage before adding tokens, and put per-component tweaks in its `components` blocks.
- Don't wrap a single control in its own `ConfigProvider`, because it doesn't reliably inherit the global `controlHeight`. The deliberate nested providers are the panel surface (`PANEL_THEME_TOKENS` in `AnimationWrapper`, `FilterPanel` and `BaseModal`) and the auth pages (`src/features/auth/constants/theme.ts`).
- Don't set `colorText` on a component whose parts render on different surfaces. A `Select`'s closed control sits on the dark page while its dropdown is a portal on white, and one `Select.colorText` drives both, so it is deliberately unset; the dropdown text is pinned in `src/styles/antd.css` (the `.ant-select-dropdown` and `.ant-select-multiple` rules). Panels are scoped by `PANEL_SURFACE_CLASS` (`app-panel-surface`) and portals render outside it, so style against that seam.
- A two-class CSS selector doesn't beat antd's CSS-in-JS, whose rules are deeper and injected later. Fix the token first; when CSS is needed, scope it by surface in `antd.css` like the existing rules.
- Reuse the global classes in `src/styles/` (`form-item-compact`, `no-asterisk`, `manifest-code`, `tk-scroll-hidden`) before adding a new one.

### Fonts

- `src/styles/index.css` sets Geist on `#root *` with `!important`, which beats inline styles, so inline `fontFamily` and antd font tokens have no effect. Don't add them, and don't read an existing one as what renders. Monospace text uses `MONOSPACE_CLASS` (`src/constants/layout/fonts.ts`, the `manifest-code` class), whose `!important` rule is the only way past the global one; its bare-class selector also reaches popovers and tooltips, which render under `body`, outside `#root`.

### Control sizing

- Every control's height, radius and font size come from `src/constants/layout/controls.ts` (`CONTROL_HEIGHT`, `CONTROL_RADIUS`, `CONTROL_FONT_SIZE`): through the `App.tsx` tokens for antd controls, and through `TOOLBAR_CONTROL` (`src/constants/layout/buttons.ts`) for the app's own buttons. The auth pages opt out with `AUTH_CONTROL_HEIGHT`. Borders aren't part of it; they stay surface-scoped in `antd.css`.
- Four things silently defeat it: a `size="small"` or `size="large"` prop on a form control (antd switches to its small or large height), an inline `height`, a nested `ConfigProvider`, and a global `!important` rule on the control's selector in `src/styles/*.css`.
- Toolbar sizing and spacing come from `TOOLBAR_CONTROL` and `TOOLBAR_ITEM_GAP`; change the constants, not the components. Toolbar controls need `boxSizing: 'border-box'` (bordered variants otherwise render 2px taller) and `lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT` (otherwise the label's half-leading pushes it off-center against icons). `BUTTON_COLORS.TOOLBAR_TEXT` defaults to white, so an active button with a white background needs `TEXT_ON_SURFACE` text.

### Light surfaces and color-scheme

- The document is `color-scheme: dark`, so every light surface declares `color-scheme: light`, as `.app-panel-surface` and `.auth-root[data-theme='light']` do in `src/styles/index.css`. Chrome paints autofilled input text through a user-agent `!important` rule keyed off `color-scheme` that no author CSS can override, so a light surface without the declaration gets white-on-white autofill.

## Tables & lists

- Sort, group and paginate in the UI over the loaded, filtered set, like the Roles list: `useSortState` and `sortData` from `src/utils/layout/sort`, and `generateColumn(cfg, { activeSortKey, onSort })` for headers. Don't send sort or group params to the backend: no list client does, the Insights endpoint has none, and sorting in one place keeps every list consistent. The Insights client reads the whole filtered set for this reason.
- One fact per column. Triage is its own column rather than a second pill in State, because two facts in one cell read as one muddled status.
- The free-text (title) column is one line with an ellipsis and the full text on hover (`title`). The shared list table (`PageLayout` → `DataTable`) uses `scroll: { x: 'max-content' }`, so antd `ellipsis` alone doesn't stop long text widening the column; give the cell content `width: 0; min-width: max(100%, <floor>px)` (see `TitleCell` in `src/features/insights/components/InsightsTable.tsx`). Content-driven widths make the table jump between pages.
- Toolbar counts are pluralized with `CountLabel { one, other }` (`src/interfaces/layout/toolbar.ts`, passed as `countSuffix` to `ListToolbar`), not by string concatenation.
- The "More" overflow menu holds rarely used or irreversible actions (reset sits there so it is never one slip from a neighboring button). A mode's exit, such as "Exit bulk", stays inline, because hiding it strands users.
- `Toolbar` shows a button's `tooltip` only while the button is disabled (or `iconOnly`), so pass `tooltip: allowed ? undefined : MESSAGE` for a permission hint. Its `loading` flag also blocks repeat clicks.
- Icon-only row actions are antd `Button`s with `type="text"`, a `ROW_ICON_BUTTON_SIZE` square (`src/constants/layout/controls.ts`) and a muted color (`TEXT_ON_SURFACE_MUTED` on light surfaces), wrapped in a `Tooltip` and given an `aria-label`.

## Panels & forms

- Side panels use the shared components in `src/components/display/panels/`: `SlideOutPanel` (form panel; `contentOnly` for other content), `AnimationWrapper` (the frame it renders in) and `FilterPanel`. They bring the light surface class and theme, the scroll lock and the header, so don't build a panel frame by hand.
- Pages scroll in the content pane below the header (`APP_CONFIGS.LAYOUT.CONTENT_ID` in `App.tsx`), never the window, so the header, sidebar and panels span the full viewport and the scrollbar runs beside the content only. The pane reserves its gutter (`scrollbar-gutter: stable`) so content never shifts when a scrollbar appears. Page offsets and sticky `top` values are relative to the pane: no header-height offsets, and `HEADER_LAYOUT.MIN_HEIGHT` fills it. Scroll-to-top targets the pane.
- The scroll lock is `useScrollLock(open)` (`src/hooks/panel/useScrollLock.ts`). It is counted, so stacked panels work (the first lock applies, the last release restores). It hides the pane's overflow; the reserved gutter keeps the page in place. Don't give a panel a negative `right` to reach the edge.
- Panel actions are one pinned footer rendered by the frame: `SlideOutPanel` builds it from its submit props, `AnimationWrapper` takes `footer` (the `PanelFooter` props), and `FilterPanel` renders the same `PanelFooter`. Don't render a footer or an inner scroll container in a feature, because the padded body must be the scroller for its scrollbar to sit at the panel edge. Panels have a title and no subtitle; the shared panel header takes none.
- The panel header is exactly as tall as the app header: `SLIDE_OUT.HEADER.height` is `HEADER_LAYOUT.HEIGHT_PX`. Change the header constant, not the panel, so the two top bars stay aligned.
- Everything inside a panel is on the light surface; use its palette.
- Dialogs use `BaseModal` (`src/components/display/modal/`), and confirmations `ActionConfirmModal` on top of it. It owns the frame, the light-surface theme, the title and text styles and the footer (`ActionButtons`: muted cancel, solid primary or danger), so don't render antd `Modal` directly or style a modal frame by hand.
- A role or group list without read access renders its own no-access card instead of its form field, which unregisters the field. A panel hosting it shows its search, toggles and filter only with that read permission and disables submit without it, because the form would otherwise send an empty selection that removes every assignment.
- Form fields are antd vertical `Form.Item`s with `className="form-item-compact"` (plus `no-asterisk` to hide the required mark), 16px apart. Filter panel fields get this from `FILTER_PANEL.ITEM_CLASS` and `FILTER_PANEL.ITEM`, and their labels are sentence case ("Filter by severity").

## Layout & responsiveness

- Measure rather than guess breakpoints and timings. A viewport media query (`useMediaQuery`, e.g. `TOOLBAR_CONTROL.COMPACT_QUERY`) is right only for behavior that depends on the window. The sidebar (collapsible and resizable, `SIDEBAR_LAYOUT`) and open panels change the available width without changing the viewport, so compact modes read the container's measured width with `useElementWidth` (`src/hooks/layout/useElementWidth.ts`), as `ListToolbar` does with its `compactWidth` thresholds.
- Layout that depends on an animated width, such as an expanding panel, reads the measured element width, not the expand flag, because the flag flips before the animation finishes (see `InsightPanelSections.tsx`).
- To make one element give way before its sibling, prefer CSS to any threshold: `flexShrink: 100000` with `minWidth: 0` on the less important sibling (see `ApplicationDetailsIdentity.tsx`).
- When a threshold is unavoidable, derive it from the measured content need, not from a constant borrowed from another component.
- A `SettingsCard` `headerAction` never shrinks, so variable-length text goes in the card body.
- Avoid layout shift: widths shouldn't depend on content that changes between pages or loads (ellipsize instead); render nothing rather than a placeholder that later widens (as `ListToolbar` does before the first count); and render optional flex children conditionally, because a zero-width child still takes a `gap`.

## Logging

- Log through the project logger (`import logger from '<relative path>/logging'`, then `logger.debug`, `info`, `warn` or `error`), not `console.*`. `no-console` is an error everywhere except `src/logging/**` and `k6/**`; keep it that way. The logger applies levels, environment gating and persistence that console calls bypass.
- Log messages are constants like any other string.
- To see debug output in the browser, run `localStorage.setItem('loglevel', 'debug')` and reload, or change `DEFAULT_LOG_LEVELS.DEVELOPMENT` in `src/logging/levels.ts`.
- For sub-second glitches a screenshot can't catch, add temporary `logger.debug` calls with `performance.now()` at the suspected mount points, reproduce, read the log, and remove the calls before finishing.

## Verification & done criteria

- After every change set, run `npm run check-all` (`tsc --noEmit`, then `eslint .`) and fix every error. Before handing off, run `npm run check-all-and-build`, which adds the build and is what the telark build pipeline runs on this repo. The `verify-ui-change` skill has the details.
- Fix causes, not rules: no `eslint-disable` comments, and no CLI flags or config edits that bypass `eslint.config.mjs`, `tsconfig.json` or `.prettierrc`, because the checked-in configs are what CI runs. If output is unclear, read the config.
- Don't add warnings. Fix the auto-fixable ones (prettier) in code you touched, and leave pre-existing warnings elsewhere alone.
- No check covers what renders; for visual changes, ask the user for a screenshot.
- When a change alters something `README.md` states (scripts, main areas, services or ports, conventions), update it in the same change.

Done means:
- The change follows the naming and structure of the surrounding files.
- No string or config value is defined outside `constants/`.
- No new `any` and no `console.*`.
- Every new or modified function has a cognitive complexity of 12 or less (no lint rule enforces this; judge it while reading).
- No dead code, commented-out blocks, unused imports or TODOs are left behind.
- The repo has no test runner or test files today. If you add or touch tests and one asserted wrong behavior, flag it explicitly instead of silently changing it.
- `npm run check-all-and-build` passes with zero errors.

## Skills index

Claude Code loads these automatically; other agents can open the file and follow it.

| Skill | Use when | Path |
|---|---|---|
| `verify-ui-change` | Before reporting any change as done, or when type-check, lint or the build fails | `.claude/skills/verify-ui-change/SKILL.md` |
| `visual-and-layout-changes` | A request or bug is about how the UI looks: colors, invisible text, fonts, sizes, spacing, compact behavior, flashes, layout shift | `.claude/skills/visual-and-layout-changes/SKILL.md` |
| `list-and-table-pages` | Building or changing a list page, table, columns, sorting or grouping, the list toolbar, row actions or pills | `.claude/skills/list-and-table-pages/SKILL.md` |
| `side-panels-and-forms` | Adding or changing a slide-out panel, filter panel, or the form fields inside one | `.claude/skills/side-panels-and-forms/SKILL.md` |
| `graph-explore-codebase` | Understanding structure or dependencies, when the code-review-graph server has this repo indexed | `.claude/skills/graph-explore-codebase/SKILL.md` |
| `graph-debug-issue` | Tracing a bug through call chains and recent changes, with the graph available | `.claude/skills/graph-debug-issue/SKILL.md` |
| `graph-review-changes` | Reviewing a diff, branch or PR for risk, blast radius and coverage, with the graph available | `.claude/skills/graph-review-changes/SKILL.md` |
| `graph-refactor-safely` | Renames, dead-code removal or restructuring, with the graph available | `.claude/skills/graph-refactor-safely/SKILL.md` |
