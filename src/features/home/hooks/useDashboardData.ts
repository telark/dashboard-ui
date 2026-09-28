import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import {
  loadApplications,
  loadApplicationsSilent,
} from '../../applications/utils/management/state';
import { getSnapshotInfos } from '../../applications/clients';
import { fetchProtectionPlansThunk } from '../../plans/protection/store';
import { HOME_DASHBOARD_POLLING } from '../constants/dashboard';
import type { DashboardAccess, SnapshotStorageState } from '../models';

// Fetches only what the caller may read, then refreshes on the platform's fetch interval.
export const useDashboardData = ({
  canViewApplications,
  canViewPlans,
  canViewSnapshots,
}: DashboardAccess): SnapshotStorageState => {
  const dispatch: AppDispatch = useDispatch();
  const fetchIntervalSeconds = useSelector((s: RootState) =>
    Number(
      s.globalconfig.data?.userSettings?.fetchIntervalSeconds ??
        HOME_DASHBOARD_POLLING.DEFAULT_INTERVAL_SEC,
    ),
  );
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
    const intervalSec = Number.isFinite(fetchIntervalSeconds)
      ? fetchIntervalSeconds
      : HOME_DASHBOARD_POLLING.DEFAULT_INTERVAL_SEC;
    const interval = setInterval(
      () => {
        if (!document.hidden) refresh(true);
      },
      Math.max(HOME_DASHBOARD_POLLING.MIN_INTERVAL_SEC, intervalSec) * 1000,
    );
    return () => clearInterval(interval);
  }, [dispatch, fetchIntervalSeconds, canViewApplications, canViewPlans, canViewSnapshots]);

  return storage;
};
