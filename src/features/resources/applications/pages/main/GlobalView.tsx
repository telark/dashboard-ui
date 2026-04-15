import React, { memo, useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, message } from 'antd';
import type { RootState, AppDispatch } from '../../../../../store';
import { loadApplications, loadApplicationsSilent } from '../../utils/management/state';
import logger from '../../../../../logging';
import { APPLICATIONS_CONSTANTS, APPLICATIONS_PAGE_SIZE, APPLICATIONS_UI } from '../../constants';
import { executeRetryWithBackoff, RETRY_STATUS } from '../../../../shared/retry';
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
import {
  clearAllFilters,
  removeFilterValue,
  setAppliedFilters,
  setCurrentPage,
} from '../../store/slices/applicationsSlice';

const ApplicationsGlobalView: React.FC = memo(() => {
  const dispatch: AppDispatch = useDispatch();
  const { applications, loading, error, appliedFilters, currentPage } = useSelector(
    (s: RootState) => s.applications,
  );
  const fetchIntervalSeconds = useSelector((s: RootState) =>
    s.globalconfig.data?.userSettings?.fetchIntervalSeconds != null
      ? Number(s.globalconfig.data.userSettings.fetchIntervalSeconds)
      : 60,
  );
  const excludedNamespaces = useSelector(
    (s: RootState) => s.globalconfig.data?.excludedNamespaces ?? [],
  );
  const retryState = useSelector((s: RootState) => s.retry.byKey[APPLICATIONS_CONSTANTS.RETRY.KEY]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const [retryTickMs, setRetryTickMs] = useState(0);

  const visibleApplications = useMemo(
    () => filterByExcludedNamespaces(applications, excludedNamespaces),
    [applications, excludedNamespaces],
  );
  const hasTriggeredInitialLoad = useRef(false);
  const retryInFlightRef = useRef(false);

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

  const filterFields: FilterField[] = useMemo(() => {
    const statusOptions = uniqOptions(visibleApplications, (a) => a.health?.status);
    const managedByOptions = uniqOptions(visibleApplications, (a) => a.managed?.by);
    const managedChartOptions = uniqOptions(visibleApplications, (a) => a.managed?.chart || '');
    const namespaceOptions = uniqNamespaceOptions(visibleApplications);
    const insightCategoryOptions = uniqOptions(
      visibleApplications,
      (a) => a.insights?.category || '',
    );
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
  const hasActiveFilters = useMemo(() => hasAnyAppliedFilter(appliedFilters), [appliedFilters]);

  const totalFiltered = filteredApplications.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / APPLICATIONS_PAGE_SIZE));
  const effectivePage = Math.min(currentPage, totalPages);
  const paginatedApplications = useMemo(() => {
    const start = (effectivePage - 1) * APPLICATIONS_PAGE_SIZE;
    return filteredApplications.slice(start, start + APPLICATIONS_PAGE_SIZE);
  }, [effectivePage, filteredApplications]);
  const allFilterChips = useMemo(() => buildFilterChips(appliedFilters), [appliedFilters]);
  const visibleFilterChips = allFilterChips.slice(0, 3);
  const overflowChipsCount = Math.max(0, allFilterChips.length - visibleFilterChips.length);

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

  useEffect(() => {
    if ((!error && !retryState) || retryInFlightRef.current) return;
    retryInFlightRef.current = true;
    void executeRetryWithBackoff({
      key: APPLICATIONS_CONSTANTS.RETRY.KEY,
      execute: () => loadApplicationsSilent(dispatch),
      isContextActive: () => document.visibilityState === 'visible',
      onAttemptFailed: (attempt, retryError) => {
        logger.error(APPLICATIONS_CONSTANTS.MESSAGES.RETRY_ATTEMPT_LOG, {
          key: APPLICATIONS_CONSTANTS.RETRY.KEY,
          attempt,
          error: retryError,
        });
        messageApi.open({
          key: APPLICATIONS_CONSTANTS.RETRY.MESSAGE_KEY,
          type: 'error',
          content: APPLICATIONS_CONSTANTS.MESSAGES.RETRY_FAILED_ATTEMPT,
        });
      },
    }).finally(() => {
      retryInFlightRef.current = false;
    });
  }, [dispatch, error, messageApi, retryState]);

  useEffect(() => {
    const timer = setInterval(() => setRetryTickMs(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!retryState) {
      messageApi.destroy(APPLICATIONS_CONSTANTS.RETRY.MESSAGE_KEY);
      return;
    }
    if (retryState.status === RETRY_STATUS.RETRYING) {
      return;
    }
    messageApi.destroy(APPLICATIONS_CONSTANTS.RETRY.MESSAGE_KEY);
    if (retryState.status === RETRY_STATUS.SUCCESS) {
      messageApi.open({
        key: APPLICATIONS_CONSTANTS.RETRY.MESSAGE_KEY,
        type: 'success',
        content: APPLICATIONS_CONSTANTS.MESSAGES.SUCCESS,
      });
    }
  }, [messageApi, retryState]);

  const retryCount = retryState?.attempt ?? 0;
  const nextRetryIn = Math.max(0, (retryState?.nextAttemptAt ?? 0) - retryTickMs);

  const handleCancelRetry = useCallback(() => {
    messageApi.destroy(APPLICATIONS_CONSTANTS.RETRY.MESSAGE_KEY);
  }, [messageApi]);

  if (loading) {
    return <LoadingView label={APPLICATIONS_CONSTANTS.MESSAGES.LOADING} />;
  }

  if (error || retryState) {
    return (
      <ReachabilityErrorView
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
      {messageContextHolder}
      <ApplicationsSuccess
        applications={paginatedApplications}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onEditApplication={openEditPanel}
        onOpenFilters={() => setFilterPanelOpen(true)}
        onClearAllFilters={() => dispatch(clearAllFilters())}
        filterChips={visibleFilterChips}
        overflowChipsCount={overflowChipsCount}
        onRemoveFilterChip={(key, value) => dispatch(removeFilterValue({ key, value }))}
        totalFiltered={totalFiltered}
        hasActiveFilters={hasActiveFilters}
        pagination={{
          currentPage: effectivePage,
          pageSize: APPLICATIONS_PAGE_SIZE,
          total: totalFiltered,
          onPageChange: (page) => dispatch(setCurrentPage(page)),
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
        value={appliedFilters}
        onFilterChange={(filters) => {
          dispatch(setAppliedFilters(filters));
        }}
        onApply={(filters) => {
          dispatch(setAppliedFilters(filters));
          setFilterPanelOpen(false);
        }}
        onReset={() => {
          dispatch(clearAllFilters());
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

function hasAnyAppliedFilter(filters: Record<string, unknown>): boolean {
  for (const value of Object.values(filters)) {
    if (Array.isArray(value) && value.length > 0) {
      return true;
    }
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if (obj.from || obj.to) {
        return true;
      }
    }
  }
  return false;
}

function buildFilterChips(
  filters: Record<string, unknown>,
): { key: string; value: string; label: string }[] {
  const chips: { key: string; value: string; label: string }[] = [];
  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const raw = String(item);
        if (raw.trim()) {
          chips.push({ key, value: raw, label: raw });
        }
      }
      continue;
    }
    if (value && typeof value === 'object' && key === 'dateRange') {
      const range = value as DateRangeFilter;
      if (range.from || range.to) {
        const label = `${range.from || 'Any'} to ${range.to || 'Any'}`;
        chips.push({ key, value: label, label });
      }
    }
  }
  return chips;
}
