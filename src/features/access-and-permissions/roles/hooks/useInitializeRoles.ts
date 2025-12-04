import { useEffect, useRef } from 'react';
import { initializeBuiltInRoles } from '../utils';
import { ROLES_CONSTANTS } from '../constants';
import logger from '../../../../logging';

export const useInitializeRoles = (isAuthenticated: boolean): void => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || initializedRef.current) {
      return;
    }

    const initializeRoles = async () => {
      try {
        await initializeBuiltInRoles();
        initializedRef.current = true;
      } catch (error) {
        logger.error(ROLES_CONSTANTS.LOGS.INITIALIZATION_FAILED, error);
      }
    };

    initializeRoles();
  }, [isAuthenticated]);
};
