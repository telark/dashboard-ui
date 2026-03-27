import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { grouperReducer } from '../features/resources/groupers/store';
import { workloadReducer } from '../features/resources/workloads/store';
import { bridgeReducer } from '../features/resources/bridges/store';
import { applicationsReducer } from '../features/resources/applications/store';
import { insightsReducer } from '../features/insights/store';
import { groupReducer as groupsReducer } from '../features/access-and-permissions/groups/store';
import { userReducer as usersReducer } from '../features/access-and-permissions/users/store';
import { categoryReducer as categoriesReducer } from '../features/access-and-permissions/categories/store';
import { roleReducer as rolesReducer } from '../features/access-and-permissions/roles/store';
import { passkeyReducer } from '../features/auth/store';
import {
  grouperPersistConfig,
  insightsPersistConfig,
  workloadPersistConfig,
  bridgePersistConfig,
  applicationsPersistConfig,
  groupsPersistConfig,
  usersPersistConfig,
} from './persistConfig';

const persistedGrouperReducer = persistReducer(grouperPersistConfig, grouperReducer);
const persistedInsightsReducer = persistReducer(insightsPersistConfig, insightsReducer);
const persistedWorkloadReducer = persistReducer(workloadPersistConfig, workloadReducer);
const persistedBridgeReducer = persistReducer(bridgePersistConfig, bridgeReducer);
const persistedApplicationsReducer = persistReducer(applicationsPersistConfig, applicationsReducer);
const persistedGroupsReducer = persistReducer(groupsPersistConfig, groupsReducer);
const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);

const store = configureStore({
  reducer: {
    grouper: persistedGrouperReducer,
    insights: persistedInsightsReducer,
    workload: persistedWorkloadReducer,
    bridge: persistedBridgeReducer,
    applications: persistedApplicationsReducer,
    groups: persistedGroupsReducer,
    users: persistedUsersReducer,
    categories: categoriesReducer,
    roles: rolesReducer,
    passkeys: passkeyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
        warnAfter: 128, // default: 32ms
      },
      immutableCheck: {
        // Increase threshold since we have large state objects
        warnAfter: 128, // default: 32ms
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export { store };
export default store;
