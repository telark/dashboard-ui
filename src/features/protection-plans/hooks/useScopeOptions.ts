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

  useEffect(() => {
    void dispatch(fetchAllGroupersThunk());
    void dispatch(fetchAllAppsWorkloadsThunk());
    void dispatch(fetchAllBridgesThunk());
  }, [dispatch]);

  const namespaceOptions = useMemo<ScopeOption[]>(() => {
    return groupers.map((g) => ({ value: g.name, label: g.name }));
  }, [groupers]);

  const loading = grouperLoading || workloadLoading || bridgeLoading;

  return {
    namespaceOptions,
    workloadOptions,
    resourceOptions,
    excludedOptions,
    loading,
  };
};
