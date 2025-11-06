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
        warnAfter: 128,
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
