---
name: graph-review-changes
description: Use when reviewing a dashboard-ui diff, branch or PR for risk, blast radius and test coverage, when the code-review-graph MCP server is available and has this repo indexed.
---

# Review changes with the graph

Goal: a risk-ranked review of what changed, what it affects and how well it is covered, ending in a merge recommendation.

This needs the code-review-graph MCP server connected, with `list_graph_stats` showing this repo; otherwise review from the diff with normal search. Some server versions add a `_tool` suffix to the names below.

| Need | Tool |
|---|---|
| Cheap starting context for the review | `get_minimal_context(task="…")` |
| Risk-scored list of changed functions | `detect_changes` (set `base` to the ref you are reviewing against) |
| Source snippets for the risky parts | `get_review_context` |
| Execution paths the change touches | `get_affected_flows` |
| Blast radius | `get_impact_radius` |
| Tests covering a high-risk function | `query_graph` with `tests_for` |

The repo has no test runner or test files today, so coverage will mostly come back empty. For untested high-risk changes, suggest specific test cases.

Where a tool accepts `detail_level`, try `"minimal"` first and switch to `"standard"` when the compact answer isn't enough.

## Output

Group findings by risk (high, medium, low). For each: what changed and why it matters, its test coverage, and suggested improvements. Finish with an overall merge recommendation.
