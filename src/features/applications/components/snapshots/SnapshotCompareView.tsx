import React, { memo, useMemo } from 'react';
import { Skeleton } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { DEFAULT_COLORS, getPillSurface } from '../../../../constants';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import { PanelEmptyState } from '../../../../components/display/panels/shared';
import { pluralize } from '../../../../utils/helpers/format';
import {
  cardStyle,
  Fact,
  labelStyle,
  mutedStyle,
  oneLine,
  textStyle,
  tilesStyle,
} from '../../../insights';
import type { ApplicationSnapshotSummary, SnapshotManifestState } from '../../models';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_TRACKING_ANNOTATION_PREFIX } from '../../constants/applications';
import SnapshotMetaChip from './SnapshotMetaChip';
import { getApplicationSeverityAccentColor } from '../../utils/healthVisual';

type DiffType = 'add' | 'remove' | 'change';
type Path = string[];

type ResourceMeta = { kind: string; name: string };
type ResourceDoc = { key: string; meta: ResourceMeta; value: unknown };

type DiffRow = {
  path: Path;
  type: DiffType;
  oldValue?: unknown;
  newValue?: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

function stringifyValue(v: unknown): string {
  if (v == null) return APPLICATIONS_UI.FALLBACKS.EMPTY;
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function isEqualValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }
  if (!isRecord(a) || !isRecord(b)) return false;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function extractResourceMeta(obj: Record<string, unknown>): ResourceMeta {
  const kind = typeof obj.kind === 'string' && obj.kind.trim() ? obj.kind.trim() : 'Resource';
  const meta = isRecord(obj.metadata) ? obj.metadata : undefined;
  const name =
    meta && typeof meta.name === 'string' && meta.name.trim() ? meta.name.trim() : 'unknown';
  return { kind, name };
}

function resourceKey(meta: ResourceMeta): string {
  return `${meta.kind}/${meta.name}`;
}

function normalizeManifestToResources(data: unknown): ResourceDoc[] {
  if (data == null) return [];
  if (Array.isArray(data)) {
    return data
      .filter((d) => isRecord(d))
      .map((d) => {
        const meta = extractResourceMeta(d);
        return { key: resourceKey(meta), meta, value: d };
      });
  }
  if (isRecord(data) && Array.isArray(data.items)) {
    return (data.items as unknown[])
      .filter((d) => isRecord(d))
      .map((d) => {
        const meta = extractResourceMeta(d);
        return { key: resourceKey(meta), meta, value: d };
      });
  }
  if (isRecord(data)) {
    const meta = extractResourceMeta(data);
    return [{ key: resourceKey(meta), meta, value: data }];
  }
  return [];
}

function diffUnknown(oldV: unknown, newV: unknown, path: Path, out: DiffRow[]): void {
  if (oldV === undefined && newV === undefined) return;
  if (path.join('.').startsWith(APPLICATION_TRACKING_ANNOTATION_PREFIX)) return;
  if (oldV === undefined) {
    out.push({ path, type: 'add', newValue: newV });
    return;
  }
  if (newV === undefined) {
    out.push({ path, type: 'remove', oldValue: oldV });
    return;
  }
  if (isEqualValue(oldV, newV)) return;
  if (Array.isArray(oldV) || Array.isArray(newV)) {
    out.push({ path, type: 'change', oldValue: oldV, newValue: newV });
    return;
  }
  if (!isRecord(oldV) || !isRecord(newV)) {
    out.push({ path, type: 'change', oldValue: oldV, newValue: newV });
    return;
  }
  const keys = new Set<string>([...Object.keys(oldV), ...Object.keys(newV)]);
  for (const k of keys) {
    diffUnknown(oldV[k], newV[k], [...path, k], out);
  }
}

function formatPath(path: Path): string {
  if (path.length === 0) return 'value';
  if (path[0] === 'spec' && path[1] === 'replicas') return 'replicas';
  if (path[0] === 'metadata' && (path[1] === 'annotations' || path[1] === 'labels')) {
    return path.slice(1).join(' / ');
  }
  if (path[0] === 'metadata') return path.slice(1).join(' / ');
  if (path[0] === 'spec') return path.slice(1).join(' / ');
  return path.join(' / ');
}

function buildDiffByResource(
  older: unknown,
  newer: unknown,
): Array<{ meta: ResourceMeta; rows: DiffRow[] }> {
  const oldRes = normalizeManifestToResources(older);
  const newRes = normalizeManifestToResources(newer);
  const oldMap = new Map<string, ResourceDoc>(oldRes.map((r) => [r.key, r]));
  const newMap = new Map<string, ResourceDoc>(newRes.map((r) => [r.key, r]));
  const keys = new Set<string>([...oldMap.keys(), ...newMap.keys()]);
  const groups: Array<{ meta: ResourceMeta; rows: DiffRow[] }> = [];

  for (const key of keys) {
    const oldDoc = oldMap.get(key);
    const newDoc = newMap.get(key);
    const meta = oldDoc?.meta ?? newDoc?.meta ?? { kind: 'Resource', name: 'unknown' };
    const rows: DiffRow[] = [];
    diffUnknown(oldDoc?.value, newDoc?.value, [], rows);
    if (rows.length > 0) {
      groups.push({ meta, rows });
    }
  }

  groups.sort((a, b) => {
    const ak = `${a.meta.kind}/${a.meta.name}`;
    const bk = `${b.meta.kind}/${b.meta.name}`;
    return ak.localeCompare(bk);
  });
  return groups;
}

export interface SnapshotCompareViewProps {
  left: ApplicationSnapshotSummary;
  right: ApplicationSnapshotSummary;
  leftState: SnapshotManifestState | undefined;
  rightState: SnapshotManifestState | undefined;
  onBack: () => void;
}

const statsStyle: React.CSSProperties = {
  ...tilesStyle,
  gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))',
};

