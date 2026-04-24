import { createSlice } from '@reduxjs/toolkit';
import type { PermissionsState, PermissionLevel, ResolvedRole } from '../../models/permissions';
import { PERMISSION_LEVEL_RANK } from '../../models/permissions';
import { fetchMyPermissionsThunk } from '../thunks/fetchThunks';
import { SCOPE_RULES } from '../../../access-and-permissions/roles/constants/scopeRules';

const ALL_SCOPE_NAMES = SCOPE_RULES.map((s) => s.scope);

const initialState: PermissionsState = {
  userID: null,
  roles: [],
  scopeIndex: {},
  loading: false,
  error: null,
};

function buildScopeIndex(
  roles: ResolvedRole[],
): Record<string, { level: PermissionLevel; rules: string[] }> {
  const index: Record<string, { level: PermissionLevel; rules: string[]; priority: number }> = {};

  const tryWrite = (
    scopeName: string,
    level: PermissionLevel,
    rules: string[],
    priority: number,
  ) => {
    const existing = index[scopeName];
    if (!existing) {
      index[scopeName] = { level, rules, priority };
      return;
    }
    const incomingRank = PERMISSION_LEVEL_RANK[level];
    const existingRank = PERMISSION_LEVEL_RANK[existing.level];
    if (
      incomingRank > existingRank ||
      (incomingRank === existingRank && priority > existing.priority)
    ) {
      index[scopeName] = { level, rules, priority };
    }
  };

  for (const role of roles) {
    if (role.isExpired) continue;
    for (const sp of role.scopes) {
      if (sp.scope.toUpperCase() === 'ALL') {
        for (const scopeName of ALL_SCOPE_NAMES) {
          tryWrite(scopeName, sp.level, sp.rules ?? [], role.priority);
        }
      } else {
        tryWrite(sp.scope, sp.level, sp.rules ?? [], role.priority);
      }
    }
  }

  return Object.fromEntries(
    Object.entries(index).map(([scope, { level, rules }]) => [scope, { level, rules }]),
  );
}

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearPermissions(state) {
      state.userID = null;
      state.roles = [];
      state.scopeIndex = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPermissionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPermissionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userID = action.payload.userID;
        state.roles = action.payload.roles;
        state.scopeIndex = buildScopeIndex(action.payload.roles);
      })
      .addCase(fetchMyPermissionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPermissions } = permissionsSlice.actions;
export default permissionsSlice.reducer;
