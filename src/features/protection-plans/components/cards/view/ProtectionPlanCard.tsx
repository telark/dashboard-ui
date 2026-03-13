import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import type { ProtectionPlan } from '../../../models';
import ProtectionPlanCardHeader from './ProtectionPlanCardHeader';
import ProtectionPlanCardLeft from './ProtectionPlanCardLeft';
import ProtectionPlanCardRight from './ProtectionPlanCardRight';

interface ProtectionPlanCardProps {
  plan: ProtectionPlan;
}

const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = memo(({ plan }) => {
  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: 10,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        padding: 12,
      }}
    >
      <ProtectionPlanCardHeader plan={plan} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1.5fr)',
          columnGap: 24,
          rowGap: 12,
          fontSize: 13,
          paddingTop: 10,
          borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        }}
      >
        <ProtectionPlanCardLeft plan={plan} />
        <ProtectionPlanCardRight plan={plan} />
      </div>
    </div>
  );
});

ProtectionPlanCard.displayName = 'ProtectionPlanCard';

export default ProtectionPlanCard;
