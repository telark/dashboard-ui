export const UI = {
  LAYOUT: {
    MAX_CONTENT_WIDTH: 980,
    PAGE_PADDING: 24,
  },
  HEADER: {
    LAST_UPDATE_PREFIX: 'Last update was',
  },
  HISTORY: {
    FULL_TITLE: 'Full History',
    RECORDING: 'Recording…',
    TIMELINE: {
      HALO_SIZE_LAST: 20,
      MARKER_SIZE: 16,
      RAIL_WIDTH: 1,
    },
  },
} as const;

// Component-specific styles for better performance
export const COMPONENT_STYLES = {
  WORKLOAD_INSTANCES: {
    emptyState: {
      minHeight: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },
    emptyIcon: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'rgba(32,201,151,0.12)',
      boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      color: '#20C997', // DEFAULT_COLORS.SUCCESS
      fontSize: 24,
    },
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      minHeight: 40,
    },
    statusTag: {
      borderRadius: 999,
      padding: '2px 10px',
      fontWeight: 700,
      margin: 0,
    },
    kindPill: {
      border: '1px solid #e5e7eb',
      color: '#111827',
      background: '#F9FAFB',
      borderRadius: 999,
      padding: '2px 10px',
      fontWeight: 700,
    },
    headerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      minWidth: 200,
    },
    instanceIcon: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'rgba(32,201,151,0.12)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#20C997', // DEFAULT_COLORS.SUCCESS
    },
    metricsSection: {
      background: 'white',
      borderRadius: 16,
      marginBottom: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    containersSection: {
      background: 'white',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    // Common text styles
    textPrimary: {
      fontSize: 16,
      fontWeight: 700,
      color: '#0B1F33',
    },
    textSecondary: {
      color: '#5B6B7C',
    },
    textMuted: {
      color: '#9CA3AF',
    },
    textLabel: {
      fontSize: 13,
      fontWeight: 600,
      color: '#64748b',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    textValue: {
      fontSize: 15,
      fontWeight: 600,
      color: '#0f172a',
    },
    textSmall: {
      fontSize: 11,
      color: '#64748b',
    },
    // Layout styles
    flexCenter: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    flexCenterGap12: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    flexWrap: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    // Container styles
    containerCard: {
      borderRadius: 16,
      background: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      border: 'none',
    },
    // Status indicators
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: '#20C997', // DEFAULT_COLORS.SUCCESS
    },
    // Button styles
    toggleButton: {
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      background: '#20C997', // DEFAULT_COLORS.SUCCESS
      color: 'white',
      fontWeight: 600,
      padding: '8px 16px',
      height: 'auto',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    // Badge styles
    badge: {
      fontSize: 11,
      color: '#64748b',
      background: '#f1f5f9',
      padding: '2px 6px',
      borderRadius: 4,
    },
    badgeBlue: {
      fontSize: 10,
      padding: '2px 6px',
      background: '#f0f9ff',
      borderRadius: 4,
      color: '#0369a1',
      fontWeight: 500,
      border: '1px solid #bae6fd',
    },
  },
  VIEW_DETAILS: {
    row: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      minHeight: 40,
    },
    labelContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    icon: {
      color: '#20C997', // DEFAULT_COLORS.SUCCESS
      fontSize: 16,
      display: 'inline-flex',
    },
    labelText: {
      color: '#6b7280',
      fontWeight: 700,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    value: {
      color: '#111827',
      fontWeight: 600,
    },
    card: {
      borderRadius: 16,
      boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
      border: 'none',
    },
    cardBody: {
      padding: 16,
    },
    wrapper: {
      padding: '6px 2px',
    },
    divider: {
      borderBottom: '1px solid #eef2f6',
    },
  },
  // Common shared components
  SHARED: {
    HISTORY_TIMELINE: {
      rail: {
        position: 'absolute',
        left: 24, // RAIL_X
        top: 0,
        bottom: 0,
        width: 1, // LINE_WIDTH
        background: '#20C997', // DEFAULT_COLORS.SUCCESS
        transform: 'translateX(-50%)',
        borderRadius: 0.5,
        opacity: 0.95,
      },
      topMask: {
        position: 'absolute',
        left: 24, // RAIL_X
        top: 0,
        width: 5, // LINE_WIDTH + 4
        background: '#fff',
        transform: 'translateX(-50%)',
        zIndex: 1,
      },
      timelineContainer: {
        position: 'relative',
        paddingLeft: 32, // PADDING_LEFT
      },
      timelineItems: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      },
    },
  },
  // Page styles
  PAGES: {
    GROUPERS: {
      pageStyle: {
        background: '#f8fafc', // DEFAULT_COLORS.PAGE_BG
        minHeight: 'calc(100vh - 60px)',
        padding: '48px 24px 24px',
        marginTop: '60px',
      },
      gridStyle: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      },
    },
    BRIDGES: {
      pageStyle: {
        background: '#f8fafc', // DEFAULT_COLORS.PAGE_BG
        minHeight: 'calc(100vh - 60px)',
        padding: '48px 24px 24px',
        marginTop: '60px',
      },
      gridStyle: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      },
    },
  },
} as const;

// Component-specific constants for better organization
export const COMPONENT_CONSTANTS = {
  WORKLOAD_INSTANCES: {
    PULL_POLICY_MAP: {
      Always: 'Always pull',
      IfNotPresent: 'Pull if needed',
      Never: 'Local only',
    },
    INSTANCE_TYPE: 'Instance',
  },
} as const;

export type UIConstants = typeof UI;
