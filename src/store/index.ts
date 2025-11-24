import { configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import { grouperReducer } from '../features/resources/groupers/store';
import { workloadReducer } from '../features/resources/workloads/store';
import { bridgeReducer } from '../features/resources/bridges/store';
import insightsReducer from './insights/slices/insightsSlice';
import groupsReducer from './groups/slices/groupSlice';
import { userReducer as usersReducer } from '../features/access-and-permissions/users/store';
import { passkeyReducer } from '../features/auth/store';
import {
  grouperPersistConfig,
  insightsPersistConfig,
  workloadPersistConfig,
  bridgePersistConfig,
  groupsPersistConfig,
  usersPersistConfig,
} from './persistence/persistConfig';

const persistedGrouperReducer = persistReducer(grouperPersistConfig, grouperReducer);
const persistedInsightsReducer = persistReducer(insightsPersistConfig, insightsReducer);
const persistedWorkloadReducer = persistReducer(workloadPersistConfig, workloadReducer);
const persistedBridgeReducer = persistReducer(bridgePersistConfig, bridgeReducer);
const persistedGroupsReducer = persistReducer(groupsPersistConfig, groupsReducer);
const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);

const store = configureStore({
  reducer: {
    grouper: persistedGrouperReducer,
    insights: persistedInsightsReducer,
    workload: persistedWorkloadReducer,
    bridge: persistedBridgeReducer,
    groups: persistedGroupsReducer,
    users: persistedUsersReducer,
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
