import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, ICONS } from '../../constants';
import { USERS_CONSTANTS as UC } from '../../constants/pages/users';
import { STATIC_USERS } from '../../data/users';
import Header from '../../components/display/shared/sections/Header';
import UsersTable from '../../components/display/users/list/Table';
import { PageContainer } from '../../components/shared';

const UserIcon = ICONS.USER;

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState(STATIC_USERS);
  const handleView = (record: any) => navigate(`${APP_ROUTES.USERS}/${record.id}/view`);

  return (
    <PageContainer>
      <Header
        subtitle={UC.LABELS.HEADER_SUBTITLE}
        primaryText={UC.LABELS.CREATE_BUTTON}
        onPrimary={() => navigate(APP_ROUTES.USER_CREATE)}
        breadcrumbs={[{ label: UC.LABELS.BREADCRUMBS.USERS }]}
        icon={<UserIcon />}
      />

      <UsersTable
        users={users as any}
        onUsersChange={setUsers as any}
        onView={handleView as any}
        onEdit={(record) => navigate(`${APP_ROUTES.USERS}/${record.id}/edit`)}
      />
    </PageContainer>
  );
};

export default UsersList;

