import React from 'react';
import { APP_ROUTES, Icons, SHARED_DETAILS_CONSTANTS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import DetailsView from '../../../../components/display/views/DetailsView';
import { createGroupViewConfig } from '../config';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../../../components/shared';
import { useGroupDetails } from '../hooks';

const GroupIcon = Icons.Group;

const ViewGroup: React.FC = () => {
  const { group, loading, notFound } = useGroupDetails();

  if (loading) {
    return (
      <PageContainer>
        <Header subtitle={GC.LABELS.VIEW_SUBTITLE} breadcrumbs={[]} icon={<GroupIcon />} />
        <div>{SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING}</div>
      </PageContainer>
    );
  }

  if (notFound || !group) {
    return <NotFound message={GC.LABELS.NOT_FOUND} />;
  }

  const config = createGroupViewConfig(group);

  const breadcrumbs = [
    { label: GC.LABELS.BREADCRUMBS.GROUPS, to: APP_ROUTES.GROUPS },
    { label: group.name },
  ];

  return (
    <PageContainer>
      <Header subtitle={GC.LABELS.VIEW_SUBTITLE} breadcrumbs={breadcrumbs} icon={<GroupIcon />} />

      <AnimatedPageWrapper>
        <DetailsView config={config} />
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default ViewGroup;
