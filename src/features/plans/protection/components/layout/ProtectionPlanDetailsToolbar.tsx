import React, { useMemo } from 'react';
import { CopyOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanPhase } from '../../models';

interface ProtectionPlanDetailsToolbarProps {
  phase: PlanPhase;
  duplicating: boolean;
  cancelling: boolean;
  refreshingHealth: boolean;
  onDuplicate: () => void;
  onCancel: () => void;
  onRefreshHealth: () => void;
}

const CANCELLABLE: PlanPhase[] = ['active', 'scheduled', 'failed'];

const ProtectionPlanDetailsToolbar: React.FC<ProtectionPlanDetailsToolbarProps> = ({
  phase,
  duplicating,
  cancelling,
  refreshingHealth,
  onDuplicate,
  onCancel,
  onRefreshHealth,
}) => {
  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const buttons: ToolbarConfig['buttons'] = [
      {
        key: 'duplicate',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.DUPLICATE,
        icon: <CopyOutlined />,
        variant: 'default',
        onClick: onDuplicate,
        disabled: duplicating,
      },
    ];
    if (phase === 'active') {
      buttons.push({
        key: 'refreshHealth',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.REFRESH_HEALTH,
        icon: <ReloadOutlined />,
        variant: 'default',
        onClick: onRefreshHealth,
        disabled: refreshingHealth,
      });
    }
    if (CANCELLABLE.includes(phase)) {
      buttons.push({
        key: 'cancel',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.CANCEL,
        icon: <StopOutlined />,
        variant: 'danger',
        onClick: onCancel,
        disabled: cancelling,
      });
    }
    return { buttons };
  }, [phase, duplicating, cancelling, refreshingHealth, onDuplicate, onCancel, onRefreshHealth]);

  return <Toolbar config={toolbarConfig} />;
};

export default ProtectionPlanDetailsToolbar;
