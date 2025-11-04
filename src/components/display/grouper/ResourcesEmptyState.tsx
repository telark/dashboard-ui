import React from 'react';
import { AppstoreOutlined, SyncOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { DEFAULT_COLORS } from '../../../constants';
import { UI } from '../../../constants/layout/ui';

const ResourcesEmptyState: React.FC = React.memo(() => {
  const handleRefresh = () => window.location.reload();

  return (
    <div
      style={{
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(32,201,151,0.12)',
          boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
          color: DEFAULT_COLORS.SUCCESS,
          fontSize: 24,
        }}
      >
        <AppstoreOutlined />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#0B1F33', marginBottom: 6 }}>
        {UI.RESOURCES.EMPTY_TITLE}
      </div>
      <div style={{ color: '#5B6B7C', marginBottom: 16, maxWidth: 520, lineHeight: 1.6 }}>
        {UI.RESOURCES.EMPTY_DESC}
      </div>
      <Button type="primary" icon={<SyncOutlined />} onClick={handleRefresh}>
        {UI.RESOURCES.REFRESH}
      </Button>
    </div>
  );
});

ResourcesEmptyState.displayName = 'ResourcesEmptyState';
export default ResourcesEmptyState;
