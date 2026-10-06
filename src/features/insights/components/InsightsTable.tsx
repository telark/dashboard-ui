import React, { memo } from 'react';
import type { TableColumnType } from 'antd';
import {
  AiOutlineAlert,
  AiOutlineBulb,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineCloud,
  AiOutlineFlag,
  AiOutlineFolder,
  AiOutlineTag,
  AiOutlineWarning,
} from 'react-icons/ai';
import { DEFAULT_COLORS, EMPTY_VALUE, Icons } from '../../../constants';
import RowTag from '../../../components/display/table/RowTag';
import { generateColumn } from '../../../components/display/table/utils';
import TimeAgo from '../../../components/display/time/TimeAgo';
import { INSIGHTS_UI } from '../constants/texts';
import {
  CLUSTER_INSIGHTS,
  INSIGHT_KIND_LABELS,
  INSIGHT_ROW_STATE_LABELS,
  INSIGHT_SEVERITY_LABELS,
  SEVERITY_COLORS,
  SEVERITY_RANK,
} from '../constants/insights';
import { sortData, type SortFieldConfig, type SortOrder } from '../../../utils/layout/sort';
import { toTimestamp } from '../../../utils/shared/time';
import { workloadNamespaceOf } from '../utils/view';
import type {
  InsightCategory,
  InsightGroupItem,
  InsightListItem,
  InsightRow,
  InsightRowState,
  TriageState,
} from '../models';

export type InsightColumnKey = keyof typeof CLUSTER_INSIGHTS.COLUMN_WIDTHS;

const W = CLUSTER_INSIGHTS.COLUMN_WIDTHS;
const C = INSIGHTS_UI.PAGE.COLUMNS;
// Lowest priority last: dropped first when the table runs out of room.
const OPTIONAL_COLUMNS: InsightColumnKey[] = [
  'NAMESPACE',
  'STATE',
  'TRIAGE',
  'KIND',
  'ENVIRONMENT',
];
const REQUIRED_WIDTH = W.SEVERITY + W.TITLE + W.APPLICATION + W.LAST_SEEN;

const mutedStyle: React.CSSProperties = { fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED };
const primaryStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
};

export const isGroupItem = (item: InsightListItem): item is InsightGroupItem => 'groupKey' in item;

// Width 0 (not measured yet, or a hidden tab) shows every column.
export const fittingInsightColumns = (available: number): Set<InsightColumnKey> => {
  const fitting = new Set<InsightColumnKey>();
  let used = REQUIRED_WIDTH;
  for (const key of OPTIONAL_COLUMNS) {
    used += W[key];
    if (available > 0 && used > available) break;
    fitting.add(key);
  }
  return fitting;
};

const tag = (text: string, accent?: string): React.ReactNode => (
  <RowTag
    key={text}
    text={text}
    accent={accent}
    fontSize={CLUSTER_INSIGHTS.CHIP_FONT}
    capitalize={false}
  />
);

// One line each, cut with an ellipsis: a long title never widens the table (full text on hover).
const oneLine: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

// The table sizes to max-content: width 0 keeps the text out of that measure, so the title column
// only takes what the other columns leave (never under TITLE_MIN_PX, the table scrolls instead).
const titleCellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  width: 0,
  minWidth: `max(100%, ${CLUSTER_INSIGHTS.TITLE_MIN_PX}px)`,
};

const TitleCell: React.FC<{ row: InsightRow }> = memo(({ row }) => (
  <div style={titleCellStyle}>
    <span style={{ ...primaryStyle, ...oneLine }} title={row.title}>
      {row.title}
    </span>
    <span style={{ ...mutedStyle, ...oneLine }} title={row.subject}>
      {row.subject}
    </span>
  </div>
));
TitleCell.displayName = 'InsightTitleCell';

export const insightRowState = (row: Pick<InsightRow, 'stale' | 'status'>): InsightRowState =>
  row.stale && row.status !== 'resolved' ? 'stale' : row.status;

const STATE_COLORS: Record<InsightRowState, string> = {
  open: DEFAULT_COLORS.DANGER,
  updated: DEFAULT_COLORS.WARNING,
  stale: DEFAULT_COLORS.TEXT_MUTED,
  resolved: DEFAULT_COLORS.SUCCESS,
};

// Lifecycle order: what still needs attention before what is fading or done.
const STATE_RANK: Record<InsightRowState, number> = { open: 0, updated: 1, stale: 2, resolved: 3 };

// Untriaged first: what nobody has looked at yet.
const TRIAGE_RANK: Record<TriageState, number> = { acknowledged: 1, dismissed: 2 };
const TRIAGE_LABELS: Record<TriageState, string> = {
  acknowledged: INSIGHTS_UI.ACKNOWLEDGED,
  dismissed: INSIGHTS_UI.DISMISSED,
};

const INSIGHT_SORT_FIELDS: SortFieldConfig<InsightRow>[] = [
  { key: 'SEVERITY', type: 'number', getValue: (r) => SEVERITY_RANK[r.severity] },
  { key: 'TITLE', type: 'string', getValue: (r) => r.title },
  { key: 'APPLICATION', type: 'string', getValue: (r) => r.app },
  { key: 'NAMESPACE', type: 'string', getValue: workloadNamespaceOf },
  { key: 'KIND', type: 'string', getValue: (r) => INSIGHT_KIND_LABELS[r.kind] ?? r.kind },
  { key: 'STATE', type: 'number', getValue: (r) => STATE_RANK[insightRowState(r)] },
  { key: 'TRIAGE', type: 'number', getValue: (r) => (r.triage ? TRIAGE_RANK[r.triage.state] : 0) },
  { key: 'LAST_SEEN', type: 'date', getValue: (r) => r.lastSeenAt },
];

