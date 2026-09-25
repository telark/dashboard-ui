import { CLUSTER_INSIGHTS, INSIGHT_GROUP_BY_LABELS } from '../constants/insights';
import type { InsightGroupBy, InsightRow } from '../models';

const isGroupBy = (value: unknown): value is InsightGroupBy =>
  typeof value === 'string' && Object.hasOwn(INSIGHT_GROUP_BY_LABELS, value);

// Storage can be missing, throw (private window, blocked site data) or hold an older shape:
// anything but a known value reads as no grouping.
export const loadGroupBy = (): InsightGroupBy => {
  try {
    const stored = globalThis.localStorage.getItem(CLUSTER_INSIGHTS.GROUP_BY_STORAGE_KEY);
    return isGroupBy(stored) ? stored : 'none';
  } catch {
    return 'none';
  }
};

export const saveGroupBy = (groupBy: InsightGroupBy): void => {
  try {
    globalThis.localStorage.setItem(CLUSTER_INSIGHTS.GROUP_BY_STORAGE_KEY, groupBy);
  } catch {
    // Remembering the grouping is a convenience; the page works without it.
  }
};

export const workloadNamespaceOf = (row: InsightRow): string =>
  row.workloadNamespace || row.namespace;

// `<namespace>/<name>`; anything else is ignored rather than sent and refused.
export const validApp = (value: string): boolean => {
  const slash = value.indexOf('/');
  return slash > 0 && slash < value.length - 1;
};
