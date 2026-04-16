import React, { memo, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type { ApplicationSnapshotSummary, SnapshotManifestState } from '../../models';
import MutedText from '../details/MutedText';

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
  if (v == null) return '—';
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
    const headerRow = (
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: DEFAULT_COLORS.TEXT_MUTED,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ fontWeight: 800, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
          Generation {left.generation}
        </span>
        <span style={{ fontWeight: 500 }}>·</span>
        {left.takenAt ? <TimeAgo date={left.takenAt} /> : <MutedText value="—" />}
        <span style={{ fontWeight: 500 }}>→</span>
        <span style={{ fontWeight: 800, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
          Generation {right.generation}
        </span>
        <span style={{ fontWeight: 500 }}>·</span>
        {right.takenAt ? <TimeAgo date={right.takenAt} /> : <MutedText value="—" />}
      </div>
    );

    const loading = Boolean(leftState?.loading || rightState?.loading);
    const error = leftState?.error || rightState?.error || null;
    const leftData = leftState?.data ?? null;
    const rightData = rightState?.data ?? null;

    const groups = useMemo(() => {
      if (leftData == null || rightData == null) return [];
      return buildDiffByResource(leftData, rightData);
    }, [leftData, rightData]);

    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {headerRow}
          <MutedText value="Loading manifest…" />
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
              border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
              borderRadius: 10,
              background: DEFAULT_COLORS.BACKGROUND_WHITE,
              color: DEFAULT_COLORS.TEXT_MUTED,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            These two snapshots are identical.
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
                border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                borderRadius: 10,
                background: DEFAULT_COLORS.BACKGROUND_WHITE,
              }}
            >
              <div
                style={{
                  padding: '10px 12px',
                  borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontWeight: 800,
                  color: DEFAULT_COLORS.TEXT_PRIMARY,
                }}
              >
                <span>{g.meta.kind}</span>
                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 700 }}>
                  {g.meta.name}
                </span>
              </div>
              <div style={{ display: 'grid', rowGap: 6, padding: '10px 12px' }}>
                {g.rows.map((r, idx) => (
                  <div
                    key={`${g.meta.kind}/${g.meta.name}:${idx}:${formatPath(r.path)}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(180px, 1.1fr) minmax(0, 1fr) minmax(0, 1fr)',
                      gap: 12,
                      alignItems: 'start',
                      fontSize: 12,
                      lineHeight: 1.35,
                    }}
                  >
                    <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: 700 }}>
                      {formatPath(r.path)}
                    </div>
                    <div
                      style={{
                        color: r.type === 'add' ? DEFAULT_COLORS.TEXT_MUTED : DEFAULT_COLORS.DANGER,
                        textDecoration: r.type === 'add' ? 'none' : 'line-through',
                        opacity: r.type === 'add' ? 0.6 : 0.95,
                        wordBreak: 'break-word',
                      }}
                    >
                      {r.type === 'add' ? '—' : stringifyValue(r.oldValue)}
                    </div>
                    <div
                      style={{
                        color:
                          r.type === 'remove' ? DEFAULT_COLORS.TEXT_MUTED : DEFAULT_COLORS.SUCCESS,
                        opacity: r.type === 'remove' ? 0.6 : 0.95,
                        wordBreak: 'break-word',
                        fontWeight: r.type === 'remove' ? 500 : 700,
                      }}
                    >
                      {r.type === 'remove' ? '—' : stringifyValue(r.newValue)}
                    </div>
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
