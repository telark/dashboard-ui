import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../../store';
import { CATEGORIES_CONSTANTS } from '../../constants';

export const selectCategoriesState = (state: RootState) => state.categories;

const EMPTY_CATEGORIES_ARRAY: never[] = [];

export const selectCategoriesByScope = createSelector(
  [selectCategoriesState, (_state: RootState, scope: string) => scope],
  (categoriesState, scope) => {
    const categories = categoriesState.categoriesByScope[scope];
    return categories || EMPTY_CATEGORIES_ARRAY;
  },
);

export const selectGroupsCategories = createSelector([selectCategoriesState], (categoriesState) => {
  return categoriesState.categoriesByScope[CATEGORIES_CONSTANTS.SCOPES.GROUPS] || EMPTY_CATEGORIES_ARRAY;
});
