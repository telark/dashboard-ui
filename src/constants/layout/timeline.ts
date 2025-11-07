import { DEFAULT_COLORS } from '../shared/colors';
import { UI } from './ui';

export const TIMELINE_CONSTANTS = {
  PADDING_LEFT: 42,
  RAIL_X: 18,
  GAP_AROUND: 6,
  HEADER_LEFT_PADDING: 16, // antd Drawer default left padding
  SPACER_HEIGHT: 20,
  DRAWER_WIDTH: 420,
  LOADING_SPINNER_PADDING: 40,
  LOAD_MORE_MARGIN_TOP: 16,
} as const;

export const TIMELINE_STYLES = {
  RAIL: {
    continuous: {
      position: 'absolute' as const,
      top: 0,
      bottom: 0,
      width: UI.HISTORY.TIMELINE.RAIL_WIDTH,
      background: DEFAULT_COLORS.SUCCESS,
      transform: 'translateX(-50%)',
      borderRadius: UI.HISTORY.TIMELINE.RAIL_WIDTH / 2,
      opacity: 0.95,
    },
    topMask: {
      position: 'absolute' as const,
      top: 0,
      width: UI.HISTORY.TIMELINE.RAIL_WIDTH + 4,
      background: '#fff',
      transform: 'translateX(-50%)',
      zIndex: 1,
    },
    bottomMask: {
      position: 'absolute' as const,
      bottom: 0,
      width: UI.HISTORY.TIMELINE.RAIL_WIDTH + 6,
      background: '#fff',
      transform: 'translateX(-50%)',
      zIndex: 1,
    },
  },
  MARKER: {
    icon: {
      fontSize: 10,
      color: '#fff',
    },
    railGapMask: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: UI.HISTORY.TIMELINE.RAIL_WIDTH + 6,
      background: '#fff',
      zIndex: 1,
    },
    halo: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: UI.HISTORY.TIMELINE.HALO_SIZE_LAST,
      height: UI.HISTORY.TIMELINE.HALO_SIZE_LAST,
      borderRadius: '50%',
      background: 'rgba(32,201,151,0.15)',
      zIndex: 2,
    },
    container: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: UI.HISTORY.TIMELINE.MARKER_SIZE,
      height: UI.HISTORY.TIMELINE.MARKER_SIZE,
      borderRadius: '50%',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3,
    },
  },
  ITEM: {
    container: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    },
    content: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      lineHeight: 1.25,
    },
    name: {
      fontWeight: 600,
      fontSize: 18,
      color: '#0B1F33',
    },
    time: {
      color: '#5B6B7C',
      marginTop: 4,
      fontSize: 13,
    },
  },
  VIEW: {
    container: {
      position: 'relative' as const,
    },
    itemsContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 12,
    },
  },
  DRAWER: {
    title: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
    },
    titleText: {
      fontWeight: 700,
      color: '#0B1F33',
    },
    closeButton: {
      position: 'absolute' as const,
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
      color: '#6b7280',
      display: 'inline-flex',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: '40px 0',
    },
    loadMoreContainer: {
      marginTop: 16,
      textAlign: 'center' as const,
    },
    loadMoreButton: {
      borderColor: DEFAULT_COLORS.SUCCESS,
      color: DEFAULT_COLORS.SUCCESS,
      borderWidth: 1,
      borderRadius: 12,
      height: 36,
    },
    body: {
      padding: 16,
    },
    header: {
      borderBottom: 'none',
      padding: '12px 16px',
    },
  },
  RECORDING: {
    spacer: {
      height: 20,
    },
    container: {
      position: 'relative' as const,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    },
    railGapMask: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: UI.HISTORY.TIMELINE.RAIL_WIDTH + 6,
      background: '#fff',
      zIndex: 1,
    },
    spinnerContainer: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 3,
    },
    spinner: {
      fontSize: 14,
      color: DEFAULT_COLORS.SUCCESS,
    },
    content: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      lineHeight: 1.25,
    },
    text: {
      fontWeight: 600,
      fontSize: 16,
      color: '#5B6B7C',
    },
  },
} as const;
