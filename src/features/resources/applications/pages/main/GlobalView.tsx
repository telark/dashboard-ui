import React, { memo, useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, message } from 'antd';
import type { RootState, AppDispatch } from '../../../../../store';
import { loadApplications, loadApplicationsSilent } from '../../utils/management/state';
import { createRetryHandler, cancelRetry, RetryCallbacks } from '../../../../../utils/shared/retry';
import { APPLICATIONS_CONSTANTS, APPLICATIONS_PAGE_SIZE, APPLICATIONS_UI } from '../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import LoadingView from '../../../../../components/display/views/LoadingView';
import ReachabilityErrorView from '../../../../../components/display/views/ReachabilityErrorView';
import ApplicationsMainEmpty from './Empty';
import ApplicationsSuccess from './Success';
import { filterApplications, useApplications } from '../../hooks';
import type { Application } from '../../models';
import { EditApplicationPanel } from '../../components/panels';
import { FilterPanel } from '../../../../../components/display/panels/filter';
import type { FilterField } from '../../../../../components/display/panels/filter/FilterPanel';
import type { DateRangeFilter } from '../../../../../interfaces/date/filter';
import { filterByDateRange } from '../../../../access-and-permissions/groups/utils/filter/dateRangeUtils';

const ApplicationsGlobalView: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const { applications, loading, error } = useSelector((s: RootState) => s.applications);
  const fetchIntervalSeconds = useSelector((s: RootState) =>
    s.globalconfig.data?.userSettings?.fetchIntervalSeconds != null
      ? Number(s.globalconfig.data.userSettings.fetchIntervalSeconds)
      : 60,
  );
  const excludedNamespaces = useSelector(
    (s: RootState) => s.globalconfig.data?.excludedNamespaces ?? [],
  );

  const visibleApplications = useMemo(
    () => filterByExcludedNamespaces(applications, excludedNamespaces),
    [applications, excludedNamespaces],
  );
  const hasTriggeredInitialLoad = useRef(false);

  const { searchValue, onSearchChange } = useApplications();
  const [editForm] = Form.useForm();
  const [editTarget, setEditTarget] = useState<Application | null>(null);

  const openEditPanel = useCallback(
    (app: Application) => {
      editForm.setFieldsValue({
        name: app.name,
        displayName: app.displayName,
        description: app.description ?? '',
      });
      setEditTarget(app);
    },
    [editForm],
  );

  const closeEditPanel = useCallback(() => {
    editForm.resetFields();
    setEditTarget(null);
  }, [editForm]);

  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, unknown>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const filterFields: FilterField[] = useMemo(() => {
    const statusOptions = uniqOptions(visibleApplications, (a) => a.health?.status);
    const managedByOptions = uniqOptions(visibleApplications, (a) => a.managed?.by);
    const managedChartOptions = uniqOptions(visibleApplications, (a) => a.managed?.chart || '');
    const namespaceOptions = uniqNamespaceOptions(visibleApplications);
    const insightCategoryOptions = uniqOptions(visibleApplications, (a) => a.insights?.category || '');
    const insightRoleOptions = uniqOptions(visibleApplications, (a) => a.insights?.role || '');
    const crStatusOptions = uniqOptions(visibleApplications, (a) => a.crStatus || '');
    return [
      {
        key: 'dateRange',
        label: APPLICATIONS_UI.FILTER.BY_CREATION_DATE,
        type: 'dateRange',
        fromLabel: APPLICATIONS_UI.FILTER.FROM,
        toLabel: APPLICATIONS_UI.FILTER.TO,
      },
      {
        key: 'status',
        label: APPLICATIONS_UI.FILTER.BY_STATUS,
        type: 'multiSelect',
        multiSelectOptions: statusOptions,
      },
      {
        key: 'managedBy',
        label: APPLICATIONS_UI.FILTER.BY_MANAGED_BY,
        type: 'multiSelect',
        multiSelectOptions: managedByOptions,
      },
      {
        key: 'managedChart',
        label: APPLICATIONS_UI.FILTER.BY_MANAGED_CHART,
        type: 'multiSelect',
        multiSelectOptions: managedChartOptions,
      },
      {
        key: 'namespaces',
        label: APPLICATIONS_UI.FILTER.BY_NAMESPACE,
        type: 'multiSelect',
        multiSelectOptions: namespaceOptions,
      },
      {
        key: 'insightCategory',
        label: APPLICATIONS_UI.FILTER.BY_INSIGHT_CATEGORY,
        type: 'multiSelect',
        multiSelectOptions: insightCategoryOptions,
      },
      {
        key: 'insightRole',
        label: APPLICATIONS_UI.FILTER.BY_INSIGHT_ROLE,
        type: 'multiSelect',
        multiSelectOptions: insightRoleOptions,
      },
      {
        key: 'crStatus',
        label: APPLICATIONS_UI.FILTER.BY_CR_STATUS,
        type: 'multiSelect',
        multiSelectOptions: crStatusOptions,
      },
      {
        key: 'hasDrift',
        label: APPLICATIONS_UI.FILTER.BY_HAS_DRIFT,
        type: 'multiSelect',
        multiSelectOptions: [
          { value: 'true', label: APPLICATIONS_UI.FILTER.OPTION_YES },
          { value: 'false', label: APPLICATIONS_UI.FILTER.OPTION_NO },
        ],
      },
    ];
  }, [visibleApplications]);

  const filteredApplications = useMemo(() => {
    const base = filterApplications(visibleApplications, searchValue);
    return applyApplicationFilters(base, appliedFilters);
  }, [visibleApplications, appliedFilters, searchValue]);

  const totalFiltered = filteredApplications.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / APPLICATIONS_PAGE_SIZE));
  const effectivePage = Math.min(currentPage, totalPages);
  const paginatedApplications = useMemo(() => {
    const start = (effectivePage - 1) * APPLICATIONS_PAGE_SIZE;
    return filteredApplications.slice(start, start + APPLICATIONS_PAGE_SIZE);
  }, [effectivePage, filteredApplications]);

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [nextRetryIn, setNextRetryIn] = useState(0);
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const timeoutRefs = useRef<{ current: ReturnType<typeof setTimeout> | null }[]>([]);

  const handleLoadApplications = useCallback(async () => {
    await loadApplications(dispatch);
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (hasTriggeredInitialLoad.current) return;
      hasTriggeredInitialLoad.current = true;
      await handleLoadApplications();
    })();
  }, [handleLoadApplications]);

  useEffect(() => {
    const intervalSec = Number.isFinite(fetchIntervalSeconds) ? fetchIntervalSeconds : 60;
    const intervalMs = Math.max(5, intervalSec) * 1000;
    const interval = setInterval(() => {
      void loadApplicationsSilent(dispatch);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [dispatch, fetchIntervalSeconds]);

  const retryCallbacks: RetryCallbacks = useMemo(
    () => ({
      setRetrying: setIsRetrying,
      setRetryCount: setRetryCount,
      setNextRetryIn: setNextRetryIn,
      setInCooldown: setIsInCooldown,
      setCooldownTime: setCooldownTime,
      onSuccess: () => message.success(APPLICATIONS_CONSTANTS.MESSAGES.SUCCESS),
      onError: () => message.error(CONNECTIVITY_CONSTANTS.MESSAGES.ERROR_RETRYING_COOLDOWN),
    }),
    [],
  );

  const handleRetry = useCallback(async () => {
    if (isRetrying || isInCooldown) return;
    const retryHandler = createRetryHandler(() => loadApplicationsSilent(dispatch), retryCallbacks);
    await retryHandler();
  }, [dispatch, isRetrying, isInCooldown, retryCallbacks]);

  const handleCancelRetry = useCallback(() => {
    cancelRetry(timeoutRefs.current, retryCallbacks);
  }, [retryCallbacks]);

  useEffect(() => {
    if (error) {
      message.error(error);
      if (!isRetrying) {
        void handleRetry();
      }
    }
  }, [error, isRetrying, handleRetry]);

  if (loading) {
    return <LoadingView label={APPLICATIONS_CONSTANTS.MESSAGES.LOADING} />;
  }

  if (error) {
    return (
      <ReachabilityErrorView
        isInCooldown={isInCooldown}
        cooldownTime={cooldownTime}
        retryCount={retryCount}
        nextRetryIn={nextRetryIn}
        onCancel={handleCancelRetry}
      />
    );
  }

  if (!loading && visibleApplications.length === 0) {
    return <ApplicationsMainEmpty onRefresh={handleLoadApplications} />;
  }

  return (
    <>
      <ApplicationsSuccess
        applications={paginatedApplications}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onEditApplication={openEditPanel}
        onOpenFilters={() => setFilterPanelOpen(true)}
        pagination={{
          currentPage: effectivePage,
          pageSize: APPLICATIONS_PAGE_SIZE,
          total: totalFiltered,
          onPageChange: setCurrentPage,
        }}
      />
      <EditApplicationPanel
        open={editTarget != null}
        onClose={closeEditPanel}
        application={editTarget}
        form={editForm}
      />
      <FilterPanel
        open={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        fields={filterFields}
        onFilterChange={(filters) => {
          setCurrentPage(1);
          setAppliedFilters(filters);
        }}
        onApply={(filters) => {
          setCurrentPage(1);
          setAppliedFilters(filters);
          setFilterPanelOpen(false);
        }}
        onReset={() => {
          setCurrentPage(1);
          setAppliedFilters({});
        }}
      />
    </>
  );
});

ApplicationsGlobalView.displayName = 'ApplicationsGlobalView';

export default ApplicationsGlobalView;

function filterByExcludedNamespaces(apps: Application[], excluded: string[]): Application[] {
  if (excluded.length === 0) return apps;
  const excludedSet = new Set(excluded);
  return apps.filter((a) => {
    const primaryNs = (a.namespaces?.items ?? [])[0]?.name ?? '';
    return primaryNs === '' || !excludedSet.has(primaryNs);
  });
}

function uniqOptions(
  apps: Application[],
  getValue: (a: Application) => string | undefined | null,
): { value: string; label: string }[] {
  const set = new Set<string>();
  for (const a of apps) {
    const v = (getValue(a) ?? '').trim();
    if (v) set.add(v);
  }
  return [...set].sort().map((v) => ({ value: v, label: v }));
}

function uniqNamespaceOptions(apps: Application[]): { value: string; label: string }[] {
  const set = new Set<string>();
  for (const a of apps) {
    const items = a.namespaces?.items ?? [];
    for (const n of items) {
      const v = (n.name ?? '').trim();
      if (v) set.add(v);
    }
  }
  return [...set].sort().map((v) => ({ value: v, label: v }));
}

function applyApplicationFilters(
  apps: Application[],
  filters: Record<string, unknown>,
): Application[] {
  const dateRange = (filters.dateRange as DateRangeFilter | undefined) || undefined;
  const status = (filters.status as string[]) || [];
  const managedBy = (filters.managedBy as string[]) || [];
  const managedChart = (filters.managedChart as string[]) || [];
  const namespaces = (filters.namespaces as string[]) || [];
  const insightCategory = (filters.insightCategory as string[]) || [];
  const insightRole = (filters.insightRole as string[]) || [];
  const crStatus = (filters.crStatus as string[]) || [];
  const hasDrift = (filters.hasDrift as string[]) || [];

  const has = (arr: string[]) => arr.length > 0;
  if (
    !has(status) &&
    !has(managedBy) &&
    !has(managedChart) &&
    !has(namespaces) &&
    !has(insightCategory) &&
    !has(insightRole) &&
    !has(crStatus) &&
    !has(hasDrift) &&
    !dateRange?.from &&
    !dateRange?.to
  ) {
    return apps;
  }
  const filteredByDate = filterByDateRange(apps, dateRange, (a) => a.createdAt);
  return filteredByDate.filter((a) => {
    if (has(status) && !status.includes(a.health?.status ?? '')) return false;
    if (has(managedBy) && !managedBy.includes(a.managed?.by ?? '')) return false;
    if (has(managedChart) && !managedChart.includes(a.managed?.chart ?? '')) return false;
    if (has(insightCategory) && !insightCategory.includes(a.insights?.category ?? '')) return false;
    if (has(insightRole) && !insightRole.includes(a.insights?.role ?? '')) return false;
    if (has(crStatus) && !crStatus.includes(a.crStatus ?? '')) return false;
    if (has(hasDrift) && !hasDrift.includes(String(Boolean(a.history?.hasDrift)))) return false;
    if (has(namespaces)) {
      const ns = new Set((a.namespaces?.items ?? []).map((n) => n.name));
      let ok = false;
      for (const want of namespaces) {
        if (ns.has(want)) {
          ok = true;
          break;
        }
      }
      if (!ok) return false;
    }
    return true;
  });
}
