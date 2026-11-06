import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import { fetchCategoriesByScopeThunk } from '../store';
import { CATEGORIES_CONSTANTS } from '../constants';
import {
  selectCategoriesByScope,
  selectCategoriesState,
} from '../store/selectors/categorySelectors';

const revalidations = new Map<string, Promise<unknown>>();
// Scopes fetched since the app loaded: until then a list page waits, not showing persisted rows.
const settledScopes = new Set<string>();

const revalidate = (dispatch: AppDispatch, scope: string): Promise<unknown> => {
  let revalidation = revalidations.get(scope);
  if (!revalidation) {
    revalidation = dispatch(fetchCategoriesByScopeThunk(scope)).finally(() => {
      revalidations.delete(scope);
      settledScopes.add(scope);
    });
    revalidations.set(scope, revalidation);
  }
  return revalidation;
};

export const useCategories = (scope: string = CATEGORIES_CONSTANTS.SCOPES.GROUPS) => {
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector((state: RootState) => selectCategoriesByScope(state, scope));
  const loading = useSelector((state: RootState) => selectCategoriesState(state).loading);
  const error = useSelector((state: RootState) => selectCategoriesState(state).error);
  const [settledScope, setSettledScope] = useState(() => (settledScopes.has(scope) ? scope : null));

  // Persisted categories go stale when others add or delete them: show them, then revalidate
  // once per mount, sharing one request per scope between the consumers mounting together.
  useEffect(() => {
    let canceled = false;
    revalidate(dispatch, scope).then(() => {
      if (!canceled) setSettledScope(scope);
    });
    return () => {
      canceled = true;
    };
  }, [dispatch, scope]);

  const refetch = useCallback((): void => {
    revalidate(dispatch, scope);
  }, [dispatch, scope]);

  return {
    categories,
    loading,
    // The scope's first fetch settled, failed ones too (the error shows instead).
    loaded: settledScope === scope || settledScopes.has(scope),
    error,
    refetch,
  };
};
