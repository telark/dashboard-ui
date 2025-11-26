import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { APP_ROUTES, Icons, SHARED_DETAILS_CONSTANTS } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import GroupsTable from '../components/display/list/Table';
import { PageContainer } from '../../../../components/shared';
import { RootState, AppDispatch } from '../../../../store';
import { fetchAllGroupsThunk } from '../store';

const GroupIcon = Icons.Group;

const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { groups, loading, error } = useSelector((state: RootState) => state.groups);

  useEffect(() => {
    dispatch(fetchAllGroupsThunk());
  }, [dispatch]);

  if (loading) {
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
