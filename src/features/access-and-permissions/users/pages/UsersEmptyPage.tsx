import React, { memo } from 'react';
import { Button, Empty, Typography } from 'antd';
import { USERS_CONSTANTS as UC } from '../constants';
import { EMPTY_ACTION_STYLE, EMPTY_CLASS, Icons } from '../../../../constants';

const UserIcon = Icons.User;

interface UsersEmptyPageProps {
  onCreateUserClick?: () => void;
}

const UsersEmptyPage: React.FC<UsersEmptyPageProps> = memo(({ onCreateUserClick }) => (
  <Empty
    className={EMPTY_CLASS.PAGE}
    image={<UserIcon size={32} />}
    description={
      <>
        <Typography.Title level={3}>{UC.LABELS.MESSAGES.NO_USERS_TITLE}</Typography.Title>
        <Typography.Text>{UC.LABELS.MESSAGES.NO_USERS_DESCRIPTION}</Typography.Text>
      </>
    }
  >
    {onCreateUserClick ? (
      <Button
        type="primary"
        icon={<UserIcon size={16} />}
        onClick={onCreateUserClick}
        style={EMPTY_ACTION_STYLE}
      >
        {UC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL}
      </Button>
    ) : null}
  </Empty>
));

UsersEmptyPage.displayName = 'UsersEmptyPage';

export default UsersEmptyPage;
