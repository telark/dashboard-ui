import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store';
import { fetchCategoriesByScopeThunk } from '../store';
import { CATEGORIES_CONSTANTS } from '../constants';

export const useCategories = (scope: string = CATEGORIES_CONSTANTS.SCOPES.GROUPS) => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categoriesByScope[scope] || [],
  );
  const loading = useSelector((state: RootState) => state.categories.loading);
  const error = useSelector((state: RootState) => state.categories.error);

  useEffect(() => {
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategoriesByScopeThunk(scope));
    }
  }, [dispatch, scope, categories.length, loading]);

  return {
    categories,
    loading,
    error,
  };
};
