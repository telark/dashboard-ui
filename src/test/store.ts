import type { UnknownAction } from '@reduxjs/toolkit';
import store, { rootReducer, type RootState } from '../store';
import { ALL_SCOPE_NAMES } from '../features/auth/store/slices/permissionsSlice';
import type { PermissionLevel } from '../features/auth/models/permissions';

/** Per-slice overrides on top of each slice's initial state. */
export type StoreSeed = { [K in keyof RootState]?: Partial<RootState[K]> };

const RESET_ACTION = 'test/resetStore';

interface ResetAction extends UnknownAction {
  payload: RootState;
}

const isReset = (action: UnknownAction): action is ResetAction => action.type === RESET_ACTION;

// The code under test imports the store singleton, so tests reuse it and swap its state.
store.replaceReducer(((state: RootState | undefined, action: UnknownAction) =>
  rootReducer(isReset(action) ? action.payload : state, action)) as typeof rootReducer);

const initialState = (): RootState => rootReducer(undefined, { type: 'test/init' });

const seededState = (seed: StoreSeed): RootState => {
  const state: Record<string, unknown> = { ...initialState() };
  for (const [slice, overrides] of Object.entries(seed)) {
    state[slice] = { ...(state[slice] as object), ...overrides };
  }
  return state as RootState;
};

export const resetStore = (seed: StoreSeed = {}): void => {
  store.dispatch({ type: RESET_ACTION, payload: seededState(seed) });
};

/** Permissions state for a user holding `level` on every scope, minus any `deny` rules. */
export const permissionsSeed = (
  level: PermissionLevel = 'Owner',
  deny: string[] = [],
): StoreSeed => ({
  permissions: {
    ready: true,
    userID: 'user-under-test',
    roles: [
      {
        roleID: 'role-under-test',
        roleName: 'release_lead',
        status: 'Active',
        priority: 1,
        isExpired: false,
        sources: [{ kind: 'direct' }],
        scopes: ALL_SCOPE_NAMES.map((scope) => ({ scope, level, rules: deny })),
      },
    ],
    scopeIndex: Object.fromEntries(ALL_SCOPE_NAMES.map((scope) => [scope, { level, rules: deny }])),
  },
});

export { store };
