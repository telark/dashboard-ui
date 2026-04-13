import React, { useMemo } from 'react';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants';

interface ApplicationDetailsToolbarProps {
  onEdit: () => void;
  editDisabled?: boolean;
  onManageSnapshots: () => void;
  onManageRollbacks: () => void;
  onDelete: () => void;
}

const ApplicationDetailsToolbar: React.FC<ApplicationDetailsToolbarProps> = ({
  onEdit,
  editDisabled = false,
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
          variant: 'default',
          onClick: onEdit,
          disabled: editDisabled,
          tooltip: editDisabled ? APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP : undefined,
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
        },
      ],
    }),
    [editDisabled, onDelete, onEdit, onManageRollbacks, onManageSnapshots],
  );

  return <Toolbar config={toolbarConfig} />;
};

export default ApplicationDetailsToolbar;
