import React, { memo, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Empty, Tag } from 'antd';
import type { TableColumnType } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  APP_ROUTES,
  DEFAULT_COLORS,
  STATUS_COLORS,
  TAG_CLASS,
  getPillColor,
} from '../../../../constants';
import { PageLayout } from '../../../../components/display/views';
import { FilterPanel } from '../../../../components/display/panels/filter';
import type { FilterField } from '../../../../components/display/panels/filter/FilterPanel';
import SortHeader from '../../../../components/display/table/Sort';
import { TABLE_DEFAULTS } from '../../../../components/display/table/constants';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import type { PageLayoutConfig } from '../../../../interfaces/layout/page';
import { useElementWidth } from '../../../../hooks/layout';
import { useUsernamesByIds } from '../../../../hooks/useUsernamesByIds';
import type { RootState } from '../../../../store';
import { usePermission, ACTION_PERMISSIONS } from '../../../auth/hooks';
import {
  getCategoryName,
  mapCategoriesToOptions,
} from '../../../access-and-permissions/categories/utils/helpers';
import type { Category } from '../../../access-and-permissions/categories/models';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  REPORT_ROW_ACTIONS_GAP_PX,
  REPORT_SYSTEM_USER_ID,
  REPORTS_LIST,
} from '../constants/protectionPlans';
import ReportDownloadButton from '../components/shared/ReportDownloadButton';
import ReportDeleteButton from '../components/shared/ReportDeleteButton';
import { useAllPlanReports } from '../hooks/usePlanReports';
import { usePlanReportDelete } from '../hooks/usePlanReportDelete';
import { usePlanTaxonomies } from '../hooks/usePlanTaxonomies';
import { applyReportFilters } from '../utils/applyReportFilters';
import type {
  PlanReportFormat,
  PlanReportMeta,
  PlanReportTrigger,
  ProtectionPlan,
} from '../models';

interface ProtectionPlanReportsPageProps {
  plans: ProtectionPlan[];
  // Plan names resolve from the plans list; until it loads every row would read as a deleted plan.
  plansLoading: boolean;
  plansError: string | null;
  onRetryPlans: () => void;
  tabs: React.ReactNode;
  // The tab stays mounted while hidden; each showing re-reads the reports (a card may have added one).
  active: boolean;
}

type ColumnKey = keyof typeof REPORTS_LIST.COLUMN_WIDTHS;

const L = PPC.LABELS.REPORTS_TAB;
const W = REPORTS_LIST.COLUMN_WIDTHS;
const TRIGGERS: PlanReportTrigger[] = ['manual', 'window', 'cancel', 'end'];
// Lowest priority last: dropped first when the table runs out of room.
const OPTIONAL_COLUMNS: ColumnKey[] = ['ENVIRONMENT', 'GENERATED_BY', 'VIOLATIONS'];
const REQUIRED_WIDTH = W.GENERATED_AT + W.PLAN + W.TRIGGER + W.ACTIONS;

const mutedText: React.CSSProperties = { color: DEFAULT_COLORS.TEXT_MUTED };

const fittingColumns = (available: number): Set<ColumnKey> => {
  const fitting = new Set<ColumnKey>();
  let used = REQUIRED_WIDTH;
  for (const key of OPTIONAL_COLUMNS) {
    used += W[key];
    if (available > 0 && used > available) break;
    fitting.add(key);
  }
  return fitting;
};

interface ColumnContext {
  planById: Map<string, ProtectionPlan>;
  keptNameById: Map<string, string>;
  environments: Category[];
  resolveUser: (id: string) => string;
  canDownload: boolean;
  downloading: string | null;
  onDownload: (report: PlanReportMeta, format: PlanReportFormat, filename: string) => void;
  onDelete: (report: PlanReportMeta, planName: string) => void;
}

const column = (
  key: ColumnKey,
  label: string,
  render: (report: PlanReportMeta) => React.ReactNode,
): TableColumnType<PlanReportMeta> => ({
  key,
  width: W[key],
  title: <SortHeader label={label} align="left" sortable={false} />,
  onHeaderCell: () => ({ style: { background: TABLE_DEFAULTS.HEADER_BG } }),
  render: (_: unknown, report: PlanReportMeta) => render(report),
});

// A kept report names the plan it outlived; any other report of a gone plan has no name left.
const PlanCell: React.FC<{ plan?: ProtectionPlan; keptName?: string }> = ({ plan, keptName }) =>
  plan ? (
    <Link
      to={APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', encodeURIComponent(plan.name))}
      style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: 700 }}
    >
      {plan.name}
    </Link>
  ) : (
    <span style={mutedText}>{keptName ? L.KEPT_PLAN(keptName) : L.DELETED_PLAN}</span>
  );

