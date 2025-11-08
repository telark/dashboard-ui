import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_GROUPS } from '../../data/groups';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import { createGroupViewConfig } from '../../config/groupViewConfig';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';

const GroupIcon = ICONS.GROUP;

const ViewGroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const group = useMemo(() => {
    return STATIC_GROUPS.find((g) => g.id === id);
  }, [id]);

  const config = useMemo(() => {
    if (!group) return null;
    return createGroupViewConfig(group);
  }, [group]);

  if (!group || !config) {
    return (
      <div
        style={{
          padding: '48px 24px 24px',
          marginTop: '60px',
          background: DEFAULT_COLORS.PAGE_BG,
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <div>Group not found</div>
      </div>
    );
  }

  const breadcrumbs = [{ label: 'Groups', to: APP_ROUTES.GROUPS }, { label: group.name }];

  return (
    <div
      style={{
        padding: '48px 24px 24px',
        marginTop: '60px',
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: 'calc(100vh - 60px)',
      }}
      className="app-root"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Header subtitle="View group details" breadcrumbs={breadcrumbs} icon={<GroupIcon />} />

        <AnimatedPageWrapper>
          <ViewDetails config={config} />
        </AnimatedPageWrapper>
      </div>
    </div>
  );
};

export default ViewGroup;
