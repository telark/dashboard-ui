import React from 'react';
import { APP_ROUTES, Icons } from '../../constants';
import { GROUPS_CONSTANTS as GC } from '../../constants/pages/groups';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_GROUPS } from '../../data/groups';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import { createGroupViewConfig } from '../../config/groupViewConfig';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useViewPage } from '../../hooks/layout';
import type { Group } from '../../interfaces/resources/groups';

const GroupIcon = Icons.GROUP;

const ViewGroup: React.FC = () => {
  const {
    item: group,
    config,
    notFound,
  } = useViewPage<Group>({
    data: STATIC_GROUPS,
    findById: (id, data) => data.find((g) => g.id === id),
    createConfig: createGroupViewConfig,
  });

  if (notFound || !group) {
    return <NotFound message={GC.LABELS.NOT_FOUND} />;
  }

  const breadcrumbs = [
    { label: GC.LABELS.BREADCRUMBS.GROUPS, to: APP_ROUTES.GROUPS },
    { label: group.name },
  ];

  return (
    <PageContainer>
      <Header subtitle={GC.LABELS.VIEW_SUBTITLE} breadcrumbs={breadcrumbs} icon={<GroupIcon />} />

      <AnimatedPageWrapper>
        <ViewDetails config={config} />
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default ViewGroup;
