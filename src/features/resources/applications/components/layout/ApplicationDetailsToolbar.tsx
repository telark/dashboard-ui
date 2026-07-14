import React, { useCallback, useMemo } from 'react';
import {
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
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

const TOOLBAR_LABELS = APPLICATIONS_UI.SECTIONS.DETAILS_TOOLBAR;
const DELETE_MENU_KEY = 'delete';

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

  const handleMenuClick = useCallback(
    (key: string) => {
      if (key === DELETE_MENU_KEY) onDelete();
    },
    [onDelete],
  );

  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const buttons: ToolbarConfig['buttons'] = [
      // Primary action first: force sync is the verb people come here for.
      {
        key: 'forceSync',
        label: APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC,
        icon: <SyncOutlined />,
        variant: 'primary',
        onClick: onForceSync,
        disabled: !canForceSync || syncDisabled,
        tooltip: !canForceSync
          ? APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC_PERMISSION_DENIED_TOOLTIP
          : syncDisabled
            ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
            : undefined,
      },
      {
        key: 'edit',
        label: APPLICATIONS_UI.CARD.ACTIONS.EDIT,
        icon: <EditOutlined />,
        variant: 'ghost',
        onClick: onEdit,
        disabled: !canEdit || syncDisabled,
        tooltip: !canEdit
          ? APPLICATIONS_UI.CARD.ACTIONS.EDIT_PERMISSION_DENIED_TOOLTIP
          : syncDisabled
            ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
            : undefined,
      },
      // These open panels rather than acting on the app, so they stay quiet.
      {
        key: 'snapshots',
        label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_SNAPSHOTS,
        icon: <DatabaseOutlined />,
        variant: 'ghost',
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
        variant: 'ghost',
        onClick: onManageRollbacks,
        disabled: !canViewRollbacks,
        tooltip: !canViewRollbacks
          ? APPLICATIONS_UI.CARD.ACTIONS.VIEW_ROLLBACKS_PERMISSION_DENIED_TOOLTIP
          : undefined,
      },
      // Delete lives behind the overflow: it is irreversible and was one slip
      // away from "Manage rollbacks" when it sat inline.
      {
        key: 'more',
        label: TOOLBAR_LABELS.MORE_LABEL,
        icon: <EllipsisOutlined />,
        variant: 'ghost',
        dropdown: {
          items: [
            {
              key: DELETE_MENU_KEY,
              danger: true,
              icon: <DeleteOutlined />,
              label: APPLICATIONS_UI.CARD.ACTIONS.DELETE,
              disabled: !canDelete || syncDisabled,
            },
          ],
          onItemClick: handleMenuClick,
        },
      },
    ];
    return { buttons };
  }, [
    handleMenuClick,
    syncDisabled,
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
