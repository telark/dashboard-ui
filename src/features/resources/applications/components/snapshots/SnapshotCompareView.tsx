import React, { memo, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type { ApplicationSnapshotSummary, SnapshotManifestState } from '../../models';
import { APPLICATIONS_UI } from '../../constants';
import MutedText from '../details/MutedText';
import SnapshotMetaChip from './SnapshotMetaChip';

const COMPARE_ARROW = '→';
const EMPTY_VALUE = '—';

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
  if (v == null) return EMPTY_VALUE;
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

const SnapshotCompareView: React.FC<SnapshotCompareViewProps> = memo(
  ({ left, right, leftState, rightState }) => {
    const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

    const loading = Boolean(leftState?.loading || rightState?.loading);
    const error = leftState?.error || rightState?.error || null;
    const leftData = leftState?.data ?? null;
    const rightData = rightState?.data ?? null;

    const groups = useMemo(() => {
      if (leftData == null || rightData == null) return [];
      return buildDiffByResource(leftData, rightData);
    }, [leftData, rightData]);

    const totalChanges = useMemo(() => groups.reduce((sum, g) => sum + g.rows.length, 0), [groups]);

    // One line per snapshot: generation, id and age read left to right, and
    // nothing wraps. The generation identifies the comparison so it leads.
    const side = (snap: ApplicationSnapshotSummary) => (
      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          gap: 6,
          minWidth: 0,
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE,
            flexShrink: 0,
          }}
        >
          {ui.GENERATION} {snap.generation}
        </span>
        <SnapshotMetaChip>{snap.id}</SnapshotMetaChip>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
            flexShrink: 0,
          }}
        >
          {snap.takenAt ? <TimeAgo date={snap.takenAt} /> : <MutedText value={EMPTY_VALUE} />}
        </span>
      </div>
    );

    const headerRow = (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        {/* nowrap keeps the pair side by side; a narrow panel scrolls the row
            rather than breaking it back onto two lines. */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            maxWidth: '100%',
            overflowX: 'auto',
          }}
        >
          {side(left)}
          <span
            style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED, flexShrink: 0 }}
            aria-hidden
          >
            {COMPARE_ARROW}
          </span>
          {side(right)}
        </div>
        {/* The summary belongs to the diff below, so it lines up with the
            resource cards rather than centring under the snapshot pair. */}
        {totalChanges > 0 ? (
          <div style={{ alignSelf: 'flex-start' }}>
            <SnapshotMetaChip>
              {totalChanges} {totalChanges === 1 ? ui.COMPARE_CHANGE_ONE : ui.COMPARE_CHANGE_MANY}
              {ui.STORAGE_METRICS_JOINER}
              {groups.length}{' '}
              {groups.length === 1 ? ui.COMPARE_RESOURCE_ONE : ui.COMPARE_RESOURCE_MANY}
            </SnapshotMetaChip>
          </div>
        ) : null}
      </div>
    );

    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {headerRow}
          <MutedText value={ui.COMPARE_LOADING} />
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {headerRow}
          <div style={{ color: DEFAULT_COLORS.DANGER, fontSize: 13 }}>{error}</div>
        </div>
      );
    }

    if (groups.length === 0) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {headerRow}
          <div
            style={{
              padding: '16px 12px',
              border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
              borderRadius: 10,
              background: DEFAULT_COLORS.SURFACE_WHITE,
              color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {ui.COMPARE_IDENTICAL}
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        {headerRow}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            overflow: 'auto',
            minHeight: 0,
            paddingRight: 2,
          }}
        >
          {groups.map((g) => (
            <div
              key={`${g.meta.kind}/${g.meta.name}`}
              style={{
                border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
                borderRadius: 10,
                background: DEFAULT_COLORS.SURFACE_WHITE,
              }}
            >
              <div
                style={{
                  padding: '6px 10px',
                  borderBottom: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontWeight: 800,
                  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
                }}
              >
                <span>{g.meta.kind}</span>
                <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED, fontWeight: 700 }}>
                  {g.meta.name}
                </span>
                <SnapshotMetaChip>
                  {g.rows.length}{' '}
                  {g.rows.length === 1 ? ui.COMPARE_CHANGE_ONE : ui.COMPARE_CHANGE_MANY}
                </SnapshotMetaChip>
              </div>
              <div style={{ display: 'grid', rowGap: 4, padding: '6px 10px' }}>
                {g.rows.map((r, idx) => (
                  <div
                    key={`${g.meta.kind}/${g.meta.name}:${idx}:${formatPath(r.path)}`}
                    // One flowing line: a fixed 3-column grid has no room in the
                    // panel and drops each cell onto its own row, which reads as
                    // "replicas / 2 / 1" instead of "replicas 2 → 1".
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'baseline',
                      gap: 6,
                      fontSize: 12,
                      lineHeight: 1.35,
                    }}
                  >
                    <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE, fontWeight: 700 }}>
                      {formatPath(r.path)}
                    </span>
                    {r.type !== 'add' ? (
                      <span
                        style={{
                          color: DEFAULT_COLORS.DANGER,
                          textDecoration: 'line-through',
                          wordBreak: 'break-word',
                        }}
                      >
                        {stringifyValue(r.oldValue)}
                      </span>
                    ) : null}
                    {r.type === 'change' ? (
                      <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }} aria-hidden>
                        {COMPARE_ARROW}
                      </span>
                    ) : null}
                    {r.type !== 'remove' ? (
                      <span
                        style={{
                          color: DEFAULT_COLORS.SUCCESS,
                          fontWeight: 700,
                          wordBreak: 'break-word',
                        }}
                      >
                        {stringifyValue(r.newValue)}
                      </span>
                    ) : null}
                    <span style={{ color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED, fontSize: 11 }}>
                      {r.type === 'add'
                        ? ui.COMPARE_ADDED
                        : r.type === 'remove'
                          ? ui.COMPARE_REMOVED
                          : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);

SnapshotCompareView.displayName = 'SnapshotCompareView';

export default SnapshotCompareView;
