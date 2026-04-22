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
  const index: Record<string, { level: PermissionLevel; rules: string[] }> = {};

  // Sort by priority descending so highest-priority role is processed first
  const sorted = [...roles].sort((a, b) => b.priority - a.priority);

  for (const role of sorted) {
    if (role.isExpired) continue;
    for (const sp of role.scopes) {
      const existing = index[sp.scope];
      if (!existing || PERMISSION_LEVEL_RANK[sp.level] > PERMISSION_LEVEL_RANK[existing.level]) {
        index[sp.scope] = {
          level: sp.level,
          rules: sp.rules ?? [],
        };
      }
    }
  }

  return index;
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
