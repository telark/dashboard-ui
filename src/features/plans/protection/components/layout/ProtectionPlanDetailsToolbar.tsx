import React, { useCallback, useMemo } from 'react';
import type { MenuProps } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarButtonConfig, ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { usePermission, ACTION_PERMISSIONS } from '../../../../auth/hooks';
import { getCurrentUser } from '../../../../auth/utils';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { ProtectionPlan } from '../../models';
import {
  APPROVABLE_PHASES,
  CANCELLABLE_PHASES,
  REACTIVATABLE_PHASES,
  getDecideBlockedTooltip,
  getGenerateReportTooltip,
  isReactivateExpired,
  isReportNotStarted,
  permissionTooltip,
} from '../../utils/phaseRules';

interface ProtectionPlanDetailsToolbarProps {
  plan: ProtectionPlan;
  duplicating: boolean;
  editing: boolean;
  canceling: boolean;
  reactivating: boolean;
  approving: boolean;
  rejecting: boolean;
  deleting: boolean;
  onDuplicate: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onReactivate: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  generatingReport: boolean;
  onGenerateReport: () => void;
}

const DUPLICATE_MENU_KEY = 'duplicate';
const CANCEL_MENU_KEY = 'cancel';
const DELETE_MENU_KEY = 'delete';
const PD = PPC.LABELS.PERMISSION_DENIED;

interface DecideButtonsArgs {
  plan: ProtectionPlan;
  canApprove: boolean;
  canReject: boolean;
  approving: boolean;
  rejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
}

const decideButtons = ({
  plan,
  canApprove,
  canReject,
  approving,
  rejecting,
  onApprove,
  onReject,
}: DecideButtonsArgs): ToolbarButtonConfig[] => {
  const blockedTooltip = getDecideBlockedTooltip(plan, getCurrentUser()?.id ?? '');
  const decideDisabled = approving || rejecting || blockedTooltip !== undefined;
  return [
    {
      key: 'approve',
      label: PPC.LABELS.DETAIL_PAGE.ACTIONS.APPROVE,
      icon: <CheckCircleOutlined />,
      // Outlined, like Applications' main verb: no filled primary on a details page.
      variant: 'default',
      onClick: onApprove,
      disabled: !canApprove || decideDisabled,
      tooltip: permissionTooltip(canApprove, PD.APPROVE, blockedTooltip),
    },
    {
      key: 'reject',
      label: PPC.LABELS.DETAIL_PAGE.ACTIONS.REJECT,
      icon: <CloseCircleOutlined />,
      variant: 'danger',
      onClick: onReject,
      disabled: !canReject || decideDisabled,
      tooltip: permissionTooltip(canReject, PD.REJECT, blockedTooltip),
    },
  ];
};

interface OverflowItemsArgs {
  plan: ProtectionPlan;
  canDuplicate: boolean;
  canCancel: boolean;
  canDelete: boolean;
  duplicating: boolean;
  canceling: boolean;
  deleting: boolean;
}

// A disabled item keeps its reason in its title.
const overflowItems = ({
  plan,
  canDuplicate,
  canCancel,
  canDelete,
  duplicating,
  canceling,
  deleting,
}: OverflowItemsArgs): MenuProps['items'] => [
  {
    key: DUPLICATE_MENU_KEY,
    icon: <CopyOutlined />,
    label: PPC.LABELS.ACTIONS.DUPLICATE,
    disabled: !canDuplicate || duplicating,
    title: permissionTooltip(canDuplicate, PD.DUPLICATE),
  },
  { type: 'divider' as const },
  ...(CANCELLABLE_PHASES.includes(plan.phase)
    ? [
        {
          key: CANCEL_MENU_KEY,
          danger: true,
          icon: <StopOutlined />,
          label: PPC.LABELS.ACTIONS.CANCEL,
          disabled: !canCancel || canceling,
          title: permissionTooltip(canCancel, PD.CANCEL),
        },
      ]
    : []),
  {
    key: DELETE_MENU_KEY,
    danger: true,
    icon: <DeleteOutlined />,
    label: PPC.LABELS.ACTIONS.DELETE,
    disabled: !canDelete || deleting,
    title: permissionTooltip(canDelete, PD.DELETE),
  },
];