const isSortable = (key: InsightColumnKey): boolean =>
  INSIGHT_SORT_FIELDS.some((field) => field.key === key);

const mostUrgentFirst = (a: InsightRow, b: InsightRow): number =>
  SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] ||
  toTimestamp(b.lastSeenAt) - toTimestamp(a.lastSeenAt);

// sortData is stable, so rows equal on the sorted column keep the most urgent first either way.
export const sortInsightRows = (
  rows: InsightRow[],
  sortKey: string | null,
  sortOrder: SortOrder,
): InsightRow[] =>
  sortData([...rows].sort(mostUrgentFirst), sortKey, sortOrder, INSIGHT_SORT_FIELDS);

const chips = (nodes: React.ReactNode[]): React.ReactNode => (
  <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4 }}>{nodes}</div>
);

interface ColumnSpec {
  key: InsightColumnKey;
  label: string;
  icon: React.ReactNode;
  render: (row: InsightRow) => React.ReactNode;
}

interface BuildArgs {
  category: InsightCategory;
  visible: Set<InsightColumnKey>;
  environmentNames: Record<string, string>;
  activeSortKey: string;
  onSort: (key: string) => void;
  renderGroup: (item: InsightGroupItem) => React.ReactNode;
}

export const buildInsightColumns = ({
  category,
  visible,
  environmentNames,
  activeSortKey,
  onSort,
  renderGroup,
}: BuildArgs): TableColumnType<InsightListItem>[] => {
  const recommendations = category === 'recommendation';
  const specs: ColumnSpec[] = [
    {
      key: 'TITLE',
      label: C.TITLE,
      icon: recommendations ? <AiOutlineBulb /> : <AiOutlineAlert />,
      render: (r) => <TitleCell row={r} />,
    },
    {
      key: 'SEVERITY',
      label: C.SEVERITY,
      icon: <AiOutlineWarning />,
      render: (r) => tag(INSIGHT_SEVERITY_LABELS[r.severity], SEVERITY_COLORS[r.severity]),
    },
    {
      key: 'APPLICATION',
      label: C.APPLICATION,
      icon: <Icons.Application />,
      render: (r) => <span style={primaryStyle}>{r.app}</span>,
    },
    {
      key: 'NAMESPACE',
      label: C.NAMESPACE,
      icon: <AiOutlineFolder />,
      render: (r) => <span style={mutedStyle}>{workloadNamespaceOf(r)}</span>,
    },
    {
      key: 'KIND',
      label: recommendations ? C.FAMILY : C.KIND,
      icon: <AiOutlineTag />,
      render: (r) => tag(INSIGHT_KIND_LABELS[r.kind] ?? r.kind),
    },
    {
      key: 'STATE',
      label: C.STATE,
      icon: <AiOutlineCheckCircle />,
      render: (r) => {
        const state = insightRowState(r);
        return tag(INSIGHT_ROW_STATE_LABELS[state], STATE_COLORS[state]);
      },
    },
    {
      key: 'TRIAGE',
      label: C.TRIAGE,
      icon: <AiOutlineFlag />,
      render: (r) =>
        r.triage ? (
          tag(TRIAGE_LABELS[r.triage.state])
        ) : (
          <span style={mutedStyle}>{EMPTY_VALUE}</span>
        ),
    },
    {
      key: 'ENVIRONMENT',
      label: C.ENVIRONMENT,
      icon: <AiOutlineCloud />,
      render: (r) =>
        r.environments?.length ? (
          chips(r.environments.map((id) => tag(environmentNames[id] ?? id)))
        ) : (
          <span style={mutedStyle}>{EMPTY_VALUE}</span>
        ),
    },
    {
      key: 'LAST_SEEN',
      label: C.LAST_SEEN,
      icon: <AiOutlineClockCircle />,
      render: (r) => <TimeAgo date={r.lastSeenAt} />,
    },
  ];
  const shown = specs.filter(({ key }) => !OPTIONAL_COLUMNS.includes(key) || visible.has(key));
  const ctx = { activeSortKey, onSort };
  // Like the other tables: the title column is left-aligned, the rest centered. A group
  // header spans the whole row from the first column.
  return shown.map(({ key, label, icon, render }, index) => ({
    ...generateColumn(
      {
        key,
        label,
        icon,
        align: key === 'TITLE' ? 'left' : undefined,
        // The title takes whatever the fixed-width columns leave.
        width: key === 'TITLE' ? undefined : W[key],
        sortable: isSortable(key),
        render: (_: unknown, item: InsightListItem) => {
          if (!isGroupItem(item)) return render(item);
          return index === 0 ? renderGroup(item) : null;
        },
      },
      ctx,
    ),
    // Any ellipsis column makes antd lay the table out fixed, so content never resizes columns.
    ellipsis: key === 'TITLE',
    onCell: (item: InsightListItem) =>
      isGroupItem(item) ? { colSpan: index === 0 ? shown.length : 0 } : {},
  }));
};
