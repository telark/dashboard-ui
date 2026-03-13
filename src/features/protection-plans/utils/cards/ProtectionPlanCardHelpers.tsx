import dayjs from 'dayjs';
import type { ProtectionPlan, ProtectionPlanPolicyKey } from '../../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import {
  ClockCircleOutlined,
  DeleteOutlined,
  LockOutlined,
  RollbackOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export const formatRemainingTime = (
  endIso: string,
  lifecycle: ProtectionPlan['lifecycle'],
): string | null => {
  if (lifecycle !== 'active') return null;
  const end = dayjs(endIso);
  const now = dayjs();
  if (!end.isAfter(now)) return null;

  const totalMinutes = end.diff(now, 'minute');
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0 && minutes <= 0) return null;
  if (hours === 0) return `Ends in ${minutes}m`;
  if (minutes === 0) return `Ends in ${hours}h`;
  return `Ends in ${hours}h ${minutes}m`;
};

export const getProtectionLevel = (
  plan: ProtectionPlan,
): keyof typeof PPC.LABELS.PROTECTION_LEVELS => {
  if (plan.level) {
    return plan.level;
  }

  const hasUpdateBlock = plan.policies.some((p) => p.enabled && p.key === 'preventWorkloadUpdates');
  const hasDeleteBlock = plan.policies.some(
    (p) => p.enabled && p.key === 'preventResourceDeletion',
  );
  const hasConfigFreeze = plan.policies.some((p) => p.enabled && p.key === 'configurationFreeze');

  if (hasUpdateBlock && hasDeleteBlock) return 'high';
  if (hasUpdateBlock || hasDeleteBlock) return 'medium';
  if (hasConfigFreeze) return 'low';
  return 'low';
};

export const renderPolicyIcon = (key: ProtectionPlanPolicyKey) => {
  switch (key) {
    case 'preventWorkloadUpdates':
      return <LockOutlined />;
    case 'preventResourceDeletion':
      return <DeleteOutlined />;
    case 'configurationFreeze':
      return <SettingOutlined />;
    case 'versionRestriction':
      return <ClockCircleOutlined />;
    case 'rollbackPrevention':
      return <RollbackOutlined />;
    default:
      return null;
  }
};

