---
name: list-and-table-pages
description: Use when building or changing a list page or table in dashboard-ui, including columns, sorting, grouping, filters, the list toolbar and its counts, row actions, pills or status chips.
---

# List and table pages

Goal: a list page that behaves like the existing ones, with client-side sorting and grouping, stable column widths and one fact per column. The rules are in AGENTS.md → Tables & lists; this skill points at the code to copy and the checks to run.

## Reference implementations

- Roles, the baseline: `src/features/access-and-permissions/roles/pages/RolesListPage.tsx`, with state in `roles/hooks/list/useRoleListState.ts`, page config in `roles/hooks/list/useRoleListPageConfig.tsx` and columns in `roles/components/display/list/Columns.tsx`.
- Pages render through `PageLayout` (`src/components/display/views`) from a `PageLayoutConfig` (`src/interfaces/layout/page.ts`). It draws `ListToolbar`, `DataTable` and `TablePagination`.
- Insights, for grouping, optional columns, triage and title ellipsis: `src/features/insights/components/ClusterInsightsView.tsx` and `InsightsTable.tsx`.

## How the pieces fit

- Sorting and paging: load the filtered set once, then use `useSortState` and `sortData` from `src/utils/layout/sort`, with `generateColumn(cfg, { activeSortKey, onSort })` for the headers. `sortData` is stable, so pre-sorting by the default order keeps ties in a sensible order (as `InsightsTable` does). Grouping is also computed in the UI from the loaded rows (`groupKeyOf` in `ClusterInsightsView.tsx`).
- The title column's cell content gets `width: 0` and `min-width: max(100%, <floor>px)` alongside the one-line ellipsis styles, with the full text in `title` (`titleCellStyle` and `TitleCell` in `InsightsTable.tsx`).
- When the table runs out of room, drop the least important columns against the measured width rather than squeezing them (`fittingInsightColumns` in `InsightsTable.tsx`).
- Color maps for status cells (like `SEVERITY_COLORS` and `STATE_COLORS`) use `DEFAULT_COLORS` accents, so `getPillSurface` resolves them to pill shades; add `color: DEFAULT_COLORS.PILL_TEXT`.
- The toolbar count takes `countSuffix: { one, other }` with both strings in the feature's constants; `compactWidth` thresholds are compared against the toolbar row's measured width, so set them from measured need.
- Icon-only row actions: see `ApplicationSnapshotRow.tsx` and the triage buttons in `InsightDetailsPanel.tsx` (`type="text"`, `ROW_ICON_BUTTON_SIZE` square, muted color, `Tooltip` and `aria-label`).

## Before you finish, check

- No request sends sort or group params; header clicks only change client-side state.
- Each column holds one fact, and a second independent status has its own column.
- Long titles ellipsize and never change column widths, on every page of results.
- Counts read correctly for 1 and for many.
- User ids are shown as usernames (`useUsernamesByIds`).
- Rarely used or irreversible actions sit in the "More" overflow, and a mode's exit stays inline.
- `npm run check-all` passes; ask the user for a screenshot to confirm widths and wrapping.
