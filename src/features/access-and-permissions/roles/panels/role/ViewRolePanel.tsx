import React from 'react';
import ViewPanel from '../../../../../components/display/panels/view/ViewPanel';
import { useViewRolePanelData, useCanChangeRoleProtection } from '../../hooks';
import { useRoleViewTabs } from '../../hooks/panels/role/useRoleViewTabs';
import { canModifyRole } from '../../utils';
import { ROLES_CONSTANTS as RC } from '../../constants';
import type { Role } from '../../models';

interface ViewRolePanelProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  onEdit?: () => void;
}

const ViewRolePanel: React.FC<ViewRolePanelProps> = ({ open, onClose, role, onEdit }) => {
  const { details, name, description } = useViewRolePanelData({ role });
  const canChangeProtection = useCanChangeRoleProtection(role);

  const tabs = useRoleViewTabs(role);

  if (!role) return null;

  return (
    <ViewPanel
      open={open}
      onClose={onClose}
      title={RC.LABELS.PANELS.VIEW.TITLE}
      name={name}
      description={description}
      details={details}
      tabs={tabs}
      width={520}
      actions={{
        onEdit,
        editDisabledReason:
          canModifyRole(role) || canChangeProtection
            ? undefined
            : RC.LABELS.ACTIONS.EDIT_DISABLED_TOOLTIP,
      }}
    />
  );
};

export default ViewRolePanel;