const planNameOf = (ctx: ColumnContext, report: PlanReportMeta): string =>
  ctx.planById.get(report.planId)?.name || ctx.keptNameById.get(report.planId) || report.planId;

const newestFirst = (a: PlanReportMeta, b: PlanReportMeta): number =>
  b.generatedAt.localeCompare(a.generatedAt);

const buildColumns = (
  ctx: ColumnContext,
  visible: Set<ColumnKey>,
): TableColumnType<PlanReportMeta>[] =>
  [
    column('GENERATED_AT', L.COLUMNS.GENERATED_AT, (r) => <TimeAgo date={r.generatedAt} />),
    column('PLAN', L.COLUMNS.PLAN, (r) => (
      <PlanCell plan={ctx.planById.get(r.planId)} keptName={ctx.keptNameById.get(r.planId)} />
    )),
    visible.has('ENVIRONMENT')
      ? column('ENVIRONMENT', L.COLUMNS.ENVIRONMENT, (r) =>
          getCategoryName(ctx.planById.get(r.planId)?.environmentRef ?? '', ctx.environments),
        )
      : null,
    column('TRIGGER', L.COLUMNS.TRIGGER, (r) => (
      <Tag
        color={getPillColor(STATUS_COLORS.PLAN_REPORT_TRIGGER[r.trigger])}
        className={`${TAG_CLASS.MEDIUM} ${TAG_CLASS.AS_IS}`}
      >
        {PPC.LABELS.REPORTS.TRIGGER_LABELS[r.trigger]}
      </Tag>
    )),
    visible.has('GENERATED_BY')
      ? column('GENERATED_BY', L.COLUMNS.GENERATED_BY, (r) => (
          <span title={r.generatedBy}>{ctx.resolveUser(r.generatedBy)}</span>
        ))
      : null,
    visible.has('VIOLATIONS')
      ? column('VIOLATIONS', L.COLUMNS.VIOLATIONS, (r) => r.violationsTotal)
      : null,
    column('ACTIONS', '', (r) => (
      <div style={{ display: 'flex', gap: REPORT_ROW_ACTIONS_GAP_PX }}>
        <ReportDownloadButton
          report={r}
          planName={planNameOf(ctx, r)}
          canDownload={ctx.canDownload}
          downloading={ctx.downloading}
          onDownload={ctx.onDownload}
        />
        <ReportDeleteButton
          report={r}
          onDelete={(report) => ctx.onDelete(report, planNameOf(ctx, r))}
        />
      </div>
    )),
  ].filter((c): c is TableColumnType<PlanReportMeta> => c !== null);

