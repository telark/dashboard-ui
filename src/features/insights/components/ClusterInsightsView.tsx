import React, {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { App as AntdApp, Empty } from 'antd';
import {
  CheckOutlined,
  CheckSquareOutlined,
  EyeInvisibleOutlined,
  GroupOutlined,
  ReloadOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';
import { PageLayout } from '../../../components/display/views';
import { FilterPanel } from '../../../components/display/panels/filter';
import type { FilterField } from '../../../components/display/panels/filter/FilterPanel';
import TimeAgo from '../../../components/display/time/TimeAgo';
import { useElementWidth } from '../../../hooks/layout';
import { useSortState } from '../../../utils/layout/sort';
import type { PageLayoutConfig } from '../../../interfaces/layout/page';
import { CATEGORIES_CONSTANTS as CC } from '../../access-and-permissions/categories/constants';
import { useCategories } from '../../access-and-permissions/categories/hooks';
import { ACTION_PERMISSIONS, usePermission } from '../../auth/hooks/permissions/permissionEngine';
import { selectGlobalConfigState } from '../../globalconfig/store';
import {
  fetchAnalyzerRuntime,
  fetchClusterInsights,
  fetchInsightNamespaces,
  triageInsight,
} from '../clients/insights';
import { INSIGHTS_ERROR_MESSAGES } from '../constants/errors';
import logger from '../../../logging';
import { INSIGHTS_UI } from '../constants/texts';
import {
  ALL_INSIGHT_STATES,
  CLUSTER_INSIGHTS,
  INCIDENT_KINDS,
  INSIGHT_GROUP_BY_LABELS,
  INSIGHT_KIND_LABELS,
  INSIGHT_ROW_STATE_LABELS,
  INSIGHT_SEVERITY_LABELS,
  INSIGHT_TRIAGE_FILTER_LABELS,
  INSIGHTS_TAB_CATEGORY,
  RECOMMENDATION_KINDS,
} from '../constants/insights';
import { insightRowKey, useClusterInsights } from '../hooks/useClusterInsights';
import { triageActions } from '../utils/guidance';
import { loadGroupBy, saveGroupBy, validApp, workloadNamespaceOf } from '../utils/view';
import GroupHeader from './GroupHeader';
import InsightDetailsPanel, { type InsightTarget, type PanelTriage } from './InsightDetailsPanel';
import {
  buildInsightColumns,
  fittingInsightColumns,
  isGroupItem,
  sortInsightRows,
} from './InsightsTable';
import SeverityPills, { type SeverityPill } from './SeverityPills';
import type {
  ClusterInsightsQuery,
  InsightCategory,
  InsightGroup,
  InsightGroupBy,
  InsightKind,
  InsightGroupItem,
  InsightListItem,
  InsightRow,
  InsightSeverity,
  InsightsTab,
  InsightTriageFilter,
  TriageAction,
  TriageState,
} from '../models';

const P = INSIGHTS_UI.PAGE;
const K = CLUSTER_INSIGHTS.FILTER_KEYS;
const BULK_PERMISSION = ACTION_PERMISSIONS.insights.bulk;
const GROUP_ROW_PREFIX = 'group:';
const DEFAULT_SORT_COLUMN = 'SEVERITY';
const SEVERITIES: InsightSeverity[] = ['critical', 'warning', 'info'];

const options = <V extends string>(labels: Record<V, string>) =>
  (Object.keys(labels) as V[]).map((value) => ({ value, label: labels[value] }));

const list = (value: unknown): string[] | undefined =>
  Array.isArray(value) && value.length ? value.map(String) : undefined;

const text = (value: unknown): string | undefined =>
  typeof value === 'string' && value ? value : undefined;

const kindOptions = (kinds: InsightKind[]) =>
  kinds.map((value) => ({ value, label: INSIGHT_KIND_LABELS[value] }));

const toQuery = (
  category: InsightCategory,
  filters: Record<string, unknown>,
  q: string,
  app: string,
): ClusterInsightsQuery => ({
  category,
  kind: list(filters[K.KIND]),
  severity: list(filters[K.SEVERITY]),
  state: list(filters[K.STATE]),
  triage: text(filters[K.TRIAGE]) as InsightTriageFilter | undefined,
  namespace: list(filters[K.NAMESPACE]),
  environment: text(filters[K.ENVIRONMENT]),
  q: q || undefined,
  app: validApp(app) ? [app] : undefined,
});

const hasFilters = (filters: Record<string, unknown>, q: string): boolean =>
  Boolean(q) || Object.values(filters).some((v) => (Array.isArray(v) ? v.length > 0 : Boolean(v)));

const groupKeyOf = (row: InsightRow, groupBy: InsightGroupBy): string => {
  if (groupBy === 'namespace') return workloadNamespaceOf(row);
  if (groupBy === 'category') return row.kind;
  return `${row.namespace}/${row.app}`;
};

// Rows of a group stay together, groups ordered by their first row under the sort. Totals cover
// the whole filtered set, so a group split across pages reads the same on each.
const groupRows = (
  rows: InsightRow[],
  groupBy: InsightGroupBy,
): { rows: InsightRow[]; groups: Map<string, InsightGroup> } => {
  const buckets = new Map<string, InsightRow[]>();
  const groups = new Map<string, InsightGroup>();
  for (const row of rows) {
    const key = groupKeyOf(row, groupBy);
    const group = groups.get(key) ?? { key, total: 0, bySeverity: {}, namespaces: [] };
    group.total += 1;
    group.bySeverity[row.severity] = (group.bySeverity[row.severity] ?? 0) + 1;
    const namespace = workloadNamespaceOf(row);
    if (!group.namespaces.includes(namespace)) group.namespaces.push(namespace);
    groups.set(key, group);
    const bucket = buckets.get(key);
    if (bucket) bucket.push(row);
    else buckets.set(key, [row]);
  }
  return { rows: [...buckets.values()].flat(), groups };
};

// Several severities picked in the filter panel match no single pill.
const activePill = (severities: string[]): SeverityPill | null => {
  if (severities.length === 0) return 'all';
  return severities.length === 1 ? (severities[0] as InsightSeverity) : null;
};

const TRIAGE_AFTER: Record<TriageAction, TriageState | null> = {
  acknowledge: 'acknowledged',
  dismiss: 'dismissed',
  reopen: null,
};

interface PendingTriage {
  state: TriageState | null;
  until: number;
}

// The triage filter as the server applies it; no filter hides dismissed.
const triageShown = (filter: string | undefined, state: TriageState | null): boolean => {
  if (filter === 'all') return true;
  if (filter === 'untriaged') return state === null;
  if (filter === 'acknowledged' || filter === 'dismissed') return state === filter;
  return state !== 'dismissed';
};

const listItemKey = (item: InsightListItem): string =>
  isGroupItem(item) ? `${GROUP_ROW_PREFIX}${item.groupKey}` : insightRowKey(item);

const mutedStyle: React.CSSProperties = { fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED };

const EmptyInsights: React.FC<{
  category: InsightCategory;
  filtered: boolean;
  analyzerEnabled: boolean | undefined;
  // Undefined when the global config is unreadable: then "All clear" can't be claimed.
  autoAnalyze: boolean | undefined;
  indexedAt?: string;
}> = ({ category, filtered, analyzerEnabled, autoAnalyze, indexedAt }) => {
  if (filtered) return <Empty description={P.NO_MATCH} />;
  if (analyzerEnabled === false) {
    return (
      <Empty
        description={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            <strong>{P.ANALYZER_OFF_TITLE}</strong>
            <span style={mutedStyle}>{P.ANALYZER_OFF}</span>
            <Link
              to={CLUSTER_INSIGHTS.ANALYZER_SETTINGS_ROUTE}
              style={{ color: DEFAULT_COLORS.SUCCESS }}
            >
              {P.OPEN_SETTINGS}
            </Link>
          </div>
        }
      />
    );
  }
  if (autoAnalyze === false) {
    return (
      <Empty
        description={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
            <strong>{P.MANUAL_ANALYSIS_TITLE}</strong>
            <span style={mutedStyle}>{P.MANUAL_ANALYSIS}</span>
          </div>
        }
      />
    );
  }
  return (
    <Empty
      description={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          {autoAnalyze && <strong>{P.ALL_CLEAR_TITLE}</strong>}
          <span style={mutedStyle}>
            {category === 'incident' ? P.ALL_CLEAR_INCIDENTS : P.ALL_CLEAR_RECOMMENDATIONS}
          </span>
          {indexedAt ? (
            <span style={{ ...mutedStyle, display: 'inline-flex', gap: 4 }}>
              {P.CHECKED} <TimeAgo date={indexedAt} />
            </span>
          ) : null}
        </div>
      }
    />
  );
};

interface Props {
  tab: InsightsTab;
  // Hidden tabs stay mounted but ignore ?insight= and the panel keys.
  active: boolean;
  tabs: React.ReactNode;
  // Shown next to the ?app= chip; only set while ?app= names a valid application.
  appNote?: React.ReactNode;
  onChanged: () => void;
}

const ClusterInsightsView: React.FC<Props> = memo(({ tab, active, tabs, appNote, onChanged }) => {
  const category = INSIGHTS_TAB_CATEGORY[tab];
  const { message } = AntdApp.useApp();
  const [params, setSearchParams] = useSearchParams();
  const appFilter = params.get(CLUSTER_INSIGHTS.APP_PARAM) ?? '';
  const insightId = active ? (params.get(CLUSTER_INSIGHTS.INSIGHT_PARAM) ?? '') : '';
  const canBulk = usePermission(BULK_PERMISSION.scope, BULK_PERMISSION.level, BULK_PERMISSION.deny);
  const globalConfig = useSelector(selectGlobalConfigState).data;
  const configEnabled = globalConfig?.ai?.enabled;
  const autoAnalyze = globalConfig ? Boolean(globalConfig.ai?.autoAnalyze) : undefined;
  const [runtimeEnabled, setRuntimeEnabled] = useState<boolean>();
  const analyzerEnabled = configEnabled ?? runtimeEnabled;
  const { categories: environments } = useCategories(CC.SCOPES.PLAN_ENVIRONMENTS);
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const { sortKey, sortOrder, handleSort } = useSortState({
    defaultSortKey: DEFAULT_SORT_COLUMN,
    defaultSortOrder: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(CLUSTER_INSIGHTS.PAGE_SIZE);
  const [groupBy, setGroupBy] = useState<InsightGroupBy>(loadGroupBy);
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set());
  const [bulkRequested, setBulkMode] = useState(false);
  // Permissions are polled: a demotion mid-selection hides the bulk UI too.
  const bulkMode = bulkRequested && canBulk;
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [bulkPending, setBulkPending] = useState(false);
  // Where an insight opened from outside the page (a cold link, another finding) lives.
  const [known, setKnown] = useState<
    Record<string, { namespace: string; app: string; category?: InsightCategory }>
  >({});

  useEffect(() => {
    let canceled = false;
    fetchInsightNamespaces()
      .then((all) => !canceled && setNamespaces(all))
      .catch(() => undefined);
    return () => {
      canceled = true;
    };
  }, []);

  // Without settings read the GlobalConfig is unreadable; the analyzer runtime says whether it is on.
  useEffect(() => {
    if (configEnabled !== undefined) return undefined;
    let canceled = false;
    fetchAnalyzerRuntime()
      .then((runtime) => !canceled && setRuntimeEnabled(runtime.enabled))
      .catch((error: unknown) =>
        logger.error(INSIGHTS_ERROR_MESSAGES.CLIENT.RUNTIME_FETCH_FAILED, error),
      );
    return () => {
      canceled = true;
    };
  }, [configEnabled]);

  // One request per pause in typing, not per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(search.trim());
      setCurrentPage(1);
    }, CLUSTER_INSIGHTS.SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Sort, page and Group by stay local: the query reads the tab's whole filtered set.
  const query = useMemo(
    () => toQuery(category, filters, q, appFilter),
    [category, filters, q, appFilter],
  );
  const { page, receivedAt, loading, error, refresh } = useClusterInsights(query, active);
  // Triage the analyzer accepted but the list index has not picked up yet (its next refresh);
  // applied until the list agrees or a page arrives TRIAGE_PENDING_MS later (the analyzer may
  // have cleared it meanwhile).
  const [triaged, setTriaged] = useState<ReadonlyMap<string, PendingTriage>>(() => new Map());
  const items = useMemo(() => {
    const rows = page?.items ?? [];
    if (triaged.size === 0) return rows;
    return rows.flatMap((r) => {
      const pending = triaged.get(insightRowKey(r));
      if (!pending || receivedAt >= pending.until) return [r];
      const { state } = pending;
      if ((r.triage?.state ?? null) === state) return [r];
      if (!triageShown(query.triage, state)) return [];
      const triage = state ? { state, by: r.triage?.by ?? '', at: r.triage?.at ?? '' } : undefined;
      return [{ ...r, triage }];
    });
  }, [page, receivedAt, triaged, query.triage]);
  const markTriaged = useCallback((keys: string[], action: TriageAction) => {
    const now = Date.now();
    const until = now + CLUSTER_INSIGHTS.TRIAGE_PENDING_MS;
    setTriaged((prev) => {
      const next = new Map([...prev].filter(([, pending]) => pending.until > now));
      for (const key of keys) next.set(key, { state: TRIAGE_AFTER[action], until });
      return next;
    });
  }, []);

  const changed = useCallback(() => {
    refresh();
    onChanged();
  }, [refresh, onChanged]);

  const onSort = useCallback(
    (key: string) => {
      handleSort(key);
      setCurrentPage(1);
    },
    [handleSort],
  );

  const sortedRows = useMemo(
    () => sortInsightRows(items, sortKey, sortOrder),
    [items, sortKey, sortOrder],
  );
  const grouped = useMemo(
    () =>
      groupBy === 'none' ? { rows: sortedRows, groups: null } : groupRows(sortedRows, groupBy),
    [sortedRows, groupBy],
  );
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return grouped.rows.slice(start, start + pageSize);
  }, [grouped, currentPage, pageSize]);

  const applyFilters = useCallback((next: Record<string, unknown>) => {
    setFilters(next);
    setCurrentPage(1);
  }, []);

  const setParam = useCallback(
    (key: string, value: string | null, replace = false) =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace },
      ),
    [setSearchParams],
  );

  // Collapsed groups keep only their header.
  const listItems: InsightListItem[] = useMemo(() => {
    const { groups } = grouped;
    if (!groups) return pageRows;
    const out: InsightListItem[] = [];
    let last = '';
    for (const row of pageRows) {
      const key = groupKeyOf(row, groupBy);
      if (key !== last) {
        const group = groups.get(key) ?? { key, total: 0, bySeverity: {}, namespaces: [] };
        out.push({ groupKey: key, group, collapsed: collapsed.has(key) });
        last = key;
      }
      if (!collapsed.has(key)) out.push(row);
    }
    return out;
  }, [grouped, pageRows, groupBy, collapsed]);

  const visibleRows = useMemo(
    () => listItems.filter((item): item is InsightRow => !isGroupItem(item)),
    [listItems],
  );

  const renderGroup = useCallback(
    (item: InsightGroupItem) => <GroupHeader item={item} groupBy={groupBy} />,
    [groupBy],
  );

  const environmentNames = useMemo(
    () => Object.fromEntries(environments.map((e) => [e.id, e.name])),
    [environments],
  );
  const columns = useMemo(
    () =>
      buildInsightColumns({
        category,
        visible: fittingInsightColumns(width),
        environmentNames,
        activeSortKey: sortKey ?? '',
        onSort,
        renderGroup,
      }),
    [category, width, environmentNames, sortKey, onSort, renderGroup],
  );

  // Panel target: the row on screen, or a location learned from a lookup or another finding.
  const index = insightId ? visibleRows.findIndex((r) => r.id === insightId) : -1;
  const target: InsightTarget | null = useMemo(() => {
    if (!insightId) return null;
    const row = items.find((r) => r.id === insightId);
    if (row) return { id: insightId, namespace: row.namespace, app: row.app, row };
    const where = known[insightId];
    return where ? { id: insightId, ...where } : null;
  }, [insightId, items, known]);

  // A link to the other category's insight opens that tab, which then shows the panel.
  const onOtherTab = useCallback(
    () =>
      setParam(CLUSTER_INSIGHTS.TAB_PARAM, tab === 'incidents' ? 'recommendations' : null, true),
    [setParam, tab],
  );

  // A cold link to an insight not on this page: one lookup by id finds its application.
  const pageLoaded = page !== null;
  const hasTarget = target !== null;
  useEffect(() => {
    if (!insightId || hasTarget || !pageLoaded) return undefined;
    let canceled = false;
    fetchClusterInsights(
      {
        id: [insightId],
        state: ALL_INSIGHT_STATES,
        triage: 'all',
        page: 1,
        pageSize: 1,
      },
      '',
    )
      .then((read) => {
        if (canceled) return;
        const row = read.kind === 'page' ? read.page.items[0] : undefined;
        if (!row) setParam(CLUSTER_INSIGHTS.INSIGHT_PARAM, null, true);
        else if ((row.category || 'incident') !== category) onOtherTab();
        else
          setKnown((prev) => ({ ...prev, [row.id]: { namespace: row.namespace, app: row.app } }));
      })
      .catch(() => undefined);
    return () => {
      canceled = true;
    };
  }, [insightId, hasTarget, pageLoaded, setParam, category, onOtherTab]);

  const panelChanged = useCallback(
    (done?: PanelTriage) => {
      if (done && target) {
        markTriaged([`${target.namespace}/${target.app}/${done.id}`], done.action);
      }
      changed();
    },
    [target, markTriaged, changed],
  );

  const openInsight = useCallback(
    (id: string, replace = false) => setParam(CLUSTER_INSIGHTS.INSIGHT_PARAM, id, replace),
    [setParam],
  );
  const closePanel = useCallback(() => setParam(CLUSTER_INSIGHTS.INSIGHT_PARAM, null), [setParam]);
  const selectFinding = useCallback(
    (id: string, namespace: string, app: string, findingCategory: InsightCategory) => {
      setKnown((prev) => ({ ...prev, [id]: { namespace, app, category: findingCategory } }));
      openInsight(id, true);
    },
    [openInsight],
  );
  // A key pressed again before the re-render steps from the row it just opened, not the old one.
  const nav = useRef({ rows: visibleRows, id: insightId });
  useLayoutEffect(() => {
    nav.current = { rows: visibleRows, id: insightId };
  }, [visibleRows, insightId]);
  const step = useCallback(
    (delta: number) => {
      const { rows, id } = nav.current;
      const at = rows.findIndex((r) => r.id === id);
      const next = at < 0 ? undefined : rows[at + delta];
      if (!next) return;
      nav.current = { rows, id: next.id };
      openInsight(next.id, true);
    },
    [openInsight],
  );
  const onPrevious = index > 0 ? () => step(-1) : undefined;
  const onNext = index >= 0 && index < visibleRows.length - 1 ? () => step(1) : undefined;

  const onRowClick = useCallback(
    (item: InsightListItem) => {
      if (!isGroupItem(item)) {
        openInsight(item.id);
        return;
      }
      setCollapsed((prev) => {
        const next = new Set(prev);
        if (!next.delete(item.groupKey)) next.add(item.groupKey);
        return next;
      });
    },
    [openInsight],
  );

  // Only rows still on screen count: a new page or filter drops the rest.
  const selectedRows = useMemo(() => {
    const keys = new Set(selectedKeys);
    return visibleRows.filter((r) => keys.has(insightRowKey(r)));
  }, [selectedKeys, visibleRows]);

  const bulkTriage = useCallback(
    async (action: TriageAction): Promise<void> => {
      const eligible = selectedRows.filter((r) => triageActions(r).includes(action));
      setBulkPending(true);
      const results = await Promise.allSettled(
        eligible.map((r) => triageInsight(r.namespace, r.app, r.id, action)),
      );
      setBulkPending(false);
      markTriaged(
        results.flatMap((r, i) => (r.status === 'fulfilled' ? [insightRowKey(eligible[i])] : [])),
        action,
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      const parts = [P.BULK_DONE.replace('{done}', String(eligible.length - failed))];
      const skipped = selectedRows.length - eligible.length;
      if (skipped) parts.push(P.BULK_SKIPPED.replace('{skipped}', String(skipped)));
      if (failed) parts.push(P.BULK_FAILED.replace('{failed}', String(failed)));
      void (failed ? message.warning(parts.join(' · ')) : message.success(parts.join(' · ')));
      setSelectedKeys([]);
      changed();
    },
    [selectedRows, message, changed, markTriaged],
  );

  const filterFields: FilterField[] = useMemo(() => {
    const incidents = category === 'incident';
    const fields: (FilterField | false)[] = [
      {
        key: K.SEVERITY,
        label: P.FILTER.BY_SEVERITY,
        type: 'multiSelect',
        multiSelectOptions: options(INSIGHT_SEVERITY_LABELS),
      },
      {
        key: K.STATE,
        label: P.FILTER.BY_STATE,
        type: 'multiSelect',
        multiSelectOptions: options(INSIGHT_ROW_STATE_LABELS),
      },
      {
        key: K.KIND,
        label: incidents ? P.FILTER.BY_KIND : P.FILTER.BY_FAMILY,
        type: 'multiSelect',
        multiSelectOptions: kindOptions(incidents ? INCIDENT_KINDS : RECOMMENDATION_KINDS),
      },
      !incidents && {
        key: K.TRIAGE,
        label: P.FILTER.BY_TRIAGE,
        type: 'dropdown',
        dropdownOptions: [
          { value: '', label: P.TRIAGE.DEFAULT },
          ...options(INSIGHT_TRIAGE_FILTER_LABELS),
        ],
      },
      {
        key: K.NAMESPACE,
        label: P.FILTER.BY_NAMESPACE,
        type: 'multiSelect',
        multiSelectOptions: namespaces.map((n) => ({ value: n, label: n })),
      },
      {
        key: K.ENVIRONMENT,
        label: P.FILTER.BY_ENVIRONMENT,
        type: 'dropdown',
        dropdownOptions: [
          { value: '', label: P.FILTER.ANY },
          ...environments.map((e) => ({ value: e.id, label: e.name })),
        ],
      },
    ];
    return fields.filter((f): f is FilterField => f !== false);
  }, [category, namespaces, environments]);

  const activeSeverity = activePill(list(filters[K.SEVERITY]) ?? []);
  const facet = page?.counts.severityFacet ?? page?.counts.bySeverity;
  const severityCounts: Record<SeverityPill, number | undefined> = {
    all: facet ? SEVERITIES.reduce((sum, s) => sum + (facet[s] ?? 0), 0) : undefined,
    critical: facet ? (facet.critical ?? 0) : undefined,
    warning: facet ? (facet.warning ?? 0) : undefined,
    info: facet ? (facet.info ?? 0) : undefined,
  };

  const total = items.length;
  const filtered = hasFilters(filters, q) || validApp(appFilter);

  const config: PageLayoutConfig<InsightListItem> = {
    title: P.TITLE,
    subtitle: P.SUBTITLE,
    tabs: (
      <div
        ref={ref}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
      >
        {tabs}
        {page && page.total > page.items.length ? (
          <span style={mutedStyle}>
            {P.CAPPED.replace('{shown}', String(page.items.length)).replace(
              '{total}',
              String(page.total),
            )}
          </span>
        ) : null}
      </div>
    ),
    listToolbar: {
      totalCount: page ? total : undefined,
      countSuffix: category === 'incident' ? P.INCIDENTS_SUFFIX : P.RECOMMENDATIONS_SUFFIX,
      compactWidth: validApp(appFilter)
        ? CLUSTER_INSIGHTS.TOOLBAR_COMPACT_WIDTH_APP
        : CLUSTER_INSIGHTS.TOOLBAR_COMPACT_WIDTH,
      onOpenFilters: () => setFilterPanelOpen(true),
      filterChips: validApp(appFilter)
        ? [
            {
              key: CLUSTER_INSIGHTS.APP_PARAM,
              value: appFilter,
              label: `${P.APP_CHIP}: ${appFilter}`,
            },
          ]
        : [],
      filterNote: appNote,
      onRemoveFilterChip: () => {
        setParam(CLUSTER_INSIGHTS.APP_PARAM, null);
        setCurrentPage(1);
      },
      bulkMode,
      selection: { pageCount: visibleRows.length, selectedCount: selectedRows.length },
      bulkActions: {
        buttons: [
          {
            key: 'bulkAcknowledge',
            iconOnly: true,
            label: P.BULK_ACKNOWLEDGE,
            icon: <CheckOutlined />,
            variant: 'default',
            loading: bulkPending,
            disabled: selectedRows.length === 0 || bulkPending,
            onClick: () => void bulkTriage('acknowledge'),
          },
          // Incidents cannot be dismissed.
          ...(category === 'incident'
            ? []
            : [
                {
                  key: 'bulkDismiss',
                  iconOnly: true,
                  label: P.BULK_DISMISS,
                  icon: <EyeInvisibleOutlined />,
                  variant: 'default' as const,
                  loading: bulkPending,
                  disabled: selectedRows.length === 0 || bulkPending,
                  onClick: () => void bulkTriage('dismiss'),
                },
              ]),
          {
            key: 'bulkReopen',
            iconOnly: true,
            label: P.BULK_REOPEN,
            icon: <UndoOutlined />,
            variant: 'default',
            loading: bulkPending,
            disabled: selectedRows.length === 0 || bulkPending,
            onClick: () => void bulkTriage('reopen'),
          },
        ],
      },
      quickFilter: (compact) => (
        <SeverityPills
          active={activeSeverity}
          counts={severityCounts}
          compact={compact}
          onChange={(pill) =>
            applyFilters({ ...filters, [K.SEVERITY]: pill === 'all' ? [] : [pill] })
          }
        />
      ),
      toolbars: [
        {
          search: { placeholder: P.SEARCH_PLACEHOLDER, value: search, onChange: setSearch },
          buttons: [
            { key: 'search', label: P.SEARCH_BUTTON, icon: <SearchOutlined />, variant: 'ghost' },
            {
              key: 'group',
              label: `${P.GROUP_BY}: ${INSIGHT_GROUP_BY_LABELS[groupBy]}`,
              icon: <GroupOutlined />,
              variant: 'ghost',
              active: groupBy !== 'none',
              dropdown: {
                items: options(INSIGHT_GROUP_BY_LABELS).map(({ value, label }) => ({
                  key: value,
                  label,
                })),
                selectedKeys: [groupBy],
                onItemClick: (key) => {
                  const next = options(INSIGHT_GROUP_BY_LABELS).find((o) => o.value === key);
                  if (!next) return;
                  setGroupBy(next.value);
                  saveGroupBy(next.value);
                  setCollapsed(new Set());
                  setCurrentPage(1);
                },
              },
            },
            {
              key: 'select',
              label: bulkMode ? P.SELECT_ACTIVE : P.SELECT,
              icon: <CheckSquareOutlined />,
              variant: 'ghost',
              iconOnly: !bulkMode,
              active: bulkMode,
              disabled: !canBulk,
              tooltip: canBulk ? undefined : P.BULK_NOT_ALLOWED,
              onClick: () => {
                setBulkMode((on) => !on);
                setSelectedKeys([]);
              },
            },
            {
              key: 'refresh',
              label: P.REFRESH,
              icon: <ReloadOutlined />,
              variant: 'default',
              iconOnly: true,
              onClick: refresh,
            },
          ],
        },
      ],
    },
    columns,
    data: listItems,
    rowKey: listItemKey,
    rowSelection: bulkMode
      ? {
          selectedRowKeys: selectedKeys,
          onChange: (keys) =>
            setSelectedKeys(keys.filter((k) => !String(k).startsWith(GROUP_ROW_PREFIX))),
          getCheckboxProps: (item) =>
            isGroupItem(item) ? { disabled: true, style: { display: 'none' } } : {},
        }
      : undefined,
    onRowClick,
    pagination: {
      currentPage,
      pageSize,
      total,
      onPageChange: (next) => {
        setCurrentPage(next);
        setSelectedKeys([]);
      },
      onPageSizeChange: (size) => {
        setPageSize(size);
        setCurrentPage(1);
        setSelectedKeys([]);
      },
      pageSizeOptions: [...CLUSTER_INSIGHTS.PAGE_SIZE_OPTIONS],
    },
    empty: (
      <EmptyInsights
        category={category}
        filtered={filtered}
        analyzerEnabled={analyzerEnabled}
        autoAnalyze={autoAnalyze}
        indexedAt={page?.indexedAt}
      />
    ),
    loading,
    error,
    onRetry: refresh,
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
      <InsightDetailsPanel
        target={target}
        category={category}
        position={index >= 0 ? { index, total: visibleRows.length } : null}
        onPrevious={onPrevious}
        onNext={onNext}
        onClose={closePanel}
        onSelect={selectFinding}
        onChanged={panelChanged}
      />
    </>
  );
});

ClusterInsightsView.displayName = 'ClusterInsightsView';

export default ClusterInsightsView;
