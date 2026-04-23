import { createSlice } from '@reduxjs/toolkit';
import type { PermissionsState, PermissionLevel, ResolvedRole } from '../../models/permissions';
import { PERMISSION_LEVEL_RANK } from '../../models/permissions';
import { fetchMyPermissionsThunk } from '../thunks/fetchThunks';

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

  for (const role of roles) {
    if (role.isExpired) continue;
    for (const sp of role.scopes) {
      const existing = index[sp.scope];
      if (!existing) {
        index[sp.scope] = { level: sp.level, rules: sp.rules ?? [], priority: role.priority };
      } else {
        const incomingRank = PERMISSION_LEVEL_RANK[sp.level];
        const existingRank = PERMISSION_LEVEL_RANK[existing.level];
        if (
          incomingRank > existingRank ||
          (incomingRank === existingRank && role.priority > existing.priority)
        ) {
          index[sp.scope] = { level: sp.level, rules: sp.rules ?? [], priority: role.priority };
        }
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
