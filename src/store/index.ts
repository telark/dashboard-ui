import { configureStore } from '@reduxjs/toolkit';
import grouperReducer from './groupers/slices/grouperSlice';
import insightsReducer from './insights/slices/insightsSlice';
import workloadReducer from './workloads/slices/workloadSlice';
import bridgeReducer from './bridges/slices/bridgeSlice';

const store = configureStore({
  reducer: {
    grouper: grouperReducer,
    insights: insightsReducer,
    workload: workloadReducer,
    bridge: bridgeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Increase warning threshold from 32ms to 128ms
        // This is still fast enough to catch real issues but won't warn on large valid state
        warnAfter: 128,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
