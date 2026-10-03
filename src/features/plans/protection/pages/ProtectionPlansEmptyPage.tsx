import React, { memo, useMemo } from 'react';
import { Icons } from '../../../../constants';
import EmptyState from '../../../../components/display/views/EmptyState';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const ProtectionPlansIcon = Icons.ProtectionPlans;

const ProtectionPlansEmptyPage: React.FC = memo(() => {
  const icon = useMemo(() => <ProtectionPlansIcon size={32} />, []);

  return (
    <EmptyState
      icon={icon}
      title={PPC.LABELS.EMPTY.TITLE}
      description={PPC.LABELS.EMPTY.DESCRIPTION}
    />
  );
});

ProtectionPlansEmptyPage.displayName = 'ProtectionPlansEmptyPage';

export default ProtectionPlansEmptyPage;
