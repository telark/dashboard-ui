---
name: graph-debug-issue
description: Use when tracing a dashboard-ui bug through call chains, execution paths and recent changes, when the code-review-graph MCP server is available and has this repo indexed.
---

# Debug an issue with the graph

Goal: locate the code that produces the symptom and the entry point that triggers it, with context from both its callers and its callees, and establish whether a recent change caused it (recent changes are the most common source of new issues).

This needs the code-review-graph MCP server connected, with `list_graph_stats` showing this repo; otherwise use normal search. Some server versions add a `_tool` suffix to the names below.

| Need | Tool |
|---|---|
| Cheap starting context for the bug | `get_minimal_context(task="…")` |
| Code related to the symptom | `semantic_search_nodes` |
| The call chain in both directions | `query_graph` with `callers_of` and `callees_of` |
| The full path through the suspect area, and its entry point | `get_flow`, `get_affected_flows` |
| Whether recent changes touch it | `detect_changes` (set `base` to the last known-good ref) |
| What else the suspect code affects | `get_impact_radius` |

Where a tool accepts `detail_level`, try `"minimal"` first and switch to `"standard"` when the compact answer isn't enough.
