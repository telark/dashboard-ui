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
          key: 'edit',
          label: APPLICATIONS_UI.CARD.ACTIONS.EDIT,
          icon: <EditOutlined />,
          variant: 'default',
          onClick: onEdit,
          disabled: syncDisabled,
          tooltip: syncDisabled ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP : undefined,
        },
        {
          key: 'forceSync',
          label: APPLICATIONS_UI.CARD.ACTIONS.FORCE_SYNC,
          icon: <SyncOutlined />,
          variant: 'default',
          onClick: onForceSync,
          disabled: syncDisabled,
          tooltip: syncDisabled ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP : undefined,
        },
        {
          key: 'snapshots',
          label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_SNAPSHOTS,
          icon: <DatabaseOutlined />,
          variant: 'default',
          onClick: onManageSnapshots,
        },
        {
          key: 'rollbacks',
          label: APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS,
          icon: <HistoryOutlined />,
          variant: 'default',
          onClick: onManageRollbacks,
        },
        {
          key: 'delete',
          label: APPLICATIONS_UI.CARD.ACTIONS.DELETE,
          icon: <DeleteOutlined />,
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
