import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import store from '../../../../store';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import { selectPermissionsState } from '../../store/selectors/permissionsSelectors';
import logger from '../../../../logging';

export const useInitializePermissions = (isAuthenticated: boolean): void => {
  const initializedRef = useRef(false);
  const permissions = useSelector(selectPermissionsState);

  useEffect(() => {
    if (!isAuthenticated || initializedRef.current || permissions.userID !== null) {
      return;
    }

    initializedRef.current = true;
    store.dispatch(fetchMyPermissionsThunk()).catch((err: unknown) => {
      logger.error('Failed to initialize permissions', err);
    });
  }, [isAuthenticated, permissions.userID]);
};