const ProtectionPlanDetailsToolbar: React.FC<ProtectionPlanDetailsToolbarProps> = ({
  plan,
  duplicating,
  editing,
  canceling,
  reactivating,
  approving,
  rejecting,
  deleting,
  onDuplicate,
  onEdit,
  onCancel,
  onReactivate,
  onApprove,
  onReject,
  onDelete,
  generatingReport,
  onGenerateReport,
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
  const canApprove = usePermission(
    ACTION_PERMISSIONS.protectionPlans.approve.scope,
    ACTION_PERMISSIONS.protectionPlans.approve.level,
    ACTION_PERMISSIONS.protectionPlans.approve.deny,
  );
  const canReject = usePermission(
    ACTION_PERMISSIONS.protectionPlans.reject.scope,
    ACTION_PERMISSIONS.protectionPlans.reject.level,
    ACTION_PERMISSIONS.protectionPlans.reject.deny,
  );
  const canDelete = usePermission(
    ACTION_PERMISSIONS.protectionPlans.delete.scope,
    ACTION_PERMISSIONS.protectionPlans.delete.level,
    ACTION_PERMISSIONS.protectionPlans.delete.deny,
  );
  const canGenerateReport = usePermission(
    ACTION_PERMISSIONS.protectionPlans.generateReport.scope,
    ACTION_PERMISSIONS.protectionPlans.generateReport.level,
    ACTION_PERMISSIONS.protectionPlans.generateReport.deny,
  );

  const handleMenuClick = useCallback(
    (key: string) => {
      if (key === DUPLICATE_MENU_KEY) onDuplicate();
      else if (key === CANCEL_MENU_KEY) onCancel();
      else if (key === DELETE_MENU_KEY) onDelete();
    },
    [onDuplicate, onCancel, onDelete],
  );

  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const phase = plan.phase;
    const buttons: ToolbarConfig['buttons'] = [];
    if (APPROVABLE_PHASES.includes(phase)) {
      buttons.push(
        ...decideButtons({
          plan,
          canApprove,
          canReject,
          approving,
          rejecting,
          onApprove,
          onReject,
        }),
      );
    }
    // Reactivate is the main verb when it applies: first and outlined, like Applications' Force Sync.
    if (REACTIVATABLE_PHASES.includes(phase)) {
      const expired = isReactivateExpired(plan);
      buttons.push({
        key: 'reactivate',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE,
        icon: <PlayCircleOutlined />,
        variant: 'default',
        onClick: onReactivate,
        disabled: !canReactivate || reactivating || expired,
        tooltip: permissionTooltip(
          canReactivate,
          PD.REACTIVATE,
          expired ? PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_DISABLED_EXPIRED_TOOLTIP : undefined,
        ),
      });
    }
    buttons.push(
      {
        key: 'edit',
        label: PPC.LABELS.DETAIL_PAGE.ACTIONS.EDIT,
        icon: <EditOutlined />,
        variant: 'ghost',
        onClick: onEdit,
        disabled: !canEdit || editing,
        tooltip: permissionTooltip(canEdit, PD.EDIT),
      },
      {
        key: 'generateReport',
        label: PPC.LABELS.REPORTS.GENERATE,
        icon: <FileTextOutlined />,
        variant: 'ghost',
        onClick: onGenerateReport,
        loading: generatingReport,
        disabled:
          !canGenerateReport ||
          generatingReport ||
          isReportNotStarted(plan) ||
          !getCurrentUser()?.id,
        tooltip: getGenerateReportTooltip(plan, canGenerateReport),
      },
    );
    // Duplicate sits in the overflow above cancel and delete, like Applications' panels above
    // reset.
    buttons.push({
      key: 'more',
      label: PPC.LABELS.DETAIL_PAGE.ACTIONS.MORE_LABEL,
      icon: <EllipsisOutlined />,
      variant: 'ghost',
      dropdown: {
        items: overflowItems({
          plan,
          canDuplicate,
          canCancel,
          canDelete,
          duplicating,
          canceling,
          deleting,
        }),
        onItemClick: handleMenuClick,
      },
    });
    return { buttons };
  }, [
    plan,
    duplicating,
    editing,
    canceling,
    reactivating,
    approving,
    rejecting,
    deleting,
    generatingReport,
    handleMenuClick,
    onEdit,
    onReactivate,
    onApprove,
    onReject,
    onGenerateReport,
    canEdit,
    canDuplicate,
    canCancel,
    canReactivate,
    canApprove,
    canReject,
    canDelete,
    canGenerateReport,
  ]);

  return <Toolbar config={toolbarConfig} />;
};

export default ProtectionPlanDetailsToolbar;
