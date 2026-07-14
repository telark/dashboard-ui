import { DEFAULT_COLORS } from '../../../../constants';
import type { ApplicationRollbackEntry } from '../models';
import { APPLICATIONS_UI } from '../constants/texts';
import { CONNECTIVITY_CONSTANTS } from '../../../../constants/pages/connectivity';

export type RollbackStatusState =
  | 'success'
  | 'failed'
  | 'inProgress'
  | 'pending'
  | 'aborted'
  | 'unknown';

export function classifyRollbackStatus(raw: string): RollbackStatusState {
  const s = raw.trim().toLowerCase();
  if (!s) return 'unknown';
  if (s.includes('abort') || s.includes('cancel')) return 'aborted';
  if (s.includes('fail') || s.includes('error')) return 'failed';
  if (s.includes('success') || s.includes('complete')) return 'success';
  if (s.includes('pending')) return 'pending';
  if (s.includes('progress') || s.includes('running') || s.includes('started')) {
    return 'inProgress';
  }
  return 'unknown';
}

export function hasActiveRollback(
  rollbacks: ApplicationRollbackEntry[] | undefined | null,
): boolean {
  if (!rollbacks?.length) return false;
  return rollbacks.some((r) => {
    const s = classifyRollbackStatus(r.status);
    return s === 'pending' || s === 'inProgress';
  });
}

export function getRollbackStatusColors(state: RollbackStatusState): {
  background: string;
  color: string;
} {
  // These badges live on the light-surfaced rollbacks panel: every active state is
  // a filled pill with a white label; inert states fall back to a neutral chip.
  if (state === 'success') {
    return { background: DEFAULT_COLORS.SUCCESS, color: DEFAULT_COLORS.SURFACE_WHITE };
  }
  if (state === 'failed') {
    return { background: DEFAULT_COLORS.DANGER, color: DEFAULT_COLORS.SURFACE_WHITE };
  }
  if (state === 'inProgress' || state === 'pending') {
    return {
      background: CONNECTIVITY_CONSTANTS.COLORS.WARNING,
      color: DEFAULT_COLORS.SURFACE_WHITE,
    };
  }
  return {
    background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  };
}

export function formatRollbackStatusLabel(raw: string): string {
  const cleaned = raw.trim().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ');
  if (!cleaned) return 'Unknown';
  return cleaned
    .split(' ')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
    .join(' ');
}

export function formatRollbackNamespaceRef(namespace: string | undefined | null): string {
  const ns = String(namespace || '').trim();
  return `ns/${ns || APPLICATIONS_UI.FALLBACKS.EMPTY}`;
}

export function formatRollbackSnapshotRef(entry: ApplicationRollbackEntry): string {
  const snap = String(entry.targetSnapshotId || '').trim();
  const gen = entry.targetGeneration;
  if (snap) return `${snap} · gen ${gen}`;
  return `gen ${gen}`;
}
