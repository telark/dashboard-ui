import React from 'react';
import { Tag } from 'antd';
import { DEFAULT_COLORS, STATUS_COLORS, TAG_CLASS, getPillColor } from '../../../../../constants';
import type { ProtectionPlan } from '../../models';
import { planPhaseLabel } from '../../utils/phaseRules';

const PlanPhaseTag: React.FC<{ plan: ProtectionPlan }> = ({ plan }) => {
  const label = planPhaseLabel(plan);
  const outline = STATUS_COLORS.PLAN_PHASE_OUTLINE[plan.phase];
  if (outline) {
    return (
      <Tag className={TAG_CLASS.OUTLINE} style={{ color: outline }}>
        {label}
      </Tag>
    );
  }
  const accent = STATUS_COLORS.PLAN_PHASE[plan.phase] ?? DEFAULT_COLORS.NEUTRAL;
  return <Tag color={getPillColor(accent)}>{label}</Tag>;
};

export default PlanPhaseTag;
