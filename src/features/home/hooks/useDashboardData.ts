import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import {
  loadApplications,
  loadApplicationsSilent,
} from '../../applications/utils/management/state';
import { getSnapshotInfos } from '../../applications/clients';
import { fetchProtectionPlansThunk } from '../../plans/protection/store';
import { POLL_INTERVAL_MS } from '../../../constants';
import type { DashboardAccess, SnapshotStorageState } from '../models';

// Fetches only what the caller may read, then refreshes it in the background.
export const useDashboardData = ({
  canViewApplications,
  canViewPlans,
  canViewSnapshots,
}: DashboardAccess): SnapshotStorageState => {
  const dispatch: AppDispatch = useDispatch();
  const [storage, setStorage] = useState<SnapshotStorageState>({ infos: null, failed: false });

  useEffect(() => {
    const refresh = (silent: boolean) => {
      if (canViewApplications) {
        void (silent ? loadApplicationsSilent : loadApplications)(dispatch);
      }
      if (canViewPlans) {
        void dispatch(fetchProtectionPlansThunk());
      }
      if (canViewSnapshots) {
        getSnapshotInfos().then(
          (infos) => setStorage({ infos, failed: false }),
          () => setStorage((prev) => ({ ...prev, failed: prev.infos === null })),
        );
      }
    };

    refresh(false);
    const interval = setInterval(() => {
      if (!document.hidden) refresh(true);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [dispatch, canViewApplications, canViewPlans, canViewSnapshots]);

  return storage;
};
