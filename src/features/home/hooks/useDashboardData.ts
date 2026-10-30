import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import {
  loadApplications,
  loadApplicationsSilent,
} from '../../applications/utils/management/state';
import { getSnapshotInfos } from '../../applications/clients';
import type { SnapshotStorageInfos } from '../../applications/models';
import { fetchReportStorage } from '../../plans/protection/clients';
import type { ReportStorageInfos } from '../../plans/protection/models';
import { fetchProtectionPlansThunk } from '../../plans/protection/store';
import { POLL_INTERVAL_MS } from '../../../constants';
import type { DashboardAccess, StorageState } from '../models';

const NO_STORAGE = { infos: null, failed: false };

// A failed refresh keeps the last data; only a first load that fails shows the failure.
const loadStorage = <T>(
  fetch: () => Promise<T | null>,
  set: Dispatch<SetStateAction<StorageState<T>>>,
) =>
  fetch().then(
    (infos) => set({ infos, failed: false }),
    () => set((prev) => ({ ...prev, failed: prev.infos === null })),
  );

// Fetches only what the caller may read, then refreshes it in the background.
export const useDashboardData = ({
  canViewApplications,
  canViewPlans,
  canViewSnapshots,
  canViewReports,
}: DashboardAccess) => {
  const dispatch: AppDispatch = useDispatch();
  const [snapshots, setSnapshots] = useState<StorageState<SnapshotStorageInfos>>(NO_STORAGE);
  const [reports, setReports] = useState<StorageState<ReportStorageInfos>>(NO_STORAGE);

  useEffect(() => {
    const refresh = (silent: boolean) => {
      if (canViewApplications) {
        void (silent ? loadApplicationsSilent : loadApplications)(dispatch);
      }
      if (canViewPlans) {
        void dispatch(fetchProtectionPlansThunk());
      }
      if (canViewSnapshots) void loadStorage(getSnapshotInfos, setSnapshots);
      if (canViewReports) void loadStorage(fetchReportStorage, setReports);
    };

    refresh(false);
    const interval = setInterval(() => {
      if (!document.hidden) refresh(true);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [dispatch, canViewApplications, canViewPlans, canViewSnapshots, canViewReports]);

  return { snapshots, reports };
};
