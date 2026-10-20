import React from 'react';
import {
  BellOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  KeyOutlined,
  LinkOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { APP_ROUTE_PARAMS, APP_ROUTES, Icons } from '../../../constants';
import { NOTIFICATION_TYPES } from '../constants';

export interface TypeConfig {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  navigateTo: (metadata: Record<string, unknown> | undefined) => string | null;
}

const planDetailsRoute = (m: Record<string, unknown> | undefined): string | null =>
  typeof m?.planName === 'string'
    ? APP_ROUTES.PROTECTION_PLAN_DETAILS.replace(':name', encodeURIComponent(m.planName))
    : null;

const TYPE_REGISTRY: Record<string, TypeConfig> = {
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
      return typeof id === 'string' ? APP_ROUTES.USERS : null;
    },
  },
  [NOTIFICATION_TYPES.GROUP_MEMBERSHIP_CHANGED]: {
    icon: TeamOutlined,
    navigateTo: () => APP_ROUTES.GROUPS,
  },
  [NOTIFICATION_TYPES.PLAN_APPROVAL_REQUESTED]: {
    icon: SafetyCertificateOutlined,
    navigateTo: planDetailsRoute,
  },
  [NOTIFICATION_TYPES.PLAN_APPROVAL_DECIDED]: {
    icon: CheckCircleOutlined,
    navigateTo: planDetailsRoute,
  },
  // Both lead to the account's passkeys, where a passkey added through the link shows up.
  [NOTIFICATION_TYPES.ENROLL_LINK_CREATED]: {
    icon: LinkOutlined,
    navigateTo: () => APP_ROUTES.PASSKEYS,
  },
  [NOTIFICATION_TYPES.ENROLL_LINK_USED]: {
    icon: KeyOutlined,
    navigateTo: () => APP_ROUTES.PASSKEYS,
  },
  // The Bootstrap account card on Authentication lists the request and decides it.
  [NOTIFICATION_TYPES.BOOTSTRAP_REQUEST]: {
    icon: LockOutlined,
    navigateTo: () => APP_ROUTES.AUTHENTICATION,
  },
  [NOTIFICATION_TYPES.INCIDENT_CRITICAL]: {
    icon: Icons.Insights,
    navigateTo: (m) =>
      typeof m?.insightId === 'string'
        ? `${APP_ROUTES.INSIGHTS}?${APP_ROUTE_PARAMS.INSIGHT}=${encodeURIComponent(m.insightId)}`
        : null,
  },
};

export const getTypeConfig = (type: string): TypeConfig => {
  return TYPE_REGISTRY[type] ?? { icon: BellOutlined, navigateTo: () => null };
};
