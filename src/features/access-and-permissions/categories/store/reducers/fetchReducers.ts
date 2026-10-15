import { PayloadAction } from '@reduxjs/toolkit';
import type { CategoriesState, Category } from '../../models';

export const handleFetchCategoriesByScopePending = (state: CategoriesState) => {
  state.loading = true;
  state.error = null;
};

export const handleFetchCategoriesByScopeFulfilled = (
  state: CategoriesState,
  action: PayloadAction<{ scope: string; categories: Category[] }>,
) => {
  state.loading = false;
  const { scope, categories } = action.payload;
  // Every panel mount revalidates: an unchanged list keeps its array, so the lists built on it
  // (a page's columns) don't re-render while the panel opens.
  if (JSON.stringify(state.categoriesByScope[scope]) !== JSON.stringify(categories)) {
    state.categoriesByScope[scope] = categories;
  }
  state.error = null;
};

export const handleFetchCategoriesByScopeRejected = (
  state: CategoriesState,
  action: PayloadAction<unknown>,
) => {
  state.loading = false;
  state.error = action.payload as string;
};
