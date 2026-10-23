import React, { createContext, useContext, useMemo } from 'react';
import { ACTION_PERMISSIONS, usePermission } from '../../auth/hooks';
import type { ClusterInsightsQuery } from '../models';
import { useClusterInsights, type ClusterInsightsState } from './useClusterInsights';

// The states that count as open: stale and resolved cards need no one's attention.
export const OPEN_INSIGHT_STATES = ['open', 'updated'];

// Open Critical and Warning incidents nobody triaged yet, most severe first.
const ATTENTION_QUERY: ClusterInsightsQuery = {
  page: 1,
  pageSize: 3,
  category: 'incident',
  severity: ['critical', 'warning'],
  state: OPEN_INSIGHT_STATES,
  triage: 'untriaged',
};

export type AttentionInsights = Pick<ClusterInsightsState, 'page' | 'loading' | 'error'>;

const NOTHING_READ: AttentionInsights = { page: null, loading: true, error: null };

const AttentionInsightsContext = createContext<AttentionInsights>(NOTHING_READ);

const { view: VIEW_INSIGHTS } = ACTION_PERMISSIONS.insights;

// One poll shared by Home's Needs attention card and the sidebar badge (one poller per data
// source). It reads only while `active` and the viewer may read Insights.
export const AttentionInsightsProvider: React.FC<{
  active: boolean;
  children: React.ReactNode;
}> = ({ active, children }) => {
  const canView = usePermission(VIEW_INSIGHTS.scope, VIEW_INSIGHTS.level);
  const enabled = active && canView;
  const { page, loading, error } = useClusterInsights(ATTENTION_QUERY, enabled);
  // The hook keeps its last page while disabled: a sign-out followed by a viewer without
  // Insights access must not see the previous session's count.
  const value = useMemo(
    () => (enabled ? { page, loading, error } : NOTHING_READ),
    [enabled, page, loading, error],
  );
  return (
    <AttentionInsightsContext.Provider value={value}>{children}</AttentionInsightsContext.Provider>
  );
};

export const useAttentionInsights = (): AttentionInsights => useContext(AttentionInsightsContext);
