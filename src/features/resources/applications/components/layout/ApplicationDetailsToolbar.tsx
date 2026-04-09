import React, { useMemo } from 'react';
import Toolbar from '../../../../../components/display/toolbar/Toolbar';
import type { ToolbarConfig } from '../../../../../interfaces/layout/toolbar';
import { APPLICATIONS_UI } from '../../constants';

interface ApplicationDetailsToolbarProps {
  onEdit: () => void;
  onManageSnapshots: () => void;
  onManageRollbacks: () => void;
  onDelete: () => void;
}

const ApplicationDetailsToolbar: React.FC<ApplicationDetailsToolbarProps> = ({
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
          variant: 'default',
          onClick: onEdit,
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
    [onDelete, onEdit, onManageRollbacks, onManageSnapshots],
  );

  return <Toolbar config={toolbarConfig} />;
};

export default ApplicationDetailsToolbar;
