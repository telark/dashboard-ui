import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import type { PlanPhase, PlanPhaseQuickFilter, ProtectionPlan } from '../models';
import { useAppearance } from '../../../settings/sections/appearance';
import { ProtectionPlanCard, ProtectionPlansToolbar, NoProtectionPlansState } from '../components';
import { FilterPanel } from '../../../../components/display/panels/filter';
import type { FilterField } from '../../../../components/display/panels/filter/FilterPanel';
import {
  DATA_VIEW_ERROR_CONSTANTS as DVE,
  DataViewError,
  PageContainer,
} from '../../../../components/shared';
import { FancySpinner } from '../../../../components/animation';
import { useLoadingTimeout } from '../../../../hooks/layout/useLoadingTimeout';
import { userFacingMessage } from '../../../../api';
import { applyPlanFilters } from '../utils/applyPlanFilters';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import {
  setPhaseQuickFilter,
  setAppliedPlanFilters,
  clearAppliedPlanFilters,
} from '../store/slices/protectionPlansSlice';
import type { AppDispatch, RootState } from '../../../../store';
import { UserOptionRow } from '../../../../components/display/users';
import { getCurrentUser } from '../../../auth/utils';

const CURRENT_USER_LABEL = 'me';

interface ProtectionPlansListPageProps {
  plans: ProtectionPlan[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePlanClick: () => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const QUICK_FILTER_KEYS: PlanPhaseQuickFilter[] = [
  'all',
  'active',
  'scheduled',
  'canceled',
  'terminated',
  'failed',
];

const buildErrorMessage = (error: string | null, timedOut: boolean): string => {
  if (timedOut) return DVE.LABELS.TIMEOUT_MESSAGE;
  if (!error) return DVE.LABELS.GENERIC_MESSAGE;
  try {
    return userFacingMessage(new Error(error));
  } catch {
    return DVE.LABELS.GENERIC_MESSAGE;
  }
};

const uniqueValues = (
  plans: ProtectionPlan[],
  getter: (p: ProtectionPlan) => string | string[] | undefined,
): { value: string; label: string }[] => {
  const set = new Set<string>();
  plans.forEach((p) => {
    const v = getter(p);
    if (Array.isArray(v)) v.forEach((x) => x && set.add(x));
    else if (v) set.add(v);
  });
  return Array.from(set).map((value) => ({ value, label: value }));
};

const ProtectionPlansListPage: React.FC<ProtectionPlansListPageProps> = memo(
  ({ plans, searchValue, onSearchChange, onCreatePlanClick, loading, error, onRetry }) => {
    const { contentGap } = useAppearance();
    const hasData = plans.length > 0;
    const timedOut = useLoadingTimeout({ isLoading: loading, hasError: Boolean(error), hasData });
    const dispatch: AppDispatch = useDispatch();

    const phaseQuickFilter = useSelector((s: RootState) => s.protectionPlans.phaseQuickFilter);
    const appliedFilters = useSelector((s: RootState) => s.protectionPlans.appliedFilters);
    const allUsers = useSelector((s: RootState) => s.users.users);
    const userMap = useMemo(() => {
      const m = new Map<string, (typeof allUsers)[number]>();
      allUsers.forEach((u) => m.set(u.id, u));
      return m;
    }, [allUsers]);
    const currentUserId = useMemo(() => getCurrentUser()?.id, []);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);

    const searchedPlans = useMemo(() => {
      if (!searchValue) return plans;
      const lower = searchValue.toLowerCase();
      return plans.filter((plan) => {
        const scope =
          plan.scope.type === 'applications'
            ? (plan.scope.applicationIds?.join(' ') ?? '')
            : (plan.scope.namespaces?.join(' ') ?? '');
        return (
          plan.name.toLowerCase().includes(lower) ||
          plan.phase.toLowerCase().includes(lower) ||
          scope.toLowerCase().includes(lower)
        );
      });
    }, [plans, searchValue]);

    const panelFilteredPlans = useMemo(
      () => applyPlanFilters(searchedPlans, appliedFilters),
      [searchedPlans, appliedFilters],
    );

    const phaseCounts = useMemo<Record<PlanPhaseQuickFilter, number>>(() => {
      const counts: Record<PlanPhaseQuickFilter, number> = {
        all: panelFilteredPlans.length,
        active: 0,
        scheduled: 0,
        canceled: 0,
        terminated: 0,
        failed: 0,
        draft: 0,
      };
      panelFilteredPlans.forEach((p) => {
        const k = p.phase as PlanPhase;
        if (k in counts) counts[k] += 1;
      });
      return counts;
    }, [panelFilteredPlans]);

    const filteredPlans = useMemo(() => {
      if (phaseQuickFilter === 'all') return panelFilteredPlans;
      return panelFilteredPlans.filter((p) => p.phase === phaseQuickFilter);
    }, [panelFilteredPlans, phaseQuickFilter]);

    const handlePhaseQuickFilterChange = useCallback(
      (next: PlanPhaseQuickFilter) => {
        if (QUICK_FILTER_KEYS.includes(next)) dispatch(setPhaseQuickFilter(next));
      },
      [dispatch],
    );

    const filterFields: FilterField[] = useMemo(() => {
      const scopeOptions = uniqueValues(plans, (p) => p.scope.type);
      const createdByOptions = allUsers.map((u) => ({
        value: u.id,
        label: u.id === currentUserId ? CURRENT_USER_LABEL : (u.username ?? u.id),
      }));
      const renderUserOption = (option: { value: string; label: string }): React.ReactNode => (
        <UserOptionRow user={userMap.get(option.value)} displayName={option.label} />
      );
      const templateOptions = uniqueValues(plans, (p) =>
        (p.policies ?? []).map((policy) => policy.templateID),
      );
      const targetOptions = uniqueValues(plans, (p) =>
        p.scope.type === 'namespaces' ? p.scope.namespaces : p.scope.applicationIds,
      );
      return [
        {
          key: PPC.FILTER_KEYS.DATE_RANGE,
          label: PPC.LABELS.FILTER.BY_CREATION_DATE,
          type: 'dateRange',
          fromLabel: PPC.LABELS.FILTER.FROM,
          toLabel: PPC.LABELS.FILTER.TO,
        },
        {
          key: PPC.FILTER_KEYS.SCOPE_TYPE,
          label: PPC.LABELS.FILTER.BY_SCOPE_TYPE,
          type: 'multiSelect',
          multiSelectOptions: scopeOptions,
        },
        {
          key: PPC.FILTER_KEYS.CREATED_BY,
          label: PPC.LABELS.FILTER.BY_CREATED_BY,
          type: 'multiSelect',
          multiSelectOptions: createdByOptions,
          optionRender: renderUserOption,
        },
        {
          key: PPC.FILTER_KEYS.TEMPLATES,
          label: PPC.LABELS.FILTER.BY_TEMPLATES,
          type: 'multiSelect',
          multiSelectOptions: templateOptions,
        },
        {
          key: PPC.FILTER_KEYS.TARGETS,
          label: PPC.LABELS.FILTER.BY_TARGETS,
          type: 'multiSelect',
          multiSelectOptions: targetOptions,
        },
      ];
    }, [plans, allUsers, userMap, currentUserId]);

    let dataRegion: React.ReactNode;
    if (error || timedOut) {
      dataRegion = (
        <DataViewError
          variant="card"
          message={buildErrorMessage(error, timedOut)}
          onRetry={onRetry}
        />
      );
    } else if (loading && !hasData) {
      dataRegion = (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 240,
          }}
        >
          <FancySpinner size={40} showLabel />
        </div>
      );
    } else if (filteredPlans.length === 0) {
      dataRegion = <NoProtectionPlansState />;
    } else {
      dataRegion = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredPlans.map((plan) => (
            <ProtectionPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      );
    }

    return (
      <PageContainer
        title={PPC.LABELS.HEADER_TITLE}
        subtitle={PPC.LABELS.HEADER_SUBTITLE}
        gap={contentGap}
      >
        <ProtectionPlansToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onCreatePlanClick={onCreatePlanClick}
          onOpenFilters={() => setFilterPanelOpen(true)}
          phaseQuickFilter={phaseQuickFilter}
          onPhaseQuickFilterChange={handlePhaseQuickFilterChange}
          phaseCounts={phaseCounts}
          totalCount={phaseCounts.all}
        />

        <div style={{ marginTop: LIST_PAGE.CONTENT_OFFSET_PX }}>{dataRegion}</div>

        <FilterPanel
          open={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
          fields={filterFields}
          value={appliedFilters}
          onFilterChange={(filters) => dispatch(setAppliedPlanFilters(filters))}
          onApply={(filters) => {
            dispatch(setAppliedPlanFilters(filters));
            setFilterPanelOpen(false);
          }}
          onReset={() => dispatch(clearAppliedPlanFilters())}
        />
      </PageContainer>
    );
  },
);

ProtectionPlansListPage.displayName = 'ProtectionPlansListPage';

export default ProtectionPlansListPage;
