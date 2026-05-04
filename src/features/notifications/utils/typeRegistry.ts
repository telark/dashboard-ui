import React from 'react';
import {
  BellOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { NOTIFICATION_TYPES } from '../constants';

export interface TypeConfig {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  navigateTo: (metadata: Record<string, unknown> | undefined) => string | null;
}

export const TYPE_REGISTRY: Record<string, TypeConfig> = {
  [NOTIFICATION_TYPES.ROLLBACK_COMPLETED]: {
    icon: RollbackOutlined,
    navigateTo: (m) => {
      const id = m?.applicationId;
      return typeof id === 'string' ? `/applications/${id}` : null;
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
    navigateTo: (m) => {
      const id = m?.groupId;
      return typeof id === 'string' ? `/groups/${id}` : null;
    },
  },
};

export const getTypeConfig = (type: string): TypeConfig => {
  return TYPE_REGISTRY[type] ?? { icon: BellOutlined, navigateTo: () => null };
};
