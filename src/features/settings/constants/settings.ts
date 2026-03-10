import {
  UserOutlined,
  BulbOutlined,
  SafetyOutlined,
  ControlOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { ComponentType, CSSProperties } from 'react';

export type SettingsSectionKey =
  | 'profile'
  | 'appearance'
  | 'security'
  | 'preferences'
  | 'about';

export interface SettingsSectionConfig {
  key: SettingsSectionKey;
  label: string;
  description: string;
  icon: ComponentType<{ style?: CSSProperties }>;
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
    PREFERENCES: {
      key: 'preferences' as const,
      label: 'Preferences',
      description: 'Language, timezone, and defaults',
      icon: ControlOutlined,
    },
    ABOUT: {
      key: 'about' as const,
      label: 'About',
      description: 'Version, license, and support',
      icon: InfoCircleOutlined,
    },
  },
  SIDEBAR: {
    WIDTH: 260,
    BORDER_RIGHT: '1px solid #e2e8f0',
  },
  CONTENT: {
    MAX_WIDTH: 640,
    CARD_BORDER_RADIUS: 8,
    CARD_PADDING: 20,
    SECTION_TITLE_FONT_SIZE: 20,
    GAP_BETWEEN_CARDS: 20,
  },
} as const;

export const SETTINGS_SECTIONS_LIST: SettingsSectionConfig[] = [
  SETTINGS_CONSTANTS.SECTIONS.PROFILE,
  SETTINGS_CONSTANTS.SECTIONS.APPEARANCE,
  SETTINGS_CONSTANTS.SECTIONS.SECURITY,
  SETTINGS_CONSTANTS.SECTIONS.PREFERENCES,
  SETTINGS_CONSTANTS.SECTIONS.ABOUT,
];
