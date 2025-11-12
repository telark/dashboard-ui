import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { GroupsState, Group } from '../../../interfaces/groups';

const initialState: GroupsState = {
  groups: [],
  details: null,
  loading: false,
  error: null,
};

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      const index = state.groups.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter((g) => g.id !== action.payload);
    },
    setGroupDetails: (state, action: PayloadAction<Group | null>) => {
      state.details = action.payload;
    },
    clearGroupDetails: (state) => {
      state.details = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  setGroupDetails,
  clearGroupDetails,
  setLoading,
  setError,
} = groupSlice.actions;
export default groupSlice.reducer;
