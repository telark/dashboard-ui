import React, { useMemo } from 'react';
import ViewPanel from '../../../../../components/display/panels/view/ViewPanel';
import { useViewRolePanelData } from '../../hooks';
import RoleScopesView from '../../components/display/view/RoleScopesView';
import { convertScopesFromAPI } from '../../utils';
import { ROLES_CONSTANTS as RC } from '../../constants';
import type { Role } from '../../models';

interface ViewRolePanelProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  onEdit?: () => void;
}

const ViewRolePanel: React.FC<ViewRolePanelProps> = ({
  open,
  onClose,
  role,
  onEdit,
}) => {
  const { details, name, description } = useViewRolePanelData({ role });

  const scopesRecord = useMemo(
    () => (role ? convertScopesFromAPI(role.scopesAndPermissions ?? []) : {}),
    [role],
  );

  const extraContent = useMemo(() => {
    if (Object.keys(scopesRecord).length === 0) return null;
    return <RoleScopesView scopes={scopesRecord} />;
  }, [scopesRecord]);

  if (!role) return null;

  return (
    <ViewPanel
      open={open}
      onClose={onClose}
      title={RC.LABELS.PANELS.VIEW.TITLE}
      name={name}
      description={description}
      details={details}
      extraContent={extraContent}
      width={520}
      actions={{ onEdit }}
    />
  );
};

export default ViewRolePanel;
