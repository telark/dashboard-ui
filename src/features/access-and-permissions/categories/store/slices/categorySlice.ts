import { createSlice } from '@reduxjs/toolkit';
import type { CategoriesState } from '../../models';
import {
  fetchCategoriesByScopeThunk,
  fetchCategoriesByScopeSilentThunk,
} from '../thunks/fetchThunks';
import {
  handleFetchCategoriesByScopePending,
  handleFetchCategoriesByScopeFulfilled,
  handleFetchCategoriesByScopeRejected,
} from '../reducers/fetchReducers';

const initialState: CategoriesState = {
  categoriesByScope: {},
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesByScopeThunk.pending, handleFetchCategoriesByScopePending)
      .addCase(fetchCategoriesByScopeThunk.fulfilled, handleFetchCategoriesByScopeFulfilled)
      .addCase(fetchCategoriesByScopeThunk.rejected, handleFetchCategoriesByScopeRejected)
      .addCase(fetchCategoriesByScopeSilentThunk.pending, handleFetchCategoriesByScopePending)
      .addCase(fetchCategoriesByScopeSilentThunk.fulfilled, handleFetchCategoriesByScopeFulfilled)
      .addCase(fetchCategoriesByScopeSilentThunk.rejected, handleFetchCategoriesByScopeRejected);
  },
});

export default categorySlice.reducer;
