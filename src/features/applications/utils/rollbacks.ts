import { EMPTY_VALUE } from '../../../constants';
import type { ApplicationRollbackEntry } from '../models';

export type RollbackStatusState =
  'success' | 'failed' | 'inProgress' | 'pending' | 'aborted' | 'unknown';

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
  return `ns/${ns || EMPTY_VALUE}`;
}
