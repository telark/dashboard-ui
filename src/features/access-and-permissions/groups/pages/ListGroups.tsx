import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, Icons, SHARED_DETAILS_CONSTANTS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import GroupsTable from '../components/display/list/Table';
import EmptyState from '../../../../components/display/views/EmptyState';
import { PageContainer } from '../../../../components/shared';
import { useGroups } from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';

const GroupIcon = Icons.Group;

const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const { groups, loading, error } = useGroups();
  const { loading: categoriesLoading } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!loading && !categoriesLoading) {
      setHasInitialized(true);
    }
  }, [loading, categoriesLoading]);

  const isLoading = loading || categoriesLoading || !hasInitialized;
  const isEmpty = hasInitialized && !loading && !categoriesLoading && groups.length === 0;

  if (isLoading) {
    return (
      <PageContainer>
        <Header
          subtitle={GC.LABELS.HEADER_SUBTITLE}
          primaryText={GC.LABELS.FORM.BUTTON_TEXT}
          primaryIcon={<GroupIcon size={16} />}
          onPrimary={() => navigate(APP_ROUTES.GROUP_CREATE)}
          breadcrumbs={[{ label: GC.LABELS.BREADCRUMBS.GROUPS }]}
          icon={<GroupIcon />}
        />
        <div>{SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING}</div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Header
          subtitle={GC.LABELS.HEADER_SUBTITLE}
          primaryText={GC.LABELS.FORM.BUTTON_TEXT}
          primaryIcon={<GroupIcon size={16} />}
          onPrimary={() => navigate(APP_ROUTES.GROUP_CREATE)}
          breadcrumbs={[{ label: GC.LABELS.BREADCRUMBS.GROUPS }]}
          icon={<GroupIcon />}
        />
        <div>Error: {error}</div>
      </PageContainer>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={GC.LABELS.MESSAGES.NO_GROUPS_TITLE}
        description={GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}
        buttonText={GC.LABELS.FORM.BUTTON_TEXT}
        buttonIcon={<GroupIcon size={16} />}
        onButtonClick={() => navigate(APP_ROUTES.GROUP_CREATE)}
        icon={<GroupIcon size={40} />}
      />
    );
  }

  return (
    <PageContainer>
      <Header
        subtitle={GC.LABELS.HEADER_SUBTITLE}
        primaryText={GC.LABELS.FORM.BUTTON_TEXT}
        primaryIcon={<GroupIcon size={16} />}
        onPrimary={() => navigate(APP_ROUTES.GROUP_CREATE)}
        breadcrumbs={[{ label: GC.LABELS.BREADCRUMBS.GROUPS }]}
        icon={<GroupIcon />}
      />
      <GroupsTable
        groups={groups}
        onView={(group) => navigate(`${APP_ROUTES.GROUPS}/${group.id}/view`)}
        onEdit={(group) => navigate(`${APP_ROUTES.GROUPS}/${group.id}/edit`)}
      />
    </PageContainer>
  );
};

export default GroupsList;
