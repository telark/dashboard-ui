import React from 'react';
import { APP_ROUTES, ICONS } from '../../constants';
import { USERS_CONSTANTS as UC } from '../../constants/pages/users';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_USERS } from '../../data/users';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import { createUserViewConfig } from '../../config/userViewConfig';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useViewPage } from '../../hooks/useViewPage';
import type { User } from '../../interfaces/users';

const UserIcon = ICONS.USER;

const ViewUser: React.FC = () => {
  const {
    item: user,
    config,
    notFound,
  } = useViewPage<User>({
    data: STATIC_USERS,
    findById: (id, data) => data.find((u) => u.id === id),
    createConfig: createUserViewConfig,
  });

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

