import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchCategoriesByScopeThunk } from '../store';
import { CATEGORIES_CONSTANTS } from '../constants';
import {
  selectCategoriesByScope,
  selectCategoriesState,
} from '../store/selectors/categorySelectors';

export const useCategories = (scope: string = CATEGORIES_CONSTANTS.SCOPES.GROUPS) => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => selectCategoriesByScope(state, scope));
  const loading = useSelector((state: RootState) => selectCategoriesState(state).loading);
  const error = useSelector((state: RootState) => selectCategoriesState(state).error);
  const loaded = useSelector((state: RootState) => scope in state.categories.categoriesByScope);

  useEffect(() => {
    if (!loaded) dispatch(fetchCategoriesByScopeThunk(scope));
  }, [dispatch, scope, loaded]);

  return {
    categories,
    loading,
    error,
  };
};
