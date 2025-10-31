import React from 'react';
import { Empty, Button, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { WorkloadCard } from '../../../cards';
import { FancySpinner } from '../../../shared';
import { WORKLOADS_PAGE_CONSTANTS } from '../../../../constants/pages/workloads';
import type { AppWorkloadCardData } from '../../../../interfaces/workload';

const { Title, Text } = Typography;

interface AppsListProps {
  apps: AppWorkloadCardData[];
  loading?: boolean;
  onAppClick?: (app: AppWorkloadCardData) => void;
  onRefresh?: () => void;
  showFullEmptyMessage?: boolean;
}

const AppsList: React.FC<AppsListProps> = React.memo(function AppsList({
  apps,
  loading = false,
  onAppClick,
  onRefresh,
  showFullEmptyMessage = false,
}) {
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          width: '100%',
        }}
      >
        <FancySpinner label="Loading apps" showLabel={true} />
      </div>
    );
  }

  if (apps.length === 0) {
    // Show full empty message when both apps and batches are empty
    if (showFullEmptyMessage) {
      return (
        <div style={WORKLOADS_PAGE_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER}>
          <div style={{ textAlign: 'center', maxWidth: WORKLOADS_PAGE_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH }}>
            <div style={WORKLOADS_PAGE_CONSTANTS.LAYOUT.EMPTY_ICON}>
              <ReloadOutlined />
            </div>

            <Title
              level={3}
              style={{ color: WORKLOADS_PAGE_CONSTANTS.COLORS.TEXT_PRIMARY, marginBottom: 8 }}
            >
              {WORKLOADS_PAGE_CONSTANTS.MESSAGES.NO_WORKLOADS_TITLE}
            </Title>

            <Text
              style={{
                color: WORKLOADS_PAGE_CONSTANTS.COLORS.TEXT_SECONDARY,
                marginBottom: 24,
                display: 'block',
              }}
            >
              {WORKLOADS_PAGE_CONSTANTS.MESSAGES.NO_WORKLOADS_DESCRIPTION}
            </Text>

            {onRefresh && (
              <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>
                {WORKLOADS_PAGE_CONSTANTS.MESSAGES.REFRESH}
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Show simple empty state when only apps are empty (but batches exist)
    return <Empty description="No apps found" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div style={{ width: '100%' }}>
      {apps.map((app) => (
        <WorkloadCard key={app.name} workload={app} onClick={() => onAppClick?.(app)} />
      ))}
    </div>
  );
});

export default AppsList;
