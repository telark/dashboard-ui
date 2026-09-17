import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { applicationsReducer } from '../features/resources/applications/store';
import { protectionPlansReducer } from '../features/plans/protection/store';
import { globalConfigReducer } from '../features/globalconfig/store';
import { groupReducer as groupsReducer } from '../features/access-and-permissions/groups/store';
import { userReducer as usersReducer } from '../features/access-and-permissions/users/store';
import { categoryReducer as categoriesReducer } from '../features/access-and-permissions/categories/store';
import { roleReducer as rolesReducer } from '../features/access-and-permissions/roles/store';
import { authConfigReducer, passkeyReducer, permissionsReducer } from '../features/auth/store';
import { notificationsReducer } from '../features/notifications/store';
import { retryReducer } from '../features/shared/retry';
import { apiHealthReducer } from '../api/store';
import {
  applicationsPersistConfig,
  retryPersistConfig,
  groupsPersistConfig,
  usersPersistConfig,
  rolesPersistConfig,
  protectionPlansPersistConfig,
  globalConfigPersistConfig,
} from './persistConfig';

const persistedApplicationsReducer = persistReducer(applicationsPersistConfig, applicationsReducer);
const persistedRetryReducer = persistReducer(retryPersistConfig, retryReducer);
const persistedGroupsReducer = persistReducer(groupsPersistConfig, groupsReducer);
const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);
const persistedRolesReducer = persistReducer(rolesPersistConfig, rolesReducer);
const persistedProtectionPlansReducer = persistReducer(
  protectionPlansPersistConfig,
  protectionPlansReducer,
);
const persistedGlobalConfigReducer = persistReducer(globalConfigPersistConfig, globalConfigReducer);

const store = configureStore({
  reducer: {
    applications: persistedApplicationsReducer,
    retry: persistedRetryReducer,
    globalconfig: persistedGlobalConfigReducer,
    groups: persistedGroupsReducer,
    users: persistedUsersReducer,
    categories: categoriesReducer,
    roles: persistedRolesReducer,
    passkeys: passkeyReducer,
    permissions: permissionsReducer,
    authConfig: authConfigReducer,
    notifications: notificationsReducer,
    protectionPlans: persistedProtectionPlansReducer,
    apiHealth: apiHealthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // Dev-only invariant checks walk the whole store per action; with a few
    // applications of history they stall the main thread for 100–300ms each.
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
export default store;