const dotStyle = (color: string): React.CSSProperties => ({
  width: 6,
  height: 6,
  flexShrink: 0,
  borderRadius: '50%',
  background: color,
});

const DIFF_TONE = {
  add: DEFAULT_COLORS.SUCCESS,
  remove: DEFAULT_COLORS.DANGER,
  change: DEFAULT_COLORS.WARNING,
} as const;

const ValueChip: React.FC<{ tone: DiffType; children: React.ReactNode }> = ({ tone, children }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: 6,
      ...getPillSurface(DIFF_TONE[tone]),
      fontSize: 12,
      fontWeight: 700,
      lineHeight: 1.4,
      wordBreak: 'break-word',
      maxWidth: '100%',
    }}
  >
    {children}
  </span>
);

const SnapshotSide: React.FC<{ label: string; snap: ApplicationSnapshotSummary }> = ({
  label,
  snap,
}) => {
  const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
  return (
    <div style={{ ...cardStyle, padding: 16, minWidth: 0 }}>
      <div style={labelStyle}>{label}</div>
      <div
        style={{
          marginTop: 4,
          fontSize: 17,
          fontWeight: 700,
          color: DEFAULT_COLORS.TEXT_ON_SURFACE,
          whiteSpace: 'nowrap',
        }}
      >
        {ui.GENERATION} {snap.generation}
      </div>
      <div
        style={{
          marginTop: 8,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
          minWidth: 0,
        }}
      >
        <SnapshotMetaChip>{snap.id}</SnapshotMetaChip>
        {snap.severity ? (
          <SnapshotMetaChip>
            <span style={dotStyle(getApplicationSeverityAccentColor(snap.severity))} />
            {snap.severity}
          </SnapshotMetaChip>
        ) : null}
        <span style={mutedStyle}>
          {snap.takenAt ? <TimeAgo date={snap.takenAt} /> : APPLICATIONS_UI.FALLBACKS.EMPTY}
        </span>
      </div>
    </div>
  );
};

const StatTile: React.FC<{ value: number; label: string; accent?: string }> = ({
  value,
  label,
  accent,
}) => (
  <Fact label={label}>
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
      {accent ? <span style={dotStyle(accent)} /> : null}
      {value}
    </span>
  </Fact>
);

const SECRET_KIND = 'Secret';
const SECRET_VALUE_ROOTS = ['data', 'stringData'];

const DiffRowView: React.FC<{ row: DiffRow; kind: string }> = ({ row, kind }) => {
  const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
  const redacted = kind === SECRET_KIND && SECRET_VALUE_ROOTS.includes(row.path[0] ?? '');
  const show = (v: unknown) => (redacted ? ui.COMPARE_REDACTED : stringifyValue(v));
  if (row.path.length === 0 && row.type !== 'change') {
    return (
      <div
        style={{
          padding: '8px 16px',
          borderTop: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
        }}
      >
        <ValueChip tone={row.type}>
          {row.type === 'add' ? ui.COMPARE_RESOURCE_ADDED : ui.COMPARE_RESOURCE_REMOVED}
        </ValueChip>
      </div>
    );
  }
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(96px, 160px) minmax(0, 1fr)',
        columnGap: 12,
        rowGap: 6,
        alignItems: 'start',
        padding: '8px 16px',
        borderTop: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
      }}
    >
      <span style={{ ...textStyle, fontWeight: 700, wordBreak: 'break-word', paddingTop: 2 }}>
        {formatPath(row.path)}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {row.type === 'add' ? (
          <span style={labelStyle}>{ui.COMPARE_ADDED_CHIP}</span>
        ) : (
          <ValueChip tone="remove">{show(row.oldValue)}</ValueChip>
        )}
        {row.type === 'change' ? (
          <span
            style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED, fontSize: 13 }}
            aria-hidden
          >
            {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DIFF_ARROW}
          </span>
        ) : null}
        {row.type === 'remove' ? (
          <span style={labelStyle}>{ui.COMPARE_REMOVED_CHIP}</span>
        ) : (
          <ValueChip tone="add">{show(row.newValue)}</ValueChip>
        )}
      </div>
    </div>
  );
};

