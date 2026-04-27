import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { applicationsReducer } from '../features/resources/applications/store';
import { globalConfigReducer } from '../features/globalconfig/store';
import { groupReducer as groupsReducer } from '../features/access-and-permissions/groups/store';
import { userReducer as usersReducer } from '../features/access-and-permissions/users/store';
import { categoryReducer as categoriesReducer } from '../features/access-and-permissions/categories/store';
import { roleReducer as rolesReducer } from '../features/access-and-permissions/roles/store';
import { passkeyReducer, permissionsReducer } from '../features/auth/store';
import { retryReducer } from '../features/shared/retry';
import {
  applicationsPersistConfig,
  retryPersistConfig,
  groupsPersistConfig,
  usersPersistConfig,
  globalConfigPersistConfig,
} from './persistConfig';

const persistedApplicationsReducer = persistReducer(applicationsPersistConfig, applicationsReducer);
const persistedRetryReducer = persistReducer(retryPersistConfig, retryReducer);
const persistedGroupsReducer = persistReducer(groupsPersistConfig, groupsReducer);
const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);
const persistedGlobalConfigReducer = persistReducer(globalConfigPersistConfig, globalConfigReducer);

const store = configureStore({
  reducer: {
    applications: persistedApplicationsReducer,
    retry: persistedRetryReducer,
    globalconfig: persistedGlobalConfigReducer,
    groups: persistedGroupsReducer,
    users: persistedUsersReducer,
    categories: categoriesReducer,
    roles: rolesReducer,
    passkeys: passkeyReducer,
    permissions: permissionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
        warnAfter: 128, // default: 32ms
      },
      immutableCheck: {
        warnAfter: 128, // default: 32ms
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
export default store;