const ProtectionPlanReportsPage: React.FC<ProtectionPlanReportsPageProps> = memo(
  ({ plans, plansLoading, plansError, onRetryPlans, tabs, active }) => {
    const { reports, kept, loading, error, downloading, download, refresh } =
      useAllPlanReports(active);
    const { requestDelete, modal } = usePlanReportDelete(refresh);
    const users = useSelector((s: RootState) => s.users.users);
    const { environments } = usePlanTaxonomies();
    const canDownload = usePermission(
      ACTION_PERMISSIONS.protectionPlans.downloadReport.scope,
      ACTION_PERMISSIONS.protectionPlans.downloadReport.level,
      ACTION_PERMISSIONS.protectionPlans.downloadReport.deny,
    );
    const { ref, width } = useElementWidth<HTMLDivElement>();
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, unknown>>({});
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(REPORTS_LIST.PAGE_SIZE);

    const planById = useMemo(() => new Map(plans.map((p) => [p.id, p])), [plans]);
    const keptNameById = useMemo(() => new Map(kept.map((k) => [k.planId, k.planName])), [kept]);
    // Kept reports have their own list, so the newest-N cap of the other one never hides them.
    const rows = useMemo(
      () => [...reports, ...kept.flatMap((k) => k.reports)].sort(newestFirst),
      [reports, kept],
    );
    const generatorIds = useMemo(() => rows.map((report) => report.generatedBy), [rows]);
    const usernamesById = useUsernamesByIds(generatorIds, true);
    const resolveUser = useCallback(
      (id: string): string =>
        id === REPORT_SYSTEM_USER_ID
          ? PPC.LABELS.REPORTS.SYSTEM_ACTOR
          : (users.find((u) => u.id === id)?.username ?? usernamesById[id] ?? ''),
      [users, usernamesById],
    );

    const filtered = useMemo(
      () => applyReportFilters(rows, filters, search, planById, keptNameById),
      [rows, filters, search, planById, keptNameById],
    );
    const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    const page = Math.min(currentPage, lastPage);
    const pageRows = useMemo(
      () => filtered.slice((page - 1) * pageSize, page * pageSize),
      [filtered, page, pageSize],
    );

    const applyFilters = useCallback((next: Record<string, unknown>) => {
      setFilters(next);
      setCurrentPage(1);
    }, []);
    const handleSearch = useCallback((value: string) => {
      setSearch(value);
      setCurrentPage(1);
    }, []);

    const filterFields: FilterField[] = useMemo(
      () => [
        {
          key: PPC.FILTER_KEYS.DATE_RANGE,
          label: L.FILTER.BY_GENERATED_DATE,
          type: 'dateRange',
          fromLabel: PPC.LABELS.FILTER.FROM,
          toLabel: PPC.LABELS.FILTER.TO,
        },
        {
          key: PPC.FILTER_KEYS.PLAN,
          label: L.FILTER.BY_PLAN,
          type: 'multiSelect',
          multiSelectOptions: [
            ...plans.map((p) => ({ value: p.id, label: p.name })),
            ...kept.map((k) => ({ value: k.planId, label: L.KEPT_PLAN(k.planName || k.planId) })),
          ],
        },
        {
          key: PPC.FILTER_KEYS.ENVIRONMENT,
          label: PPC.LABELS.FILTER.BY_ENVIRONMENT,
          type: 'multiSelect',
          multiSelectOptions: mapCategoriesToOptions(environments),
        },
        {
          key: PPC.FILTER_KEYS.TRIGGER,
          label: L.FILTER.BY_TRIGGER,
          type: 'multiSelect',
          multiSelectOptions: TRIGGERS.map((t) => ({
            value: t,
            label: PPC.LABELS.REPORTS.TRIGGER_LABELS[t],
          })),
        },
      ],
      [plans, kept, environments],
    );

    const columns = useMemo(
      () =>
        buildColumns(
          {
            planById,
            keptNameById,
            environments,
            resolveUser,
            canDownload,
            downloading,
            onDownload: download,
            onDelete: requestDelete,
          },
          fittingColumns(width),
        ),
      [
        planById,
        keptNameById,
        environments,
        resolveUser,
        canDownload,
        downloading,
        download,
        requestDelete,
        width,
      ],
    );

    const truncated = reports.length >= REPORTS_LIST.LIMIT;
    const config: PageLayoutConfig<PlanReportMeta> = {
      title: PPC.LABELS.HEADER_TITLE,
      subtitle: PPC.LABELS.HEADER_SUBTITLE,
      tabs: (
        <div ref={ref}>
          {tabs}
          {truncated ? (
            <p style={{ ...mutedText, margin: 0 }}>{L.TRUNCATED(reports.length)}</p>
          ) : null}
        </div>
      ),
      listToolbar: {
        totalCount: filtered.length,
        countSuffix: L.COUNT_SUFFIX,
        compactWidth: REPORTS_LIST.TOOLBAR_COMPACT_WIDTH,
        onOpenFilters: () => setFilterPanelOpen(true),
        toolbars: [
          {
            search: { placeholder: L.SEARCH_PLACEHOLDER, value: search, onChange: handleSearch },
            buttons: [
              {
                key: 'search',
                label: PPC.LABELS.TOOLBAR_SEARCH_BUTTON,
                icon: <SearchOutlined />,
                variant: 'ghost',
              },
              {
                key: 'refresh',
                label: L.REFRESH,
                icon: <ReloadOutlined />,
                variant: 'default',
                iconOnly: true,
                loading,
                onClick: refresh,
              },
            ],
          },
        ],
      },
      columns,
      data: pageRows,
      rowKey: (r) => `${r.planId}:${r.id}`,
      pagination: {
        currentPage: page,
        pageSize,
        total: filtered.length,
        onPageChange: setCurrentPage,
        onPageSizeChange: (size) => {
          setPageSize(size);
          setCurrentPage(1);
        },
        pageSizeOptions: [...REPORTS_LIST.PAGE_SIZE_OPTIONS],
      },
      empty: <Empty description={rows.length === 0 ? L.EMPTY : L.NO_MATCH} />,
      loading: loading || (plansLoading && plans.length === 0),
      error: error ?? plansError,
      onRetry: () => {
        if (plansError) onRetryPlans();
        refresh();
      },
    };

    return (
      <>
        <PageLayout config={config} />
        <FilterPanel
          open={filterPanelOpen}
          onClose={() => setFilterPanelOpen(false)}
          fields={filterFields}
          value={filters}
          onFilterChange={applyFilters}
          onApply={(next) => {
            applyFilters(next);
            setFilterPanelOpen(false);
          }}
          onReset={() => applyFilters({})}
        />
        {modal}
      </>
    );
  },
);

ProtectionPlanReportsPage.displayName = 'ProtectionPlanReportsPage';

export default ProtectionPlanReportsPage;
