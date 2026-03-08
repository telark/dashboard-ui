import { useEffect, useRef } from 'react';
import { initializeBuiltInCategories } from '../utils';
import { CATEGORIES_CONSTANTS } from '../constants';
import logger from '../../../../logging';

export const useInitializeCategories = (isAuthenticated: boolean): void => {
  const initializedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const initializeCategoriesForScope = async (scope: string) => {
      if (initializedRef.current.has(scope)) {
        return;
      }

      try {
        await initializeBuiltInCategories(scope);
        initializedRef.current.add(scope);
      } catch (error) {
        logger.error(`Failed to initialize categories for scope: ${scope}`, error);
      }
    };

    const initializeAllScopes = async () => {
      const scopes = [CATEGORIES_CONSTANTS.SCOPES.GROUPS, CATEGORIES_CONSTANTS.SCOPES.ROLES];
      await Promise.allSettled(scopes.map((scope) => initializeCategoriesForScope(scope)));
    };

    initializeAllScopes();
  }, [isAuthenticated]);
};
