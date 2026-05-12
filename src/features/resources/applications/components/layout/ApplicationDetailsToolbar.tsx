import React, { useMemo } from 'react';
import {
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  HistoryOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../features/auth/hooks/permissions/permissionEngine';

interface ApplicationDetailsToolbarProps {
  onForceSync: () => void;
  syncDisabled?: boolean;
  onEdit: () => void;
  onManageSnapshots: () => void;
  onManageRollbacks: () => void;
  onDelete: () => void;
}

const ApplicationDetailsToolbar: React.FC<ApplicationDetailsToolbarProps> = ({
  onForceSync,
  syncDisabled = false,
  onEdit,
  onManageSnapshots,
  onManageRollbacks,
  onDelete,
}) => {
  const canEdit = usePermission(
    ACTION_PERMISSIONS.applications.edit.scope,
    ACTION_PERMISSIONS.applications.edit.level,
    ACTION_PERMISSIONS.applications.edit.deny,
  );
  const canForceSync = usePermission(
    ACTION_PERMISSIONS.applications.forceSync.scope,
    ACTION_PERMISSIONS.applications.forceSync.level,
    ACTION_PERMISSIONS.applications.forceSync.deny,
  );
  const canViewSnapshots = usePermission(
    ACTION_PERMISSIONS.applications.viewSnapshots.scope,
    ACTION_PERMISSIONS.applications.viewSnapshots.level,
    ACTION_PERMISSIONS.applications.viewSnapshots.deny,
  );
  const canViewRollbacks = usePermission(
    ACTION_PERMISSIONS.applications.viewRollbacks.scope,
    ACTION_PERMISSIONS.applications.viewRollbacks.level,
    ACTION_PERMISSIONS.applications.viewRollbacks.deny,
  );
  const canDelete = usePermission(
    ACTION_PERMISSIONS.applications.delete.scope,
    ACTION_PERMISSIONS.applications.delete.level,
    ACTION_PERMISSIONS.applications.delete.deny,
  );

  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const buttons: ToolbarConfig['buttons'] = [
      {
        key: 'edit',
        label: APPLICATIONS_UI.CARD.ACTIONS.EDIT,
        icon: <EditOutlined />,
        variant: 'default',
        onClick: onEdit,
        disabled: !canEdit || syncDisabled,
        tooltip: !canEdit
          ? APPLICATIONS_UI.CARD.ACTIONS.EDIT_PERMISSION_DENIED_TOOLTIP
          : syncDisabled
            ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
            : undefined,
      },
      {
        key: 'forceSync',
        label: APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC,
        icon: <SyncOutlined />,
        variant: 'default',
        onClick: onForceSync,
        disabled: !canForceSync || syncDisabled,
        tooltip: !canForceSync
          ? APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC_PERMISSION_DENIED_TOOLTIP
          : syncDisabled
            ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
            : undefined,
      },
      {
        key: 'snapshots',
        label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_SNAPSHOTS,
        icon: <DatabaseOutlined />,
        variant: 'default',
        onClick: onManageSnapshots,
        disabled: !canViewSnapshots,
        tooltip: !canViewSnapshots
          ? APPLICATIONS_UI.CARD.ACTIONS.VIEW_SNAPSHOTS_PERMISSION_DENIED_TOOLTIP
          : undefined,
      },
      {
        key: 'rollbacks',
        label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS,
        icon: <HistoryOutlined />,
        variant: 'default',
        onClick: onManageRollbacks,
        disabled: !canViewRollbacks,
        tooltip: !canViewRollbacks
          ? APPLICATIONS_UI.CARD.ACTIONS.VIEW_ROLLBACKS_PERMISSION_DENIED_TOOLTIP
          : undefined,
      },
      {
        key: 'delete',
        label: APPLICATIONS_UI.CARD.ACTIONS.DELETE,
        icon: <DeleteOutlined />,
        variant: 'danger',
        onClick: onDelete,
        disabled: !canDelete || syncDisabled,
        tooltip: !canDelete
          ? APPLICATIONS_UI.CARD.ACTIONS.DELETE_PERMISSION_DENIED_TOOLTIP
          : syncDisabled
            ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
            : undefined,
      },
    ];
    return { buttons };
  }, [
    syncDisabled,
    onDelete,
    onEdit,
    onForceSync,
    onManageRollbacks,
    onManageSnapshots,
    canEdit,
    canForceSync,
    canViewSnapshots,
    canViewRollbacks,
    canDelete,
  ]);

  return <Toolbar config={toolbarConfig} />;
};

export default ApplicationDetailsToolbar;
