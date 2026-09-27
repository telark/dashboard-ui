---
name: graph-refactor-safely
description: Use when planning or executing a dashboard-ui refactor such as renaming a symbol, removing dead code or moving functions between modules, when the code-review-graph MCP server is available and has this repo indexed.
---

# Refactor safely with the graph

Goal: a refactor whose full reach is known before any file changes, and confirmed afterwards.

This needs the code-review-graph MCP server connected, with `list_graph_stats` showing this repo; otherwise use normal search and your editor's rename. Some server versions add a `_tool` suffix to the names below.

Work in this order, because the preview is what makes the apply safe:

1. Find targets if you don't have them: `refactor_tool` with `mode="suggest"` (community-based suggestions such as misplaced functions), `mode="dead_code"` (unreferenced functions and classes), and `find_large_functions` (decomposition candidates). Remove only dead code your change orphaned or that the user asked to remove (AGENTS.md → Surgical changes).
2. Before a major refactor, check `get_impact_radius` for its reach and `get_affected_flows` for the execution paths that must keep working.
3. Preview renames: `refactor_tool` with `mode="rename"`, `old_name` and `new_name` returns an edit list and a `refactor_id`. Review the edit list, or call `apply_refactor_tool` with `dry_run=true` for a diff.
4. Apply with `apply_refactor_tool` and the `refactor_id`. Previews expire after 10 minutes, so preview again if yours has lapsed.
5. Confirm with `detect_changes` that the impact matches the preview, then run `npm run check-all`.
