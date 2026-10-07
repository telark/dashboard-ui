import React, { memo } from 'react';
import { Button, Empty, Typography } from 'antd';
import { ROLES_CONSTANTS as RC } from '../constants';
import { EMPTY_ACTION_STYLE, EMPTY_CLASS, Icons } from '../../../../constants';

const RoleIcon = Icons.Role;

interface RolesEmptyPageProps {
  onCreateRoleClick?: () => void;
}

const RolesEmptyPage: React.FC<RolesEmptyPageProps> = memo(({ onCreateRoleClick }) => (
  <Empty
    className={EMPTY_CLASS.PAGE}
    image={<RoleIcon size={32} />}
    description={
      <>
        <Typography.Title level={3}>{RC.LABELS.NO_ROLES_TITLE}</Typography.Title>
        <Typography.Text>{RC.LABELS.NO_ROLES_DESCRIPTION}</Typography.Text>
      </>
    }
  >
    {onCreateRoleClick ? (
      <Button
        type="primary"
        icon={<RoleIcon size={16} />}
        onClick={onCreateRoleClick}
        style={EMPTY_ACTION_STYLE}
      >
        {RC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL}
      </Button>
    ) : null}
  </Empty>
));

RolesEmptyPage.displayName = 'RolesEmptyPage';

export default RolesEmptyPage;
