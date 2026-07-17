import React, { memo, useMemo } from 'react';
import { Icons } from '../../../../constants';
import EmptyState from '../../../../components/display/views/EmptyState';
import { usePermission, ACTION_PERMISSIONS } from '../../../auth/hooks';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

interface ProtectionPlansEmptyPageProps {
  onCreatePlanClick?: () => void;
}

const ProtectionPlansIcon = Icons.ProtectionPlans;

const ProtectionPlansEmptyPage: React.FC<ProtectionPlansEmptyPageProps> = memo(
  ({ onCreatePlanClick }) => {
    const canCreate = usePermission(
      ACTION_PERMISSIONS.protectionPlans.create.scope,
      ACTION_PERMISSIONS.protectionPlans.create.level,
      ACTION_PERMISSIONS.protectionPlans.create.deny,
    );
    const icon = useMemo(() => <ProtectionPlansIcon size={32} />, []);
    const buttonIcon = useMemo(() => <ProtectionPlansIcon size={16} />, []);

    return (
      <EmptyState
        icon={icon}
        title={PPC.LABELS.EMPTY.TITLE}
        description={PPC.LABELS.EMPTY.DESCRIPTION}
        primaryAction={
          canCreate && onCreatePlanClick
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
