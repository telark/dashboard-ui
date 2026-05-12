import React from 'react';
import {
  BellOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { APP_ROUTES } from '../../../constants';
import { NOTIFICATION_TYPES } from '../constants';

export interface TypeConfig {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  navigateTo: (metadata: Record<string, unknown> | undefined) => string | null;
}

export const TYPE_REGISTRY: Record<string, TypeConfig> = {
  [NOTIFICATION_TYPES.ROLLBACK_COMPLETED]: {
    icon: HistoryOutlined,
    navigateTo: (m) => {
      const name = m?.applicationName;
      return typeof name === 'string'
        ? APP_ROUTES.APPLICATION_DETAILS.replace(':name', name)
        : null;
    },
  },
  [NOTIFICATION_TYPES.ROLE_CHANGED]: {
    icon: SafetyCertificateOutlined,
    navigateTo: (m) => {
      const id = m?.targetId;
      return typeof id === 'string' ? `/users/${id}` : null;
    },
  },
  [NOTIFICATION_TYPES.GROUP_MEMBERSHIP_CHANGED]: {
    icon: TeamOutlined,
    navigateTo: () => APP_ROUTES.GROUPS,
  },
};

export const getTypeConfig = (type: string): TypeConfig => {
  return TYPE_REGISTRY[type] ?? { icon: BellOutlined, navigateTo: () => null };
};
