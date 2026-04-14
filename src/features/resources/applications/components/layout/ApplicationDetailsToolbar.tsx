import React, { useMemo } from 'react';
import { SyncOutlined } from '@ant-design/icons';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants';

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
  const toolbarConfig: ToolbarConfig = useMemo(
    () => ({
      buttons: [
        {
          key: 'forceSync',
          label: APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC,
          icon: <SyncOutlined />,
          variant: 'primary',
          onClick: onForceSync,
          disabled: syncDisabled,
          tooltip: syncDisabled ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP : undefined,
        },
        {
          key: 'edit',
          label: APPLICATIONS_UI.CARD.ACTIONS.EDIT,
          variant: 'default',
          onClick: onEdit,
          disabled: syncDisabled,
          tooltip: syncDisabled ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP : undefined,
        },
        {
          key: 'snapshots',
          label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_SNAPSHOTS,
          variant: 'default',
          onClick: onManageSnapshots,
        },
        {
          key: 'rollbacks',
          label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS,
          variant: 'default',
          onClick: onManageRollbacks,
        },
        {
          key: 'delete',
          label: APPLICATIONS_UI.CARD.ACTIONS.DELETE,
          variant: 'danger',
          onClick: onDelete,
          disabled: syncDisabled,
          tooltip: syncDisabled ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP : undefined,
        },
      ],
    }),
    [syncDisabled, onDelete, onEdit, onForceSync, onManageRollbacks, onManageSnapshots],
  );

  return <Toolbar config={toolbarConfig} />;
};

export default ApplicationDetailsToolbar;
