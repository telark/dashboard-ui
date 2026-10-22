# dashboard-ui agent guide

This is the canonical instruction file for coding agents working in this repo; `CLAUDE.md` only imports it. Procedures for recurring work live in `.claude/skills/<name>/SKILL.md`. They are plain Markdown, so any agent can open them; the [skills index](#skills-index) says when each one applies.

dashboard-ui is the operator-facing SPA for telark: React 19, TypeScript 7, Vite, Redux Toolkit, Ant Design 6. It has no backend logic of its own. `README.md` covers the backend services, dev ports and scripts. Branch, commit and PR conventions are in the [Telark contribution guide](https://github.com/telark/telark/blob/main/CONTRIBUTING.md#branches-commits-and-pull-requests).

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
- A list page picks loading, empty or populated from its slice's `loaded` flag (set when the list arrives), never from `loading`: that one is false before the first fetch and true on every refetch or poll, so it shows the empty page before the data and flips a known page to a spinner. A page whose empty state is a page of its own loads behind `FullPageLoader` (`PageLayout`'s `fullPageLoading`), because its frame isn't known until the list is.
- Pollers run through `pollWhileVisible` (`src/utils/helpers/poll.ts`) inside their effect: no requests while the tab is hidden, one poll on return. One poller per data source: a second consumer takes the first one's data (the notifications bell passes its feed to the panel), because a second hook call starts a second interval. A poll that returns what is shown keeps the old state object (`useDiscoveryStatus`), or every subscriber re-renders each period. So does a revalidation: every panel mount refetches the categories, and their reducer keeps an unchanged list.
- The session is auth's HttpOnly cookie: no JS stores, reads or sends a session token. The one exception, until 0.3.0: at load, `dropLegacySessionToken` (`src/features/auth/utils/session/token.ts`) drops a pre-0.2.0 token from `localStorage` and sends it once, to auth logout. Requests go through the shared clients in `src/api/client/instances.ts`, which send credentials and `X-Requested-With` (the backends refuse a change without that header or a header credential), and a raw `fetch` adds `credentials: 'include'`, plus `X-Requested-With` for a change. "Signed in" is the stored current user (`isSignedIn`), and "this device's session" comes from `GET auth/sessions/self`. Only auth can clear the cookie, so a logout clears local state (and signs out other tabs) only once auth answers: a failed one keeps the user signed in and shows a retry error.
- Server-sent event streams go through `keepEventStream` (`src/api/client/eventStream.ts`): fetch with the session cookie, never `EventSource` or a token in the URL. A refused stream (401 or 403) raises `SESSION_CHECK_EVENT`, which runs the session check at once. A stream is closed while the tab is hidden, its connect makes the one refetch on return, and its consumer polls with `pollWhileVisible` while it is down (`useNotifications`). Browsers allow 6 HTTP/1.1 connections per origin, and a port-forward puts every API on one origin, so hidden tabs must not hold streams open. The insights streams (`useApplicationInsights`, `useAnalyzerRuntime`) are the exception: they still stay open while hidden.
- Permission checks (`usePermission`, `PermissionGate`) use the last known permissions and never read `permissions.loading`. Access mutations refetch permissions, and a check that reads that refetch as denied swaps the route for its `NoPermissionCard`, unmounting the page (and any open panel) and remounting it when the refetch lands. The first load is `ProtectedRoute`'s job: it holds gated routes until `ready`.
- Toasts come from `App.useApp()`, which reads `<AntdApp message>` in `App.tsx` (`APP_CONFIGS.MESSAGE`: under the header, at most 3). The static `message.config` reaches none of them, and antd's 3 s default needs no per-toast `duration`.
- Every spinner is `FancySpinner` (`src/components/animation`). antd Button and Select loading icons come from the `ConfigProvider` in `App.tsx`, so don't use antd `Spin` or `LoadingOutlined`.
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
- A shared control that renders on both surfaces takes its colors from a `BUTTON_COLORS` `var()` (`src/constants/layout/buttons.ts`) that falls back to the dark token and that `.app-panel-surface` re-points to the light one in `antd.css`, not from a `light` prop, because a prop must be remembered at every call site and a missing one fails silently. Examples: `Toolbar` and `FilterButton` (`TOOLBAR_*`), `Switch` (`SWITCH_OFF`), `ValidityDisplay` and `UserDisplay` (`MUTED_TEXT`). Panels, filter panels and modals carry that class; dropdowns, popovers and tooltips are portals outside it, so their content uses the light tokens directly.
- Pills are antd `Tag`s: `<Tag color={getPillColor(accent)}>`, with no color for the neutral pill. The look comes from `TAG_THEME` in the `App.tsx` `ConfigProvider` plus the `tk-pill` class it puts on every Tag; vary it only with `TAG_CLASS` modifiers (`src/constants/layout/tags.ts`, rules in `antd.css`): 11px and capitalized by default, `MEDIUM` 12px, `XSMALL` 10px, `AS_IS` keeps the text's case. Don't build pill spans or wrap `Tag`. The accent is a `DEFAULT_COLORS` value (`SUCCESS`, `DANGER`, `WARNING`, `INFO`, `NEUTRAL`, `TEXT_MUTED`); any other value, or none, gives the neutral pill. Pill text follows the fill for WCAG AA contrast (user decision, 2026-10-16): `TEXT_ON_SURFACE` on the light fills (`SUCCESS`, `WARNING`, `TEXT_MUTED`, `NEUTRAL`), white on `INFO`, `DANGER` (4.6:1) and the neutral pill. `getPillTextColor` decides it: `TAG_STYLES` in the `ConfigProvider` applies it to every Tag, and `getPillSurface` returns it for pills that aren't Tags. `INFO` renders as `INFO_STRONG`, since the light `INFO` can't carry white text. Card status pills are standard pills too, capitalized, never uppercase (user decision, 2026-10-07). Quick-filter pills use `getQuickFilterPillColors`.
- Every status → color mapping lives in `STATUS_COLORS` (`src/constants/shared/statusColors.ts`); add a status there, not in a feature.
- Each color keeps one meaning across features (user decision, 2026-10-21). Teal (`SUCCESS`) is the logo, primary actions and success only, so selection (table rows, the current page) and decoration take neutral tokens. Red (`DANGER`) means down, failed, refused or an incident; amber (`WARNING`) means degraded, drifted or pending; scheduled and in-progress states are `NEUTRAL`.
- Red is never text on the dark page: `DANGER` is 3.6:1 on cards and 3.9:1 on the page. Put a red dot or icon beside `TEXT_PRIMARY` text (`INCIDENT_DOT_STYLE`, `CloseCircleFilled`); as a fill under white text and as an icon it passes.
- Headings follow the page outline with no skipped level, styled inline (empty states by their `antd.css` rule) so the level never changes the look: the page title is the h1 (`PageContainer`, `SectionHeader`), `SettingsCard` titles and a `PAGE` empty state's title (`Typography.Title level={2}`) are h2, and `SettingsSubsectionHeader` and a `SECTION` empty state's title (`Typography.Title level={3}`) are h3.
- Empty states are antd `Empty` with an `EMPTY_CLASS` (`src/constants/layout/empty.ts`) for their surface: `PAGE`, `PANEL` or `SECTION`. The icon goes in `image` (`image={false}` for none), a `Typography.Title` and `Typography.Text` in `description`, and buttons as children, styled with `EMPTY_ACTION_STYLE` on a page.
- No box-shadow on buttons unless the user asks for it.

### Ant Design theme

- Work with antd rather than replacing or removing it. Global theming lives in the `ConfigProvider` in `src/App.tsx` (`token` and `components`). Match the existing token usage before adding tokens, and put per-component tweaks in its `components` blocks.
- Don't wrap a single control in its own `ConfigProvider`, because it doesn't reliably inherit the global `controlHeight`. The deliberate nested providers are the panel surface (`PANEL_THEME` in `AnimationWrapper` and `FilterPanel`, and `OVERLAY_THEME` in `modals.ts`, built once, in `BaseModal` and the `FeatureErrorBoundary` error overlay) and the auth pages (`src/features/auth/constants/theme.ts`).
- antd generates a control's styles the first time it renders under a theme, which the first panel opened on a page paid while it slid in. `PanelThemePrewarm` (mounted in `App.tsx`) renders the common panel controls (`PanelThemeControls`) offscreen under `PANEL_THEME` once the app is idle, and that theme's css-var key is fixed so every panel reuses those styles (antd otherwise keys each provider by its own id). A provider on that key must use that exact theme, because two themes on one key overwrite each other's variables. The prewarm loads its chunk before it renders in a transition: a transition that suspends on a lazy chunk holds back the page's deferred renders (it delayed the Members list by 210 ms).
- The `darkAlgorithm` wrapper in `App.tsx` hands back the seed `colorPrimary`, `colorSuccess`, `colorWarning`, `colorError`, `colorInfo` and `colorLink`, because the algorithm shifts every seed color and antd would draw its own shades beside ours. Set a base color in the root `token`, not per component.
- Each surface has one keyboard focus ring color, because antd draws every ring in `colorPrimaryBorder` and its derived mint fails on both surfaces. The dark page uses `TEXT_SECONDARY` (the root token, plus one `:focus-visible` rule in `antd.css` for the app's own controls that reset the outline inline; table rows draw theirs in the cells). The light surfaces use `TEXT_ON_SURFACE_MUTED` (4.8:1 on white), set in `PANEL_THEME_TOKENS`.
- Don't set `colorText` on a component whose parts render on different surfaces. A `Select`'s closed control sits on the dark page while its dropdown is a portal on white, and one `Select.colorText` drives both, so it is deliberately unset; the dropdown text is pinned in `src/styles/antd.css` (the `.ant-select-dropdown` and `.ant-select-multiple` rules). Panels are scoped by `PANEL_SURFACE_CLASS` (`app-panel-surface`) and portals render outside it, so style against that seam.
- A two-class CSS selector doesn't beat antd's CSS-in-JS, whose rules are deeper and injected later. Fix the token first; when CSS is needed, scope it by surface in `antd.css` like the existing rules.
- Reuse the global classes in `src/styles/` (`form-item-compact`, `no-asterisk`, `manifest-code`, `tk-scroll-hidden`) before adding a new one.

### Fonts

- `src/styles/index.css` sets Geist on `#root *` with `!important`, which beats inline styles, so inside `#root` an inline `fontFamily` has no effect. Don't add one, and don't read an existing one as what renders.
- Portals (tooltips, popovers, dropdowns, Select and DatePicker popups, messages) render under `body`, outside `#root`. They take the root `token.fontFamily`, which is `FONT_FAMILY` (`src/constants/layout/fonts.ts`), the same stack.
- Monospace text uses `MONOSPACE_CLASS` (same file, the `manifest-code` class), whose `!important` rule is the only way past the global one. Its bare-class selector also reaches portals.

### Control sizing

- Every control's height, radius and font size come from `src/constants/layout/controls.ts` (`CONTROL_HEIGHT`, `CONTROL_RADIUS`, `CONTROL_FONT_SIZE`): through the `App.tsx` tokens for antd controls, and through `TOOLBAR_CONTROL` (`src/constants/layout/buttons.ts`) for the app's own buttons. The auth pages opt out with `AUTH_CONTROL_HEIGHT`. Borders aren't part of it; they stay surface-scoped in `antd.css`.
- Four things silently defeat it: a `size="large"` prop on a form control (antd switches to its large height), an inline `height`, a nested `ConfigProvider`, and a global `!important` rule on the control's selector in `src/styles/*.css`. `size="small"` is the one compact step (antd's small height) and is never combined with an inline `height`, which would override it.
- Toolbar sizing and spacing come from `TOOLBAR_CONTROL` and `TOOLBAR_ITEM_GAP`; change the constants, not the components. Toolbar controls need `boxSizing: 'border-box'` (bordered variants otherwise render 2px taller) and `lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT` (otherwise the label's half-leading pushes it off-center against icons). `BUTTON_COLORS.TOOLBAR_TEXT` defaults to white, so an active button with a white background needs `TEXT_ON_SURFACE` text.

### Scales

- Inline font sizes, weights and line heights come from `FONT_SIZE`, `FONT_WEIGHT` and `LINE_HEIGHT` (`src/constants/layout/fonts.ts`), gaps, paddings, margins and corners from `SPACING` and `RADIUS` (`controls.ts`), transition timings from `MOTION` and stacking from `Z_INDEX`. A value off its scale stays literal with a one-line reason. The scales are constants only and don't feed antd tokens, which stay in `App.tsx`.
- `Z_INDEX` is the one stacking order: the header (100) sits below the panel backdrop (1000), so an open panel dims it. Add a layer there, never a literal.
- Shared composites: 1px borders are `SECTION_LAYOUT.SUBTLE_DIVIDER` (dark page) and `HAIRLINE.<token>` (`sections.ts`), the 8px status dot is `STATUS_DOT` (`icons.ts`, color per site), and a plain button resets with `UNSTYLED_BUTTON` (`buttons.ts`, which keeps the focus ring, unlike `all: 'unset'`). Spread and override them, never rebuild them inline.

### Light surfaces and color-scheme

- The document is `color-scheme: dark`, so every light surface declares `color-scheme: light`, as `.app-panel-surface` and `.auth-root[data-theme='light']` do in `src/styles/index.css`. Chrome paints autofilled input text through a user-agent `!important` rule keyed off `color-scheme` that no author CSS can override, so a light surface without the declaration gets white-on-white autofill.

## Tables & lists

- Sort, group and paginate in the UI over the loaded, filtered set, like the Roles list: `useSortState` and `sortData` from `src/utils/layout/sort`, and `generateColumn(cfg, { activeSortKey, onSort })` for headers. Don't send sort or group params to the backend: no list client does, the Insights endpoint has none, and sorting in one place keeps every list consistent. The Insights client reads the whole filtered set for this reason.
- `PageLayout` renders the table from a deferred copy of its config, so a keystroke re-renders only the toolbar, and the table re-renders only when `columns`, `data`, `rowKey`, `empty`, `rowSelection` or `onRowClick` change identity. Memoize them (and anything derived from a measured width on what it decides, like `fittingInsightColumns`), because an inline one re-renders every cell on each parent render. Give each its own memo or a module constant, never the memo that builds the whole config: that one also holds the toolbar, which is new on every render, so a table prop built there re-renders the table whenever a panel opens. Handlers built on `setSearchParams` change with every URL change, so read it through a ref (`ClusterInsightsView`). Card grids do the same with `useDeferredValue` on the search (Applications).
- One fact per column. Triage is its own column rather than a second pill in State, because two facts in one cell read as one muddled status.
- The free-text (title) column is one line with an ellipsis and the full text on hover (`title`). The shared list table (`PageLayout` → `DataTable`) uses `scroll: { x: 'max-content' }`, so antd `ellipsis` alone doesn't stop long text widening the column; give the cell content `width: 0; min-width: max(100%, <floor>px)` (see `TitleCell` in `src/features/insights/components/InsightsTable.tsx`). Content-driven widths make the table jump between pages.
- Toolbar counts are pluralized with `CountLabel { one, other }` (`src/interfaces/layout/toolbar.ts`, passed as `countSuffix` to `ListToolbar`), not by string concatenation.
- The "More" overflow menu holds rarely used or irreversible actions (reset sits there so it is never one slip from a neighboring button). A mode's exit, such as "Exit bulk", stays inline, because hiding it strands users.
- An empty state shows the feature's sidebar icon from `Icons`, and one shown under a toolbar repeats none of its actions (Protection plans), because a second Create button is noise.
- Card tag rows go through `CardTagList` (`src/components/display/card/`): up to `max` tags (`CARD_LAYOUT.MAX_TARGET_TAGS`, or `PLAN_CARD_MAX_TAGS` on plan cards), then one "+N" pill whose tooltip lists the rest. `CardChipSection` caps chips at `MAX_POLICY_CHIPS` the same way, so a card never grows with its data.
- `Toolbar` shows a button's `tooltip` only while the button is disabled (or `iconOnly`), so pass `tooltip: allowed ? undefined : MESSAGE` for a permission hint. Its `loading` flag also blocks repeat clicks.
- Icon-only row actions are antd `Button`s with `type="text"`, a `ROW_ICON_BUTTON_SIZE` square (`src/constants/layout/controls.ts`) and a muted color (`TEXT_ON_SURFACE_MUTED` on light surfaces), wrapped in a `Tooltip` and given an `aria-label`.

## Panels & forms

- Side panels use the shared components in `src/components/display/panels/`: `SlideOutPanel` (form panel; `contentOnly` for other content), `AnimationWrapper` (the frame it renders in) and `FilterPanel`. They bring the light surface class and theme, the scroll lock and the header, so don't build a panel frame by hand.
- `AnimationWrapper` paints the frame on the click and renders the body and footer a frame later, because rendering a large form inside the click held the first frame back (up to 1.6 s in prod, more in dev). Motion durations and curves live in `SLIDE_OUT` (`NO_MOTION` under `prefers-reduced-motion`), and a closed panel slides out inert so it never blocks the next click.
- An edit panel that mounts per open creates its own form (`Form.useForm` inside the panel), never one passed in from the page. The body renders a frame after the panel, so a reset or `setFieldsValue` in an on-open effect runs before the fields exist, and the fields that mount later merge their values under the previous record's (Edit Role showed another role this way). Change checks compare only the fields the panel has: a stored field the form never registers reads as changed forever.
- `SlideOutPanel` closes the panel when `onSubmit` resolves. A handler that shows its own error must rethrow, or a failed save closes the panel and drops the input. It shows the error once, in one place, and a failed save leaves the slice's `error` alone, because the page reads that as a failed load (a second toast).
- A panel takes focus when it opens, so the next Tab reaches its header, not the page behind the backdrop, and `AnimationWrapper` gives focus back to the trigger when it closes. The header's icon buttons are plain buttons: each has an `aria-label` (the X uses `BUTTON_TEXTS.CLOSE`) and `SLIDE_OUT.HEADER_BUTTON_CLASS`, which gives them the panel focus ring (`index.css`). Any other plain button in a panel takes that class too, since an inline `all: unset` removes the browser's ring.
- A transitioned width is clamped inside `width` (`min(<px>, <max>)`), never with `max-width`: the transition animates the set value, so a clamp outside it makes the panel hold still and then stop dead.
- Pages scroll in the content pane below the header (`APP_CONFIGS.LAYOUT.CONTENT_ID` in `App.tsx`), never the window, so the header, sidebar and panels span the full viewport and the scrollbar runs beside the content only. The pane reserves its gutter (`scrollbar-gutter: stable`) so content never shifts when a scrollbar appears. Page offsets and sticky `top` values are relative to the pane: no header-height offsets, and `HEADER_LAYOUT.MIN_HEIGHT` fills it. Scroll-to-top targets the pane.
- The scroll lock is `useScrollLock(open)` (`src/hooks/panel/useScrollLock.ts`). It is counted, so stacked panels work (the first lock applies, the last release restores). It hides the pane's overflow; the reserved gutter keeps the page in place. Don't give a panel a negative `right` to reach the edge.
- A view panel that shows related lists (a member's roles and groups, a group's members and roles, a role's scopes and protection) passes them as `tabs` to `ViewPanel`: `ViewPanelTabs` puts a Details tab with its `details` first, then antd `Tabs` with each tab's label and count badge (dark on the selected tab) and no icons, sized and colored by `PANEL_TABS_THEME` in the panel theme. The header is a left-aligned identity row (the avatar or icon in the shared `avatarRingStyle` ring, then the name and description) on a `SURFACE_SUBTLE` band that bleeds to the panel edges, and the tab bar (`VIEW.TAB_BAR`) continues that band, closed by the tab line. Each feature builds its tabs in a hook (`useUserViewTabs`, `useGroupViewTabs`, `useRoleViewTabs`), read-only lists reuse the Manage panels' assigned views without a remove handler, and a list the viewer can't read shows its `NoPermissionCard`. A listed item's view button (`onViewClick`) opens that item's view panel on top, on the same page, never through navigation: the hook returns it as `stackedPanel`, rendered after the first panel, and the stacked panel (`stacked`) is read-only and opens nothing further, so its X returns to the first. Built-in roles get no view button (`isBuiltInRole`), since the Roles page lists custom roles only. Role rows render through `AssignedRoleContent`: a protected role shows the neutral "Locked role" pill (`LockedRolePill`, the same one the role pickers show) with the detail in its tooltip, and granting groups as plain "Via …" text at the bottom right, never as tags.
- Panels and dialogs share one action footer, `ActionButtons` (`src/components/display/buttons/`): Cancel, then the primary, on the right, 8px apart. Both are plain antd `Button`s, so their height, radius, font, colors and spinner come from the `App.tsx` theme; the layout lives in `PANEL_FOOTER` (`src/constants/layout/panels.ts`) and Cancel's muted look and inverted hover in one `antd.css` rule (`PANEL_FOOTER.CANCEL_CLASS`). Don't give footer buttons an icon, an inline size or color, or a loading label: a running action keeps its label and shows the theme spinner, and Cancel is disabled meanwhile. Edit panels say "Save changes" (`BUTTON_TEXTS.SAVE_CHANGES`); create and assignment panels name their action.
- Panels pin that footer in a bar rendered by the frame (`PanelFooter`, as tall as the header with a full-width top line): `SlideOutPanel` builds it from its submit props, `AnimationWrapper` takes `footer` (the `PanelFooter` props), and `FilterPanel` renders through `AnimationWrapper`. Read-only panels have no footer; the header X closes them. Don't render a footer or an inner scroll container in a feature, because the padded body must be the scroller for its scrollbar to sit at the panel edge. Panels have a title and no subtitle; the shared panel header takes none.
- The panel header is exactly as tall as the app header: `SLIDE_OUT.HEADER.height` is `HEADER_LAYOUT.HEIGHT_PX`. Change the header constant, not the panel, so the two top bars stay aligned.
- Everything inside a panel is on the light surface; use its palette.
- Dialogs use `BaseModal` (`src/components/display/modal/`), and confirmations `ActionConfirmModal` on top of it. It owns the frame, the light-surface theme, the title and text styles and the placement of its `footer`, the same `ActionButtons` panels pin (solid primary or danger), so don't render antd `Modal` directly or style a modal frame by hand.
- A role or group list without read access renders its own no-access card instead of its form field, which unregisters the field. A panel hosting it shows its search, toggles and filter only with that read permission and disables submit without it, because the form would otherwise send an empty selection that removes every assignment.
- Form fields are antd vertical `Form.Item`s with `className="form-item-compact"` (plus `no-asterisk` to hide the required mark), 16px apart (`FORM_ITEM_GAP`, the root `components.Form.itemMarginBottom`). Filter panel fields get this from `FILTER_PANEL.ITEM_CLASS` and `FILTER_PANEL.ITEM`, and their labels are sentence case ("Filter by severity").

## Layout & responsiveness

- Measure rather than guess breakpoints and timings. A viewport media query (`useMediaQuery`, e.g. `TOOLBAR_CONTROL.COMPACT_QUERY`) is right only for behavior that depends on the window. The sidebar (collapsible and resizable, `SIDEBAR_LAYOUT`) and open panels change the available width without changing the viewport, so compact modes read the container's measured width with `useElementWidth` (`src/hooks/layout/useElementWidth.ts`), as `ListToolbar` does with its `compactWidth` thresholds.
- The sidebar's width is `--sidebar-width`, a non-inherited `@property` (`index.css`) set on the content pane, so a toggle restyles that one element, not the whole document. Below `SIDEBAR_LAYOUT.FORCE_COLLAPSE_QUERY` the sidebar is a fixed rail, and each main nav icon shows its short name under it (`MENU_RAIL_LABELS`, `SidebarButton`'s `railLabel`), because touch can't open a tooltip. Sidebar items read the location only in a small inner button, because `useNavigate` re-renders its caller on every navigation. `useElementWidth` reports resizes as a transition, so a sliding sidebar doesn't re-render every measured consumer in each frame. During an edge drag, `body[data-sidebar-dragging]` turns both edge transitions off.
- Layout that depends on an animated width, such as an expanding panel, reads the measured element width, not the expand flag, because the flag flips before the animation finishes (see `InsightPanelSections.tsx`).
- To make one element give way before its sibling, prefer CSS to any threshold: `flexShrink: 100000` with `minWidth: 0` on the less important sibling (see `ApplicationDetailsIdentity.tsx`).
- When a threshold is unavoidable, derive it from the measured content need, not from a constant borrowed from another component.
- A `SettingsCard` `headerAction` never shrinks beside the title: on a narrow card it wraps under it (the title keeps `CARD_TITLE_MIN_WIDTH_PX`), so variable-length text still goes in the card body.
- List pages share one toolbar position, measured from Plans and Insights: a `LIST_PAGE.SUBHEADER_ROW_HEIGHT_PX` row sits between the page header and the toolbar (tabs, the Applications discovery status, or `PageLayout`'s empty slot). A page that adds or drops that row moves its toolbar; re-measure live against Plans after such a change.
- Avoid layout shift: widths shouldn't depend on content that changes between pages or loads (ellipsize instead); render nothing rather than a placeholder that later widens (as `ListToolbar` does before the first count); and render optional flex children conditionally, because a zero-width child still takes a `gap`.

## Logging

- Log through the project logger (`import logger from '<relative path>/logging'`, then `logger.debug`, `info`, `warn` or `error`), not `console.*`. `no-console` is an error everywhere except `src/logging/**` and `k6/**`; keep it that way. The logger applies levels, environment gating and persistence that console calls bypass.
- Log messages are constants like any other string.
- To see debug output in the browser, run `localStorage.setItem('loglevel', 'debug')` and reload, or change `DEFAULT_LOG_LEVELS.DEVELOPMENT` in `src/logging/levels.ts`.
- For sub-second glitches a screenshot can't catch, add temporary `logger.debug` calls with `performance.now()` at the suspected mount points, reproduce, read the log, and remove the calls before finishing.

## Verification & done criteria

- After every change set, run `npm run check-all` (`tsc --noEmit`, then `eslint .`) and fix every error. Before handing off, run `npm run check-all-and-build`, which adds the build and is what CI (`.github/workflows/ci.yaml`, on every pull request) and the telark build pipeline run on this repo, through telark's shared `ui-gate` action. The `verify-ui-change` skill has the details.
- Two toolchain shims stay until their plugins catch up. `tsc` is TypeScript 7 (`@typescript/native` in `package.json`), while `typescript` is the TS 6 compatibility package, because typescript-eslint can't load TS 7 yet. The `overrides` entry lets eslint-plugin-react 7.37 run on ESLint 10, and `eslint.config.mjs` pins its React version because `'detect'` uses an API ESLint 10 removed. When those plugins support the new majors, go back to a plain `typescript` and `'detect'` and drop the override.
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
