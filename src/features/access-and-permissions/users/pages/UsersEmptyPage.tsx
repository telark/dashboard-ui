import React, { memo, useMemo } from 'react';
import { USERS_CONSTANTS as UC } from '../constants';
import EmptyState from '../../../../components/display/views/EmptyState';
import { Icons } from '../../../../constants';

const UserIcon = Icons.User;

interface UsersEmptyPageProps {
  onCreateUserClick: () => void;
}

const UsersEmptyPage: React.FC<UsersEmptyPageProps> = memo(({ onCreateUserClick }) => {
  const buttonIcon = useMemo(() => <UserIcon size={16} />, []);
  const icon = useMemo(() => <UserIcon size={32} />, []);

  return (
    <EmptyState
      title={UC.LABELS.MESSAGES.NO_USERS_TITLE}
      description={UC.LABELS.MESSAGES.NO_USERS_DESCRIPTION}
      buttonText={UC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL}
      buttonIcon={buttonIcon}
      onButtonClick={onCreateUserClick}
      icon={icon}
    />
  );
});

UsersEmptyPage.displayName = 'UsersEmptyPage';

export default UsersEmptyPage;
