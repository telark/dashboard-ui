import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { APP_ROUTES, Icons, SHARED_DETAILS_CONSTANTS } from '../../constants';
import { USERS_CONSTANTS as UC } from '../../constants/pages/users';
import Header from '../../components/display/shared/sections/Header';
import UsersTable from '../../components/display/users/list/Table';
import { PageContainer } from '../../components/shared';
import { RootState, AppDispatch } from '../../store';
import { fetchAllUsersThunk } from '../../store/users/slices/userSlice';

const UserIcon = Icons.User;

const UsersList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  const handleView = (record: any) => navigate(`${APP_ROUTES.USERS}/${record.id}/view`);

  if (loading) {
    return (
      <PageContainer>
        <Header
          subtitle={UC.LABELS.HEADER_SUBTITLE}
          primaryText={UC.LABELS.CREATE_BUTTON}
          onPrimary={() => navigate(APP_ROUTES.USER_CREATE)}
          breadcrumbs={[{ label: UC.LABELS.BREADCRUMBS.USERS }]}
          icon={<UserIcon />}
        />
        <div>{SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING}</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header
          subtitle={UC.LABELS.HEADER_SUBTITLE}
          primaryText={UC.LABELS.CREATE_BUTTON}
          onPrimary={() => navigate(APP_ROUTES.USER_CREATE)}
          breadcrumbs={[{ label: UC.LABELS.BREADCRUMBS.USERS }]}
          icon={<UserIcon />}
        />
        <div>Error: {error}</div>
      </PageContainer>
    );
  }

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
        onUsersChange={() => {
          // Users are managed by Redux, so we don't need to update local state
          // This is kept for compatibility with the table component
        }}
        onView={handleView as any}
        onEdit={(record) => navigate(`${APP_ROUTES.USERS}/${record.id}/edit`)}
      />
    </PageContainer>
  );
};

export default UsersList;
