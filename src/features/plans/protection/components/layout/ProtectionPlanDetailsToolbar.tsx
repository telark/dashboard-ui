import React, { useMemo } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { ProtectionPlan } from '../../models';
import {
  CANCELLABLE_PHASES,
  NON_EDITABLE_PHASES,
  REACTIVATABLE_PHASES,
  isReactivateExpired,
} from '../../utils/phaseRules';

interface ProtectionPlanDetailsToolbarProps {
  plan: ProtectionPlan;
  duplicating: boolean;
  editing: boolean;
  cancelling: boolean;
  reactivating: boolean;
  deleting: boolean;
  refreshingHealth: boolean;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onReactivate: () => void;
  onDelete: () => void;
  onRefreshHealth: () => void;
}

const ProtectionPlanDetailsToolbar: React.FC<ProtectionPlanDetailsToolbarProps> = ({
  plan,
  duplicating,
  editing,
  cancelling,
  reactivating,
  deleting,
  refreshingHealth,
  onDuplicate,
  onEdit,
  onCancel,
  onReactivate,
  onDelete,
  onRefreshHealth,
}) => {
  const canEdit = usePermission(
    ACTION_PERMISSIONS.protectionPlans.edit.scope,
    ACTION_PERMISSIONS.protectionPlans.edit.level,
    ACTION_PERMISSIONS.protectionPlans.edit.deny,
  );
  const canDuplicate = usePermission(
    ACTION_PERMISSIONS.protectionPlans.duplicate.scope,
    ACTION_PERMISSIONS.protectionPlans.duplicate.level,
    ACTION_PERMISSIONS.protectionPlans.duplicate.deny,
  );
  const canCancel = usePermission(
    ACTION_PERMISSIONS.protectionPlans.cancel.scope,
    ACTION_PERMISSIONS.protectionPlans.cancel.level,
    ACTION_PERMISSIONS.protectionPlans.cancel.deny,
  );
  const canReactivate = usePermission(
    ACTION_PERMISSIONS.protectionPlans.reactivate.scope,
    ACTION_PERMISSIONS.protectionPlans.reactivate.level,
    ACTION_PERMISSIONS.protectionPlans.reactivate.deny,
  );
  const canDelete = usePermission(
    ACTION_PERMISSIONS.protectionPlans.delete.scope,
    ACTION_PERMISSIONS.protectionPlans.delete.level,
    ACTION_PERMISSIONS.protectionPlans.delete.deny,
  );

  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const phase = plan.phase;
    const editDisabled = NON_EDITABLE_PHASES.includes(phase);
    const buttons: ToolbarConfig['buttons'] = [];
    if (canEdit) {
      buttons.push({
        key: 'edit',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.EDIT,
        icon: <EditOutlined />,
        variant: 'default',
        onClick: onEdit,
        disabled: editing || editDisabled,
        tooltip: editDisabled ? PPC.LABELS.DETAIL_PAGE.ACTIONS.EDIT_DISABLED_TOOLTIP : undefined,
      });
    }
    if (canDuplicate) {
      buttons.push({
        key: 'duplicate',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.DUPLICATE,
        icon: <CopyOutlined />,
        variant: 'default',
        onClick: onDuplicate,
        disabled: duplicating,
      });
    }
    if (canReactivate && REACTIVATABLE_PHASES.includes(phase)) {
      const expired = isReactivateExpired(plan);
      buttons.push({
        key: 'reactivate',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE,
        icon: <PlayCircleOutlined />,
        variant: 'primary',
        onClick: onReactivate,
        disabled: reactivating || expired,
        tooltip: expired
          ? PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_DISABLED_EXPIRED_TOOLTIP
          : undefined,
      });
    }
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
    if (canCancel && CANCELLABLE_PHASES.includes(phase)) {
      buttons.push({
        key: 'cancel',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.CANCEL,
        icon: <StopOutlined />,
        variant: 'danger',
        onClick: onCancel,
        disabled: cancelling,
      });
    }
    if (canDelete) {
      buttons.push({
        key: 'delete',
        label: PPC.LABELS.ACTIONS.DELETE,
        icon: <DeleteOutlined />,
        variant: 'danger',
        onClick: onDelete,
        disabled: deleting,
      });
    }
    return { buttons };
  }, [
    plan,
    duplicating,
    editing,
    cancelling,
    reactivating,
    deleting,
    refreshingHealth,
    onDuplicate,
    onEdit,
    onCancel,
    onReactivate,
    onDelete,
    onRefreshHealth,
    canEdit,
    canDuplicate,
    canCancel,
    canReactivate,
    canDelete,
  ]);

  return <Toolbar config={toolbarConfig} />;
};

export default ProtectionPlanDetailsToolbar;
