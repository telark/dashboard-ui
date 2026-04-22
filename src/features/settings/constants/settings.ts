import {
  UserOutlined,
  BulbOutlined,
  SafetyOutlined,
  AuditOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import type { ComponentType, CSSProperties } from 'react';

export type SettingsSectionKey =
  | 'profile'
  | 'appearance'
  | 'security'
  | 'aiInsights'
  | 'insightsGovernance';

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
    AI_INSIGHTS: {
      key: 'aiInsights' as const,
      label: 'AI Insights',
      description: 'Configure AI providers, key validation, and enrichment behavior.',
      icon: RobotOutlined,
    },
    AI_DATA: {
      key: 'insightsGovernance' as const,
      label: 'Governance',
      description: 'Configure discovery scope, fetch interval, and snapshot storage behavior.',
      icon: AuditOutlined,
    },
  },
  SIDEBAR: {
    WIDTH: 240,
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
  SETTINGS_CONSTANTS.SECTIONS.AI_INSIGHTS,
  SETTINGS_CONSTANTS.SECTIONS.AI_DATA,
];
