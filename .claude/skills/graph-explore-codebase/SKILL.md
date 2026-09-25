---
name: graph-explore-codebase
description: Use to understand how dashboard-ui is structured (where a feature lives, what a module depends on, how data flows) when the code-review-graph MCP server is available and has this repo indexed.
---

# Explore the codebase with the graph

Goal: an accurate picture of the area you need (its modules, key functions, who calls what, and the execution paths through it) without reading whole directories. Start broad, then narrow to specific nodes.

This needs the code-review-graph MCP server connected, with `list_graph_stats` showing this repo; otherwise use normal search. Some server versions add a `_tool` suffix to the names below.

| Question | Tool |
|---|---|
| Cheap overview of the task area, with suggested next tools | `get_minimal_context(task="…")` |
| Size and freshness of the graph | `list_graph_stats` |
| High-level structure | `get_architecture_overview`, `list_communities`, then `get_community` |
| Find a function, component or file by name or keyword | `semantic_search_nodes` |
| Relationships | `query_graph` with `callers_of`, `callees_of`, `imports_of`, `importers_of`, or `children_of` on a file to list what it contains |
| Execution paths | `list_flows`, `get_flow` |
| Complex code worth understanding first | `find_large_functions` |

Where a tool accepts `detail_level`, try `"minimal"` first and switch to `"standard"` when the compact answer isn't enough.
