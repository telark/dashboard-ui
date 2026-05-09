import React, { useMemo } from 'react';
import { CopyOutlined, EditOutlined, ReloadOutlined, StopOutlined } from '@ant-design/icons';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanPhase } from '../../models';

interface ProtectionPlanDetailsToolbarProps {
  phase: PlanPhase;
  duplicating: boolean;
  editing: boolean;
  cancelling: boolean;
  refreshingHealth: boolean;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onRefreshHealth: () => void;
}

const CANCELLABLE: PlanPhase[] = ['active', 'scheduled', 'failed'];
const NON_EDITABLE: PlanPhase[] = ['terminated', 'cancelled'];

const ProtectionPlanDetailsToolbar: React.FC<ProtectionPlanDetailsToolbarProps> = ({
  phase,
  duplicating,
  editing,
  cancelling,
  refreshingHealth,
  onDuplicate,
  onEdit,
  onCancel,
  onRefreshHealth,
}) => {
  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const editDisabled = NON_EDITABLE.includes(phase);
    const buttons: ToolbarConfig['buttons'] = [
      {
        key: 'edit',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.EDIT,
        icon: <EditOutlined />,
        variant: 'default',
        onClick: onEdit,
        disabled: editing || editDisabled,
        tooltip: editDisabled ? PPC.LABELS.DETAIL_PAGE.ACTIONS.EDIT_DISABLED_TOOLTIP : undefined,
      },
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
  }, [
    phase,
    duplicating,
    editing,
    cancelling,
    refreshingHealth,
    onDuplicate,
    onEdit,
    onCancel,
    onRefreshHealth,
  ]);

  return <Toolbar config={toolbarConfig} />;
};

export default ProtectionPlanDetailsToolbar;