const SnapshotCompareView: React.FC<SnapshotCompareViewProps> = memo(
  ({ left, right, leftState, rightState }) => {
    const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

    const error = leftState?.error || rightState?.error || null;
    const leftData = leftState?.data ?? null;
    const rightData = rightState?.data ?? null;
    // A side not requested yet has no state at all; that is not "identical".
    const loading = !leftState || !rightState || leftState.loading || rightState.loading;

    const groups = useMemo(() => {
      if (leftData == null || rightData == null) return [];
      return buildDiffByResource(leftData, rightData);
    }, [leftData, rightData]);

    const hasSecrets = useMemo(
      () =>
        [leftData, rightData].some((data) =>
          normalizeManifestToResources(data).some((r) => r.meta.kind === SECRET_KIND),
        ),
      [leftData, rightData],
    );

    const stats = useMemo(() => {
      const rows = groups.flatMap((g) => g.rows);
      const count = (type: DiffType) => rows.filter((r) => r.type === type).length;
      return {
        changes: rows.length,
        resources: groups.length,
        added: count('add'),
        removed: count('remove'),
        modified: count('change'),
      };
    }, [groups]);

    const header = (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <SnapshotSide label={ui.COMPARE_FROM_LABEL} snap={left} />
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
            fontSize: 14,
            fontWeight: 700,
          }}
          aria-hidden
        >
          {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DIFF_ARROW}
        </span>
        <SnapshotSide label={ui.COMPARE_TO_LABEL} snap={right} />
      </div>
    );

    let body: React.ReactNode;
    if (loading) {
      body = (
        <div style={{ ...cardStyle, padding: 16 }}>
          <Skeleton active paragraph={{ rows: 3 }} title={false} />
        </div>
      );
    } else if (error) {
      body = (
        <PanelEmptyState
          icon={<CloseCircleFilled style={{ color: DEFAULT_COLORS.DANGER }} />}
          title={ui.COMPARE_ERROR_TITLE}
          description={error}
        />
      );
    } else if (groups.length === 0) {
      body = (
        <PanelEmptyState
          icon={<CheckCircleFilled style={{ color: DEFAULT_COLORS.SUCCESS }} />}
          title={hasSecrets ? ui.COMPARE_NO_VISIBLE_TITLE : ui.COMPARE_IDENTICAL_TITLE}
          description={hasSecrets ? ui.COMPARE_IDENTICAL_REDACTED : ui.COMPARE_IDENTICAL}
        />
      );
    } else {
      body = (
        <>
          <div style={statsStyle}>
            <StatTile value={stats.changes} label={ui.COMPARE_STAT_CHANGES} />
            <StatTile value={stats.resources} label={ui.COMPARE_STAT_RESOURCES} />
            <StatTile
              value={stats.modified}
              label={ui.COMPARE_STAT_MODIFIED}
              accent={DEFAULT_COLORS.WARNING}
            />
            <StatTile
              value={stats.added}
              label={ui.COMPARE_STAT_ADDED}
              accent={DEFAULT_COLORS.SUCCESS}
            />
            <StatTile
              value={stats.removed}
              label={ui.COMPARE_STAT_REMOVED}
              accent={DEFAULT_COLORS.DANGER}
            />
          </div>
          {groups.map((g) => (
            <div key={`${g.meta.kind}/${g.meta.name}`} style={cardStyle}>
              <div
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <SnapshotMetaChip>{g.meta.kind}</SnapshotMetaChip>
                <span style={{ ...textStyle, ...oneLine, fontWeight: 700, minWidth: 0, flex: 1 }}>
                  {g.meta.name}
                </span>
                <span style={{ ...labelStyle, whiteSpace: 'nowrap' }}>
                  {pluralize(g.rows.length, ui.COMPARE_CHANGE)}
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(96px, 160px) minmax(0, 1fr)',
                  columnGap: 12,
                  padding: '0 16px 6px',
                }}
              >
                <span style={labelStyle}>{ui.COMPARE_BEFORE}</span>
                <span style={labelStyle}>{ui.COMPARE_AFTER}</span>
              </div>
              {g.rows.map((r, idx) => (
                <DiffRowView
                  key={`${g.meta.kind}/${g.meta.name}:${idx}:${formatPath(r.path)}`}
                  row={r}
                  kind={g.meta.kind}
                />
              ))}
            </div>
          ))}
        </>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        {header}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            overflow: 'auto',
            minHeight: 0,
            paddingRight: 2,
          }}
        >
          {body}
        </div>
      </div>
    );
  },
);

SnapshotCompareView.displayName = 'SnapshotCompareView';

export default SnapshotCompareView;
