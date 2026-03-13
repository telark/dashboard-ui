import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import type { ProtectionPlan } from '../../../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../../constants/protectionPlans';
import dayjs from 'dayjs';
import { formatRemainingTime } from '../../../utils';

interface ProtectionPlanCardLeftProps {
  plan: ProtectionPlan;
}

const ProtectionPlanCardLeft: React.FC<ProtectionPlanCardLeftProps> = memo(({ plan }) => {
  const startAt = dayjs(plan.schedule.startAt);
  const endAt = dayjs(plan.schedule.endAt);
  const remainingText = formatRemainingTime(plan.schedule.endAt, plan.lifecycle);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <div
          style={{
            color: DEFAULT_COLORS.TEXT_MUTED,
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
          Protected Scope
        </div>
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
        <div
          style={{
            color: DEFAULT_COLORS.TEXT_MUTED,
            marginBottom: 0,
            lineHeight: 1.2,
          }}
        >
          {PPC.LABELS.COLUMNS.WINDOW}
        </div>
        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>
          {startAt.format('MMM D HH:mm')} → {endAt.format('MMM D HH:mm')}
        </div>
        {remainingText && (
          <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 12, marginTop: 2 }}>
            {remainingText}
          </div>
        )}
      </div>
    </div>
  );
});

ProtectionPlanCardLeft.displayName = 'ProtectionPlanCardLeft';

export default ProtectionPlanCardLeft;
