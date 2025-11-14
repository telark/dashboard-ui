import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { APP_ROUTES, ICONS, SHARED_DETAILS_CONSTANTS } from '../../constants';
import { USERS_CONSTANTS as UC } from '../../constants/pages/users';
import Header from '../../components/display/shared/sections/Header';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import { createUserViewConfig } from '../../config/userViewConfig';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useViewPage } from '../../hooks/useViewPage';
import { RootState, AppDispatch } from '../../store';
import { fetchAllUsersThunk } from '../../store/users/slices/userSlice';
import type { User } from '../../interfaces/resources/users';

const UserIcon = ICONS.USER;

const ViewUser: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (users.length === 0 && !loading) {
      dispatch(fetchAllUsersThunk());
    }
  }, [dispatch, users.length, loading]);

  const {
    item: user,
    config,
    notFound,
  } = useViewPage<User>({
    data: users,
    findById: (id, data) => data.find((u) => u.id === id),
    createConfig: createUserViewConfig,
  });

  if (loading) {
    return (
      <PageContainer>
        <Header subtitle={UC.LABELS.VIEW_SUBTITLE} breadcrumbs={[]} icon={<UserIcon />} />
        <div>{SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING}</div>
      </PageContainer>
    );
  }

  if (notFound || !user) {
    return <NotFound message={UC.LABELS.NOT_FOUND} />;
  }

  const breadcrumbs = [
    { label: UC.LABELS.BREADCRUMBS.USERS, to: APP_ROUTES.USERS },
    { label: user.fullname },
  ];

  return (
    <PageContainer>
      <Header subtitle={UC.LABELS.VIEW_SUBTITLE} breadcrumbs={breadcrumbs} icon={<UserIcon />} />

      <AnimatedPageWrapper>
        <ViewDetails config={config} />
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default ViewUser;
