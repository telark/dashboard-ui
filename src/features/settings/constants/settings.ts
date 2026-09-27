import {
  UserOutlined,
  BulbOutlined,
  SafetyOutlined,
  AuditOutlined,
  RobotOutlined,
  LoginOutlined,
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
      description: 'Password, sessions, and two-factor auth',
      icon: SafetyOutlined,
    },
    AI_INSIGHTS: {
      key: 'aiInsights' as const,
      label: 'Local analyzer',
      description: 'Enable the analyzer, choose its model, and control automatic runs.',
      icon: RobotOutlined,
    },
    AI_DATA: {
      key: 'insightsGovernance' as const,
      label: 'Governance',
      description: 'Configure discovery scope, fetch interval, and snapshot storage behavior.',
      icon: AuditOutlined,
    },
    IDENTITY_PROVIDER: {
      key: 'identityProvider' as const,
      label: 'Single Sign-On',
      description: 'Configure the external identity provider users sign in with.',
      icon: LoginOutlined,
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
