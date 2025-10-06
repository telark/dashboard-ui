import { configureStore } from '@reduxjs/toolkit';
import grouperReducer from './slices/grouperSlice';
import insightsReducer from './slices/insightsSlice';

const store = configureStore({
  reducer: {
    grouper: grouperReducer,
    insights: insightsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
