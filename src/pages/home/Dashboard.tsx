import React from 'react';
import { AppstoreOutlined, DeploymentUnitOutlined, BranchesOutlined } from '@ant-design/icons';
import ActionCard from '../../components/cards/ActionCard';
import { DEFAULT_COLORS } from '../../constants';

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '48px 24px 24px', marginTop: '60px', background: DEFAULT_COLORS.PAGE_BG, minHeight: 'calc(100vh - 60px)' }} className="app-root">

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(260px, 1fr))',
          gap: 16,
          alignItems: 'stretch',
        }}
      >
        <ActionCard title="See Groupers" icon={<AppstoreOutlined />} rightLabel="5 collected" footerTag="Last Sync was 5m ago" />
        <ActionCard title="See Workloads" icon={<DeploymentUnitOutlined />} rightLabel="5 collected" footerTag="Last Sync was 5m ago" />
        <ActionCard title="See Bridges" icon={<BranchesOutlined />} rightLabel="5 collected" footerTag="Last Sync was 5m ago" />
      </div>
    </div>
  );
};

export default Dashboard;


