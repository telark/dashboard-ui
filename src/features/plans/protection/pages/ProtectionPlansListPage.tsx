import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { getCardGridColumns } from '../../../../constants';
import { useElementWidth } from '../../../../hooks/layout';
import type { PlanPhase, PlanPhaseQuickFilter, PlanViewMode, ProtectionPlan } from '../models';
import { ProtectionPlanCard, ProtectionPlansToolbar, NoProtectionPlansState } from '../components';
import ProtectionPlansEmptyPage from './ProtectionPlansEmptyPage';
import { FilterPanel } from '../../../../components/display/panels/filter';
import type { FilterField } from '../../../../components/display/panels/filter/FilterPanel';
import {
  DATA_VIEW_ERROR_CONSTANTS as DVE,
  DataViewError,
  PageContainer,
} from '../../../../components/shared';
import { FancySpinner } from '../../../../components/animation';
import { connectivityIssueFrom } from '../../../../api/client/health-interceptor';
import { useLoadingTimeout } from '../../../../hooks/layout/useLoadingTimeout';
import { applyPlanFilters } from '../utils/applyPlanFilters';
import { PROTECTION_PLANS_CONSTANTS as PPC, CARD_LAYOUT } from '../constants/protectionPlans';
import {
  setPhaseQuickFilter,
  setAppliedPlanFilters,
  clearAppliedPlanFilters,
} from '../store/slices/protectionPlansSlice';
import type { AppDispatch, RootState } from '../../../../store';
import { UserOptionRow } from '../../../../components/display/users';
import { getCurrentUser } from '../../../auth/utils';
import { mapCategoriesToOptions } from '../../../access-and-permissions/categories/utils/helpers';
import { usePlanTaxonomies } from '../hooks/usePlanTaxonomies';
import { useUsernamesByIds } from '../../../../hooks/useUsernamesByIds';

const CURRENT_USER_LABEL = 'me';

interface ProtectionPlansListPageProps {
  plans: ProtectionPlan[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePlanClick: () => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onViewModeChange: (mode: Exclude<PlanViewMode, 'plans'>) => void;
  tabs?: React.ReactNode;
}

const QUICK_FILTER_KEYS: PlanPhaseQuickFilter[] = [
  'all',
  'active',
  'scheduled',
  'pending_approval',
  'canceled',
  'terminated',
  'failed',
];

// The thunk already rejected with the extracted server message; re-wrapping it
// in an Error only hides it behind userFacingMessage's generic fallback.
const buildErrorMessage = (error: string | null, timedOut: boolean): string => {
  if (timedOut) return DVE.LABELS.TIMEOUT_MESSAGE;
  return error || DVE.LABELS.GENERIC_MESSAGE;
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
  ({
    plans,
    searchValue,
    onSearchChange,
    onCreatePlanClick,
    loading,
    error,
    onRetry,
    onViewModeChange,
    tabs,
  }) => {
    const hasData = plans.length > 0;
    const timedOut = useLoadingTimeout({ isLoading: loading, hasError: Boolean(error), hasData });
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const navigateRef = useRef(navigate);
    navigateRef.current = navigate;
    const openPlan = useCallback((path: string) => navigateRef.current(path), []);

    const phaseQuickFilter = useSelector((s: RootState) => s.protectionPlans.phaseQuickFilter);
    const appliedFilters = useSelector((s: RootState) => s.protectionPlans.appliedFilters);
    const allUsers = useSelector((s: RootState) => s.users.users);
    const taxonomies = usePlanTaxonomies();
    const userMap = useMemo(() => {
      const m = new Map<string, (typeof allUsers)[number]>();
      allUsers.forEach((u) => m.set(u.id, u));
      return m;
    }, [allUsers]);
    const currentUserId = useMemo(() => getCurrentUser()?.id, []);
    const actorIds = useMemo(
      () =>
        plans
          .flatMap((p) => [p.createdBy, p.approval?.requestedBy])
          .filter((id): id is string => Boolean(id)),
      [plans],
    );
    const usernamesById = useUsernamesByIds(actorIds, true);
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const { ref: gridRef, width: gridWidth } = useElementWidth<HTMLDivElement>();

    const searchedPlans = useMemo(() => {
      if (!searchValue) return plans;
      const lower = searchValue.toLowerCase();
      return plans.filter((plan) => {
        const scope =
          plan.scope.type === 'applications'
            ? (plan.scope.applicationRefs?.join(' ') ?? '')
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
        pending_approval: 0,
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
      const createdByOptions = uniqueValues(plans, (p) => p.createdBy)
        .filter(({ value }) => usernamesById[value])
        .map(({ value }) => ({
          value,
          label: value === currentUserId ? CURRENT_USER_LABEL : usernamesById[value],
        }));
      const renderUserOption = (option: { value: string; label: string }): React.ReactNode => (
        <UserOptionRow user={userMap.get(option.value)} displayName={option.label} />
      );
      const templateOptions = uniqueValues(plans, (p) =>
        (p.policies ?? []).map((policy) => policy.templateID),
      );
      const targetOptions = uniqueValues(plans, (p) =>
        p.scope.type === 'namespaces' ? p.scope.namespaces : p.scope.applicationRefs,
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
        {
          key: PPC.FILTER_KEYS.ENVIRONMENT,
          label: PPC.LABELS.FILTER.BY_ENVIRONMENT,
          type: 'multiSelect',
          multiSelectOptions: mapCategoriesToOptions(taxonomies.environments),
        },
        {
          key: PPC.FILTER_KEYS.TAGS,
          label: PPC.LABELS.FILTER.BY_TAGS,
          type: 'multiSelect',
          multiSelectOptions: mapCategoriesToOptions(taxonomies.tags),
        },
      ];
    }, [plans, usernamesById, userMap, currentUserId, taxonomies.environments, taxonomies.tags]);

    let dataRegion: React.ReactNode;
    if (error || timedOut) {
      dataRegion = (
        <DataViewError
          variant="card"
          message={buildErrorMessage(error, timedOut)}
          onRetry={onRetry}
          connectivity={connectivityIssueFrom(error)}
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
    } else if (plans.length === 0) {
      dataRegion = <ProtectionPlansEmptyPage />;
    } else if (filteredPlans.length === 0) {
      dataRegion = <NoProtectionPlansState />;
    } else {
      dataRegion = (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${getCardGridColumns(gridWidth)}, minmax(0, 1fr))`,
            gap: CARD_LAYOUT.GRID_GAP_PX,
            // Every row as tall as the tallest card, so all cards share one height.
            gridAutoRows: '1fr',
            alignItems: 'stretch',
          }}
        >
          {filteredPlans.map((plan) => (
            <ProtectionPlanCard key={plan.id} plan={plan} onOpen={openPlan} names={usernamesById} />
          ))}
        </div>
      );
    }

    return (
      <PageContainer
        title={PPC.LABELS.HEADER_TITLE}
        subtitle={PPC.LABELS.HEADER_SUBTITLE}
        gap={LIST_PAGE.CONTENT_GAP_PX}
      >
        {tabs}
        <ProtectionPlansToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          onCreatePlanClick={onCreatePlanClick}
          onOpenFilters={() => setFilterPanelOpen(true)}
          phaseQuickFilter={phaseQuickFilter}
          onPhaseQuickFilterChange={handlePhaseQuickFilterChange}
          phaseCounts={phaseCounts}
          totalCount={phaseCounts.all}
          onViewModeChange={onViewModeChange}
        />

        <div ref={gridRef} style={{ marginTop: LIST_PAGE.CONTENT_OFFSET_PX }}>
          {dataRegion}
        </div>

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
