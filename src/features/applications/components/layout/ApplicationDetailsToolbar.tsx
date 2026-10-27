import React, { useCallback, useMemo } from 'react';
import {
  DatabaseOutlined,
  ClearOutlined,
  EditOutlined,
  EllipsisOutlined,
  HistoryOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import Toolbar from '../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import { Icons, MENU_LABELS } from '../../../../constants';
import { APPLICATIONS_UI } from '../../constants';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../auth/hooks/permissions/permissionEngine';

const TOOLBAR_LABELS = APPLICATIONS_UI.SECTIONS.DETAILS_TOOLBAR;
const RESET_MENU_KEY = 'reset';
const SNAPSHOTS_MENU_KEY = 'snapshots';
const ROLLBACKS_MENU_KEY = 'rollbacks';

// A disabled menu item says why on hover, like the card's menu.
const labelWithTooltip = (text: string, tooltip: string | undefined) =>
  tooltip ? (
    <Tooltip title={tooltip}>
      <span>{text}</span>
    </Tooltip>
  ) : (
    text
  );

interface ApplicationDetailsToolbarProps {
  onForceSync: () => void;
  syncDisabled?: boolean;
  onEdit: () => void;
  onManageSnapshots: () => void;
  onManageRollbacks: () => void;
  // Undefined when the application has no namespace, so no insights document can exist.
  onOpenInsights?: () => void;
  onReset: () => void;
}

const ApplicationDetailsToolbar: React.FC<ApplicationDetailsToolbarProps> = ({
  onForceSync,
  syncDisabled = false,
  onEdit,
  onManageSnapshots,
  onManageRollbacks,
  onOpenInsights,
  onReset,
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
  const canReset = usePermission(
    ACTION_PERMISSIONS.applications.delete.scope,
    ACTION_PERMISSIONS.applications.delete.level,
    ACTION_PERMISSIONS.applications.delete.deny,
  );
  const canViewInsights = usePermission(
    ACTION_PERMISSIONS.insights.view.scope,
    ACTION_PERMISSIONS.insights.view.level,
  );

  const handleMenuClick = useCallback(
    (key: string) => {
      if (key === RESET_MENU_KEY) onReset();
      if (key === SNAPSHOTS_MENU_KEY) onManageSnapshots();
      if (key === ROLLBACKS_MENU_KEY) onManageRollbacks();
    },
    [onReset, onManageSnapshots, onManageRollbacks],
  );

  const toolbarConfig: ToolbarConfig = useMemo(() => {
    const buttons: ToolbarConfig['buttons'] = [
      // First, outlined: the verb people come here for, without a filled primary.
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
      ...(onOpenInsights && canViewInsights
        ? [
            {
              key: 'insights',
              label: MENU_LABELS.INSIGHTS,
              icon: <Icons.Insights />,
              variant: 'ghost' as const,
              onClick: onOpenInsights,
            },
          ]
        : []),
      // The panels open from the overflow. Reset sits there too, apart from them: it is irreversible.
      {
        key: 'more',
        label: TOOLBAR_LABELS.MORE_LABEL,
        icon: <EllipsisOutlined />,
        variant: 'ghost',
        dropdown: {
          items: [
            {
              key: SNAPSHOTS_MENU_KEY,
              icon: <DatabaseOutlined />,
              label: labelWithTooltip(
                APPLICATIONS_UI.CARD.ACTIONS.MANAGE_SNAPSHOTS,
                canViewSnapshots
                  ? undefined
                  : APPLICATIONS_UI.CARD.ACTIONS.VIEW_SNAPSHOTS_PERMISSION_DENIED_TOOLTIP,
              ),
              disabled: !canViewSnapshots,
            },
            {
              key: ROLLBACKS_MENU_KEY,
              icon: <HistoryOutlined />,
              label: labelWithTooltip(
                APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS,
                canViewRollbacks
                  ? undefined
                  : APPLICATIONS_UI.CARD.ACTIONS.VIEW_ROLLBACKS_PERMISSION_DENIED_TOOLTIP,
              ),
              disabled: !canViewRollbacks,
            },
            { type: 'divider' as const },
            {
              key: RESET_MENU_KEY,
              danger: true,
              icon: <ClearOutlined />,
              label: APPLICATIONS_UI.CARD.ACTIONS.RESET,
              disabled: !canReset || syncDisabled,
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
    onOpenInsights,
    canEdit,
    canForceSync,
    canViewSnapshots,
    canViewRollbacks,
    canReset,
    canViewInsights,
  ]);

  return <Toolbar config={toolbarConfig} />;
};

export default ApplicationDetailsToolbar;
