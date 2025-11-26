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
