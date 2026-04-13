import {
  UserOutlined,
  BulbOutlined,
  SafetyOutlined,
  ControlOutlined,
  InfoCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import type { ComponentType, CSSProperties } from 'react';

export type SettingsSectionKey =
  | 'profile'
  | 'appearance'
  | 'security'
  | 'insightsGovernance'
  | 'preferences'
  | 'about';

const ROW_TAG_DEFAULTS = {
  COMING_SOON_TEXT: 'Coming soon',
  BACKGROUND: '#F1F5F9',
  COLOR: '#64748B',
  FONT_SIZE: 10,
} as const;

export interface SettingsSectionRowTag {
  text: string;
  background?: string;
  color?: string;
  fontSize?: number;
}

export interface SettingsSectionConfig {
  key: SettingsSectionKey;
  label: string;
  description: string;
  icon: ComponentType<{ style?: CSSProperties }>;
  /** Optional tag shown next to the menu item (e.g. "Coming soon"). */
  rowTag?: SettingsSectionRowTag;
}

export const SETTINGS_CONSTANTS = {
  PAGE: {
    TITLE: 'Settings',
    SUBTITLE: 'Manage your account and preferences',
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
      description: 'Theme, layout, and display options',
      icon: BulbOutlined,
    },
    SECURITY: {
      key: 'security' as const,
      label: 'Security',
      description: 'Password, sessions, and two-factor auth',
      icon: SafetyOutlined,
    },
    AI_DATA: {
      key: 'insightsGovernance' as const,
      label: 'Insights & Governance',
      description: 'AI insights, excluded namespaces, and platform behavior',
      icon: AuditOutlined,
    },
    PREFERENCES: {
      key: 'preferences' as const,
      label: 'Preferences',
      description: 'Language, timezone, and defaults',
      icon: ControlOutlined,
      rowTag: {
        text: ROW_TAG_DEFAULTS.COMING_SOON_TEXT,
        background: ROW_TAG_DEFAULTS.BACKGROUND,
        color: ROW_TAG_DEFAULTS.COLOR,
        fontSize: ROW_TAG_DEFAULTS.FONT_SIZE,
      },
    },
    ABOUT: {
      key: 'about' as const,
      label: 'About',
      description: 'Version, license, and support',
      icon: InfoCircleOutlined,
      rowTag: {
        text: ROW_TAG_DEFAULTS.COMING_SOON_TEXT,
        background: ROW_TAG_DEFAULTS.BACKGROUND,
        color: ROW_TAG_DEFAULTS.COLOR,
        fontSize: ROW_TAG_DEFAULTS.FONT_SIZE,
      },
    },
  },
  SIDEBAR: {
    WIDTH: 260,
    /** Icon-only width for settings sidebar (labels in tooltips). */
    WIDTH_COLLAPSED: 56,
    BORDER_RIGHT: '0.5px solid #e2e8f0',
  },
  CONTENT: {
    MAX_WIDTH: 640,
    CARD_BORDER_RADIUS: 8,
    CARD_PADDING: 20,
    CARD_TITLE_TO_DESCRIPTION_GAP_PX: -4,
    SECTION_TITLE_FONT_SIZE: 20,
    GAP_BETWEEN_CARDS: 20,
  },
} as const;

export const SETTINGS_SECTIONS_LIST: SettingsSectionConfig[] = [
  SETTINGS_CONSTANTS.SECTIONS.PROFILE,
  SETTINGS_CONSTANTS.SECTIONS.APPEARANCE,
  SETTINGS_CONSTANTS.SECTIONS.SECURITY,
  SETTINGS_CONSTANTS.SECTIONS.AI_DATA,
  SETTINGS_CONSTANTS.SECTIONS.PREFERENCES,
  SETTINGS_CONSTANTS.SECTIONS.ABOUT,
];
