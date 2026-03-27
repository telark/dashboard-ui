import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import { fetchAllGroupersThunk } from '../../resources/groupers/store';
import { fetchAllAppsWorkloadsThunk } from '../../resources/workloads/store';
import { fetchAllBridgesThunk } from '../../resources/bridges/store';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

export interface ScopeOption {
  value: string;
  label: string;
  namespace?: string;
}

interface UseScopeOptionsResult {
  namespaceOptions: ScopeOption[];
  workloadOptions: ScopeOption[];
  resourceOptions: ScopeOption[];
  excludedOptions: ScopeOption[];
  loading: boolean;
}

const APP_LABEL = PPC.CREATE_PAGE.FORM.SCOPE_RESOURCE_TYPE_APP;
const SERVICE_LABEL = PPC.CREATE_PAGE.FORM.SCOPE_RESOURCE_TYPE_SERVICE;

export const useScopeOptions = (): UseScopeOptionsResult => {
  const dispatch = useDispatch<AppDispatch>();

  const groupers = useSelector((state: RootState) => state.grouper.groupers ?? []);
  const apps = useSelector((state: RootState) => state.workload.apps ?? []);
  const bridges = useSelector((state: RootState) => state.bridge.bridges ?? []);

  const grouperLoading = useSelector((state: RootState) => state.grouper.loading);
  const workloadLoading = useSelector((state: RootState) => state.workload.appLoading);
  const bridgeLoading = useSelector((state: RootState) => state.bridge.loading);

  useEffect(() => {
    void dispatch(fetchAllGroupersThunk());
    void dispatch(fetchAllAppsWorkloadsThunk());
    void dispatch(fetchAllBridgesThunk());
  }, [dispatch]);

  const namespaceOptions = useMemo<ScopeOption[]>(() => {
    return groupers.map((g) => ({ value: g.name, label: g.name }));
  }, [groupers]);

  const workloadOptions = useMemo<ScopeOption[]>(() => {
    return apps.map((a) => ({
      value: `workload:${a.grouper}:${a.name}`,
      label: `${APP_LABEL} — ${a.name}`,
      namespace: a.grouper,
    }));
  }, [apps]);

  const resourceOptions = useMemo<ScopeOption[]>(() => {
    return bridges.map((b) => ({
      value: `bridge:${b.grouper}:${b.name}`,
      label: `${SERVICE_LABEL} — ${b.name}`,
      namespace: b.grouper,
    }));
  }, [bridges]);

  const excludedOptions = useMemo<ScopeOption[]>(() => {
    return [...workloadOptions, ...resourceOptions];
  }, [workloadOptions, resourceOptions]);

  const loading = grouperLoading || workloadLoading || bridgeLoading;

  return {
    namespaceOptions,
    workloadOptions,
    resourceOptions,
    excludedOptions,
    loading,
  };
};
