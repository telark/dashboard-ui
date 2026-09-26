import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchCategoriesByScopeThunk } from '../store';
import { CATEGORIES_CONSTANTS } from '../constants';
import {
  selectCategoriesByScope,
  selectCategoriesState,
} from '../store/selectors/categorySelectors';

const revalidatingScopes = new Set<string>();

export const useCategories = (scope: string = CATEGORIES_CONSTANTS.SCOPES.GROUPS) => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => selectCategoriesByScope(state, scope));
  const loading = useSelector((state: RootState) => selectCategoriesState(state).loading);
  const error = useSelector((state: RootState) => selectCategoriesState(state).error);

  // Persisted categories go stale when others add or delete them: show them, then revalidate
  // once per mount, sharing one request per scope between the consumers mounting together.
  useEffect(() => {
    if (revalidatingScopes.has(scope)) return;
    revalidatingScopes.add(scope);
    void dispatch(fetchCategoriesByScopeThunk(scope)).finally(() =>
      revalidatingScopes.delete(scope),
    );
  }, [dispatch, scope]);

  return {
    categories,
    loading,
    error,
  };
};
