import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import store from '../../../store';
import { STORAGE_KEYS } from '../../../constants/store/store';
import { APP_ROUTES } from '../../../constants';
import { clearPermissions } from '../store/slices/permissionsSlice';
import { stopPermissionsPolling } from './permissions/useInitializePermissions';

// A logout in another tab removes the shared token; without this, this tab keeps showing data until its next poll.
export const useCrossTabLogout = (): void => {
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = (event: StorageEvent): void => {
      const tokenRemoved = event.key === null || event.key === STORAGE_KEYS.SESSION_TOKEN;
      if (!tokenRemoved || event.newValue !== null) return;
      stopPermissionsPolling();
      store.dispatch(clearPermissions());
      navigate(APP_ROUTES.LOGIN, { replace: true });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [navigate]);
};
