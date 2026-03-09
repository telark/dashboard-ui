import React, { memo, useMemo } from 'react';
import { ROLES_CONSTANTS as RC } from '../constants';
import EmptyState from '../../../../components/display/views/EmptyState';
import { Icons } from '../../../../constants';

const RoleIcon = Icons.Role;

interface RolesEmptyPageProps {
  onCreateRoleClick: () => void;
}

const RolesEmptyPage: React.FC<RolesEmptyPageProps> = memo(({ onCreateRoleClick }) => {
  const buttonIcon = useMemo(() => <RoleIcon size={16} />, []);
  const icon = useMemo(() => <RoleIcon size={32} />, []);

  return (
    <EmptyState
      title={RC.LABELS.NO_ROLES_TITLE}
      description={RC.LABELS.NO_ROLES_DESCRIPTION}
      buttonText={RC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL}
      buttonIcon={buttonIcon}
      onButtonClick={onCreateRoleClick}
      icon={icon}
    />
  );
});

RolesEmptyPage.displayName = 'RolesEmptyPage';

export default RolesEmptyPage;
