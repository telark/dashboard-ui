import {
  UserOutlined,
  BulbOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  RobotOutlined,
  KeyOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { BsLockFill } from 'react-icons/bs';
import type { ComponentType, CSSProperties } from 'react';

export type SettingsSectionKey =
  | 'profile'
  | 'appearance'
  | 'timezone'
  | 'security'
  | 'aiInsights'
  | 'insightsGovernance'
  | 'identityProvider'
  | 'myPermissions'
  | 'about';

export interface SettingsSectionConfig {
  key: SettingsSectionKey;
  label: string;
  description: string;
  icon: ComponentType<{ style?: CSSProperties }>;
  badge?: string;
}

export const SETTINGS_CONSTANTS = {
  PAGE: {
    TITLE: 'Settings',
  },
  SECTIONS: {
    PROFILE: {
      key: 'profile' as const,
      label: 'Profile',
      description: 'Your personal information',
      icon: UserOutlined,
    },
    APPEARANCE: {
      key: 'appearance' as const,
      label: 'Appearance',
      description: 'Theme options',
      icon: BulbOutlined,
    },
    TIMEZONE: {
      key: 'timezone' as const,
      label: 'Timezone',
      description: 'Time zone and region used to display dates and times.',
      icon: GlobalOutlined,
    },
    SECURITY: {
      key: 'security' as const,
      label: 'Security',
      description: 'Passkeys and active sessions',
      icon: SafetyOutlined,
    },
    AI_INSIGHTS: {
      key: 'aiInsights' as const,
      label: 'Insights',
      description: 'On by default. Choose the local model and when incident analysis runs.',
      icon: RobotOutlined,
      badge: 'Experimental',
    },
    AI_DATA: {
      key: 'insightsGovernance' as const,
      label: 'Discovery & Storage',
      description: 'Choose the namespaces discovery skips and how many snapshots it keeps.',
      icon: DatabaseOutlined,
    },
    IDENTITY_PROVIDER: {
      key: 'identityProvider' as const,
      label: 'Authentication',
      description: 'Choose how users sign in: single sign-on and passkey self-registration.',
      icon: KeyOutlined,
    },
    MY_PERMISSIONS: {
      key: 'myPermissions' as const,
      label: 'My Permissions',
      description: 'Your effective permissions resolved across all assigned roles.',
      icon: BsLockFill,
    },
    ABOUT: {
      key: 'about' as const,
      label: 'About',
      description: 'Version, documentation, and third-party licenses.',
      icon: InfoCircleOutlined,
    },
  },
  SIDEBAR: {
    WIDTH: 240,
    /** Icon-only width for settings sidebar (labels in tooltips). */
    WIDTH_COLLAPSED: 56,
  },
  CONTENT: {
    MAX_WIDTH: 640,
    CARD_BORDER_RADIUS: 8,
    CARD_PADDING: 20,
    CARD_TITLE_TO_DESCRIPTION_GAP_PX: -4,
    SECTION_TITLE_FONT_SIZE: 20,
    HINT_FONT_SIZE: 12,
    CARD_TITLE_FONT_SIZE: 15,
    CARD_DESCRIPTION_FONT_SIZE: 13,
    /** Label/value lists (runtime status, model details, storage figures). */
    DETAILS_COLUMN_GAP: 12,
    DETAILS_ROW_GAP: 2,
    GAP_BETWEEN_CARDS: 20,
    /** Opt-in collapse control, rendered in the card's top-right corner. */
    CARD_COLLAPSE: {
      ICON_SIZE: 12,
      BUTTON_SIZE: 22,
      BORDER_RADIUS: 6,
      TRANSITION: 'color 150ms ease',
      EXPAND_LABEL: 'Expand section',
      COLLAPSE_LABEL: 'Collapse section',
      ANIMATION_DURATION_S: 0.22,
      ANIMATION_EASE: [0.4, 0, 0.2, 1],
      /** Chevron rotates rather than swapping glyphs, so the state change reads as one motion. */
      ICON_ROTATION_DEG: 180,
    },
  },
  TOOLBAR: {
    SAVE_KEY: 'save',
  },
} as const;

export const SETTINGS_SECTIONS_LIST: SettingsSectionConfig[] = [
  SETTINGS_CONSTANTS.SECTIONS.PROFILE,
  SETTINGS_CONSTANTS.SECTIONS.APPEARANCE,
  SETTINGS_CONSTANTS.SECTIONS.TIMEZONE,
  SETTINGS_CONSTANTS.SECTIONS.MY_PERMISSIONS,
  SETTINGS_CONSTANTS.SECTIONS.SECURITY,
  SETTINGS_CONSTANTS.SECTIONS.AI_INSIGHTS,
  SETTINGS_CONSTANTS.SECTIONS.AI_DATA,
  SETTINGS_CONSTANTS.SECTIONS.IDENTITY_PROVIDER,
  SETTINGS_CONSTANTS.SECTIONS.ABOUT,
];
