import { configureStore } from '@reduxjs/toolkit';
import grouperReducer from './groupers/slices/grouperSlice';
import insightsReducer from './insights/slices/insightsSlice';
import workloadReducer from './workloads/slices/workloadSlice';

const store = configureStore({
  reducer: {
    grouper: grouperReducer,
    insights: insightsReducer,
    workload: workloadReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
