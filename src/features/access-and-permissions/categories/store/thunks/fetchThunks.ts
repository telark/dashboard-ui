import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategoriesByScope } from '../../clients';
import { extractErrorMessage } from '../../../../../utils/helpers/format';
import { STORE_ACTIONS, STORE_ERRORS, STORE_MESSAGES } from '../../../../../constants/store/store';
import logger from '../../../../../logging';
import type { Category } from '../../models';
import type { CategoryListResponse } from '../../models';

const mapCategoriesData = (response: CategoryListResponse): Category[] => {
  return response.data?.items || [];
};

export const fetchCategoriesByScopeThunk = createAsyncThunk(
  STORE_ACTIONS.CATEGORIES.FETCH_BY_SCOPE,
  async (scope: string, { rejectWithValue }) => {
    try {
      const response = await fetchCategoriesByScope(scope);
      return { scope, categories: mapCategoriesData(response) };
    } catch (error: unknown) {
      logger.error(STORE_MESSAGES.ERROR_FETCHING_CATEGORIES, error);
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_CATEGORIES));
    }
  },
);

export const fetchCategoriesByScopeSilentThunk = createAsyncThunk(
  STORE_ACTIONS.CATEGORIES.FETCH_BY_SCOPE_SILENT,
  async (scope: string, { rejectWithValue }) => {
    try {
      const response = await fetchCategoriesByScope(scope, true);
      return { scope, categories: mapCategoriesData(response) };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error, STORE_ERRORS.FETCH_CATEGORIES));
    }
  },
);
