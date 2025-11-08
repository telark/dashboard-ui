import React from 'react';
import { APP_ROUTES, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_GROUPS } from '../../data/groups';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import { createGroupViewConfig } from '../../config/groupViewConfig';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useViewPage } from '../../hooks/useViewPage';
import type { Group } from '../../interfaces/groups';

const GroupIcon = ICONS.GROUP;

const ViewGroup: React.FC = () => {
  const { item: group, config, notFound } = useViewPage<Group>({
    data: STATIC_GROUPS,
    findById: (id, data) => data.find((g) => g.id === id),
    createConfig: createGroupViewConfig,
  });

  if (notFound || !group) {
    return <NotFound message="Group not found" />;
  }

  const breadcrumbs = [{ label: 'Groups', to: APP_ROUTES.GROUPS }, { label: group.name }];

  return (
    <PageContainer>
      <Header subtitle="View group details" breadcrumbs={breadcrumbs} icon={<GroupIcon />} />

      <AnimatedPageWrapper>
        <ViewDetails config={config} />
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default ViewGroup;
