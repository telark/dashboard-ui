export const INSIGHTS_ERROR_MESSAGES = {
  CLIENT: {
    FETCH_INSIGHTS_FAILED: 'Failed to fetch application insights',
    ANALYZE_FAILED: 'The analysis failed.',
    INSIGHTS_STREAM_FAILED: 'Lost the live connection to insights',
    RUNTIME_FETCH_FAILED: 'Failed to fetch the analyzer runtime status',
    TRIAGE_INSIGHT_FAILED: 'Failed to triage the insight',
    FETCH_CLUSTER_INSIGHTS_FAILED: 'Failed to fetch cluster insights',
  },
} as const;
