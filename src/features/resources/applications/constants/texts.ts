export const APPLICATIONS_UI = {
  HEADER_TITLE: 'Applications',
  HEADER_SUBTITLE: 'Inspect application health, resources, insights, and change history.',
  TOOLBAR_SEARCH_PLACEHOLDER: 'Search applications by name, status, or display name...',
  TOOLBAR_SEARCH_BUTTON: 'Search',
  FALLBACKS: {
    UNKNOWN: 'unknown',
    EMPTY: '—',
    NOT_ENRICHED: 'Not enriched.',
  },
  SECTIONS: {
    OVERVIEW: {
      TITLE: 'Overview',
      DESCRIPTION: 'Core application metadata and health.',
      REPLICAS: 'Replicas',
    },
    RESOURCE_SUMMARY: {
      TITLE: 'Resource summary',
      DESCRIPTION: 'Resource kind counts detected for this application.',
      EMPTY: 'No resources attached.',
    },
    NAMESPACES: {
      TITLE: 'Namespaces',
      DESCRIPTION: 'Namespaces associated with this application.',
    },
    RESOURCES: {
      TITLE: 'Resources',
      DESCRIPTION: 'Resources discovered for this application.',
      SHOWING_FIRST: 'Showing first',
    },
    INSIGHTS: {
      TITLE: 'Insights',
      DESCRIPTION: 'Enrichment results and suggestions (if available).',
      CONFIDENCE: 'Confidence',
      CATEGORY: 'Category',
      ROLE: 'Role',
      ENRICHED_AT: 'Enriched at',
    },
    RUNTIME: {
      TITLE: 'Runtime',
      DESCRIPTION: 'Ports, images, and environment variable keys.',
      PORTS: 'Ports',
      IMAGES: 'Images',
      ENV_VAR_KEYS: 'Env var keys',
    },
    SNAPSHOTS: {
      TITLE: 'Snapshots',
      DESCRIPTION: 'Stored snapshots detected for this application.',
      SHOWING_FIRST: 'Showing first',
    },
    METRICS: {
      TITLE: 'Metrics',
      DESCRIPTION: 'Derived change metrics for this application.',
      TOTAL_CHANGES: 'Total changes',
      SNAPSHOT_COUNT: 'Snapshot count',
      UNIQUE_FINGERPRINTS: 'Unique fingerprints',
      CHANGE_VELOCITY: 'Change velocity/day',
      FIRST_CHANGE: 'First change detected',
      LAST_CHANGE: 'Last change detected',
      TOTAL_INCIDENTS: 'Total incidents',
      TOTAL_RECOVERIES: 'Total recoveries',
    },
    CHANGE_LOG: {
      TITLE: 'Change log',
      DESCRIPTION: 'Detected changes and incidents.',
      SHOWING_FIRST: 'Showing first',
      GEN: 'Gen',
    },
  },
  CARD: {
    LABELS: {
      HEALTH: 'Health',
      NAMESPACES: 'Namespaces',
      RESOURCES: 'Resources',
      MANAGED_BY: 'Managed by',
      LAST_UPDATED: 'Last updated',
      CREATED_AT: 'Created at',
      CR_STATUS: 'CR status',
      RUNTIME: 'Runtime',
    },
  },
} as const;

