export const INSIGHTS_CONSTANTS = {
  ERROR: {
    NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE',
    CHECK_CLUSTER_FAILED: 'Failed to check cluster insights',
    START_CLUSTER_ANALYSIS_FAILED: '[APIClient] Failed to start cluster analysis:',
  },
  SUCCESS: {
    WELCOME: 'Welcome to our App!',
    WELCOME_SUBTITLE: 'Your cluster analysis is ready',
  },
  WARNING: {
    BACKEND_UNAVAILABLE: 'Backend unavailable',
    BACKEND_UNAVAILABLE_DESCRIPTION:
      'We cannot reach the services yet. We will retry with increasing intervals. Please start your backend if it is stopped.',
  },
  INFO: {
    STARTUP: {
      TITLE: 'Preparing your cluster analysis',
      DESCRIPTION:
        'We will scan your cluster to identify health issues, workload insights, and trends. Start your first analysis now — it is quick, read-only, and safe for production workloads.',
    },
  },
} as const;
