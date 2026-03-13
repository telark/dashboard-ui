import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import type { ProtectionPlan } from '../../../models';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PROTECTION_PLANS_POLICY_KEYS,
  PROTECTION_PLAN_POLICY_SHORT_LABELS,
} from '../../../constants/protectionPlans';
import { renderPolicyIcon } from '../../../utils';
import { Tooltip } from 'antd';
import FieldLabel from '../../shared/FieldLabel';

interface ProtectionPlanCardLeftProps {
  plan: ProtectionPlan;
}

const ProtectionPlanCardLeft: React.FC<ProtectionPlanCardLeftProps> = memo(({ plan }) => {
  const enabledPolicies = plan.policies.filter(
    (p) => p.enabled && PROTECTION_PLANS_POLICY_KEYS.includes(p.key),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <FieldLabel>{PPC.LABELS.CARD.PROTECTED_SCOPE}</FieldLabel>
        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div>
              <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, minWidth: 80 }}>
                Cluster
              </span>
              <span style={{ marginLeft: 8, fontWeight: 600 }}>{plan.scope.cluster ?? '—'}</span>
            </div>
            <div>
              <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, minWidth: 80 }}>
                Namespace
              </span>
              <span style={{ marginLeft: 8, fontWeight: 600 }}>{plan.scope.namespace}</span>
            </div>
            {plan.scope.type === 'workload' && (
              <div>
                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, minWidth: 80 }}>
                  Resource
                </span>
                <span style={{ marginLeft: 8, fontWeight: 600 }}>
                  {plan.scope.name} {plan.scope.kind.toLowerCase()}
                </span>
              </div>
            )}
          </div>
          {plan.scope.workloadsCount != null && plan.scope.workloadsCount > 0 && (
            <div style={{ marginTop: 6, fontSize: 12 }}>
              <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>Protected workloads: </span>
              <span style={{ fontWeight: 600, color: DEFAULT_COLORS.TEXT_PRIMARY }}>
                {plan.scope.workloadsCount}
              </span>
            </div>
          )}
        </div>
      </div>

      <div>
        <FieldLabel>{PPC.LABELS.CARD.ENFORCED_POLICIES}</FieldLabel>
        {enabledPolicies.length === 0 ? (
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>No policies enabled</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {enabledPolicies.slice(0, 3).map((policy) => (
              <span
                key={policy.key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
                  color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <span>{renderPolicyIcon(policy.key)}</span>
                <span>{PROTECTION_PLAN_POLICY_SHORT_LABELS[policy.key]}</span>
              </span>
            ))}
            {enabledPolicies.length > 3 && (
              <Tooltip
                title={
                  <div style={{ maxWidth: 260 }}>
                    {enabledPolicies.map((policy) => (
                      <div key={policy.key} style={{ fontSize: 12, marginBottom: 2 }}>
                        {PPC.LABELS.POLICY_LABELS[policy.key]}
                      </div>
                    ))}
                  </div>
                }
              >
                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12 }}>
                  +{enabledPolicies.length - 3} more
                </span>
              </Tooltip>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ProtectionPlanCardLeft.displayName = 'ProtectionPlanCardLeft';

export default ProtectionPlanCardLeft;
