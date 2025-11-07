import React from 'react';
import { DEFAULT_COLORS, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';

const GroupIcon = ICONS.GROUP;

const GroupsList: React.FC = () => {
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
        <Header
          subtitle="Manage groups"
          breadcrumbs={[{ label: 'Access Management' }, { label: 'Groups' }]}
          icon={<GroupIcon />}
        />
      </div>
    </div>
  );
};

export default GroupsList;
