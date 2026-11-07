import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemePreference } from './constants';
import { readUserThemePreference } from './utils';

interface ThemeState {
  preference: ThemePreference;
}

const initialState: ThemeState = { preference: readUserThemePreference() };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemePreference: (state, action: PayloadAction<ThemePreference>) => {
      state.preference = action.payload;
    },
  },
});

export const { setThemePreference } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

export const selectThemePreference = (state: { theme: ThemeState }): ThemePreference =>
  state.theme.preference;
