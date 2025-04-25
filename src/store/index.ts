import { configureStore } from '@reduxjs/toolkit';
import grouperReducer from './slices/grouperSlice';

const store = configureStore({
  reducer: {
    grouper: grouperReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
