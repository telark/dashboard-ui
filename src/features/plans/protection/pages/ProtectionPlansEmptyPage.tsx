import React, { memo, useMemo } from 'react';
import { Icons } from '../../../../constants';
import EmptyState from '../../../../components/display/views/EmptyState';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

interface ProtectionPlansEmptyPageProps {
  onCreatePlanClick?: () => void;
}

const ProtectionPlansIcon = Icons.ProtectionPlans;

const ProtectionPlansEmptyPage: React.FC<ProtectionPlansEmptyPageProps> = memo(
  ({ onCreatePlanClick }) => {
    const icon = useMemo(() => <ProtectionPlansIcon size={32} />, []);
    const buttonIcon = useMemo(() => <ProtectionPlansIcon size={16} />, []);

    return (
      <EmptyState
        icon={icon}
        title={PPC.LABELS.EMPTY.TITLE}
        description={PPC.LABELS.EMPTY.DESCRIPTION}
        primaryAction={
          onCreatePlanClick
            ? {
                label: PPC.LABELS.EMPTY.BUTTON,
                icon: buttonIcon,
                onClick: onCreatePlanClick,
              }
            : undefined
        }
      />
    );
  },
);

ProtectionPlansEmptyPage.displayName = 'ProtectionPlansEmptyPage';

export default ProtectionPlansEmptyPage;
