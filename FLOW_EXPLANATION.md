# Complete Flow Explanation: Groupers vs Apps Workloads

## 1. INITIAL SYNC (handleInitialSync)

### Groupers Flow:
```
Page Load → handleLoadGroupers() → handleInitialSync()
  ├─ Checks localStorage: 'last_groupers_sync_ts'
  ├─ If last sync > 5 minutes ago (or never):
  │  └─ Calls triggerGroupersSyncThunk()
  │     └─ POST /resources/groupers/sync (syncs ALL groupers on server)
  └─ Saves timestamp to localStorage
```

### Apps Flow:
```
Page Load → handleLoadWorkloads() → handleInitialSync()
  ├─ Checks localStorage: 'last_workloads_sync_ts'
  ├─ If last sync > 5 minutes ago (or never):
  │  └─ Calls triggerAppsSyncThunk()
  │     └─ POST /resources/workloads/apps/sync (syncs ALL apps on server)
  └─ Saves timestamp to localStorage
```

**When:** Once on page mount (if throttle allows)
**Purpose:** Trigger server-side sync for all resources

---

## 2. INITIAL FETCH (loadGroupers / loadWorkloads)

### Groupers Flow:
```
Page Load → loadGroupers()
  └─ fetchAllGroupersThunk()
     └─ GET /resources/groupers/get
        └─ Returns ALL groupers (auto + manual)
           └─ Then checks maintenance mode for each grouper that has it
```

### Apps Flow:
```
Page Load → loadWorkloads()
  └─ fetchAllAppsWorkloadsThunk()
     └─ GET /resources/workloads/apps/get
        └─ Returns ALL apps
```

**When:** Once on page mount
**Purpose:** Load initial data to display
**Fetch:** ALL resources (not filtered)

---

## 3. AUTO REFRESH (setupAutoRefresh)

### Groupers Flow:
```
setupAutoRefresh() runs every 30 seconds (aligned to interval boundaries)
  └─ refreshAutoGroupersThunk()
     └─ GET /resources/groupers/get
        └─ Server filters to auto-sync only (per comment in code)
           └─ Reducer filters response to only auto-sync ones
              └─ Merges: auto ones updated, manual ones preserved
```

### Apps Flow (CURRENT - ISSUE):
```
setupAutoRefresh() runs every 30 seconds (aligned to interval boundaries)
  └─ fetchAllAppsWorkloadsThunk()
     └─ GET /resources/workloads/apps/get
        └─ Returns ALL apps (not filtered!)
```

**When:** Every 30 seconds (GROUPERS_REFRESH_INTERVAL_MS / WORKLOADS_REFRESH_INTERVAL_MS)
**Purpose:** Refresh data for auto-sync resources
**ISSUE:** Apps fetch ALL apps, not just auto-sync ones!

---

## Key Differences:

1. **Groupers have `refreshAutoGroupersThunk`** which:
   - Fetches from server (which filters to auto-only)
   - Reducer also filters to only auto-sync groupers
   - Preserves manual-sync groupers in state

2. **Apps DON'T have `refreshAutoAppsThunk`**:
   - Uses `fetchAllAppsWorkloadsThunk` which fetches ALL apps
   - No filtering for auto-sync only
   - Inconsistent with grouper pattern!

---

## Summary Table:

| Step | Groupers | Apps | Issue? |
|------|----------|------|--------|
| **Initial Sync** | ✅ triggerGroupersSyncThunk | ✅ triggerAppsSyncThunk | None |
| **Initial Fetch** | ✅ fetchAllGroupersThunk (all) | ✅ fetchAllAppsWorkloadsThunk (all) | None |
| **Auto Refresh** | ✅ refreshAutoGroupersThunk (auto only) | ❌ fetchAllAppsWorkloadsThunk (all) | **YES** |

---

## Recommendation:

Apps should have `refreshAutoAppsThunk` similar to groupers, OR the server endpoint should filter to auto-sync apps only when called during refresh.

