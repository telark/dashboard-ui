import { DEFAULT_COLORS } from '../../../../constants';
import type { ApplicationRollbackEntry } from '../models';
import { APPLICATIONS_UI } from '../constants/texts';
import { CONNECTIVITY_CONSTANTS } from '../../../../constants/pages/connectivity';

export type RollbackStatusState = 'success' | 'failed' | 'inProgress' | 'pending' | 'unknown';

export function classifyRollbackStatus(raw: string): RollbackStatusState {
  const s = raw.trim().toLowerCase();
  if (!s) return 'unknown';
  if (s.includes('fail') || s.includes('error')) return 'failed';
  if (s.includes('success') || s.includes('complete')) return 'success';
  if (s.includes('pending')) return 'pending';
  if (s.includes('progress') || s.includes('running') || s.includes('started')) {
    return 'inProgress';
  }
  return 'unknown';
}

export function getRollbackStatusColors(state: RollbackStatusState): {
  background: string;
  color: string;
} {
  if (state === 'success') {
    return { background: DEFAULT_COLORS.SUCCESS, color: DEFAULT_COLORS.BACKGROUND_WHITE };
  }
  if (state === 'failed') {
    return { background: DEFAULT_COLORS.CHIP_CUSTOM_BG, color: DEFAULT_COLORS.DANGER };
  }
  if (state === 'inProgress') {
    return {
      background: CONNECTIVITY_CONSTANTS.COLORS.WARNING,
      color: DEFAULT_COLORS.BACKGROUND_WHITE,
    };
  }
  if (state === 'pending') {
    return {
      background: DEFAULT_COLORS.BACKGROUND_WHITE,
      color: CONNECTIVITY_CONSTANTS.COLORS.WARNING,
    };
  }
  return { background: DEFAULT_COLORS.CHIP_CUSTOM_BG, color: DEFAULT_COLORS.TEXT_MUTED };
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
