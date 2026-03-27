import React from 'react';
import { Button } from 'antd';
import { AppstoreOutlined, ReloadOutlined } from '@ant-design/icons';
import { APPLICATIONS_CONSTANTS } from '../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';

interface EmptyProps {
  onRefresh: () => void;
}

const ApplicationsMainEmpty: React.FC<EmptyProps> = React.memo(({ onRefresh }) => {
  return (
    <div style={APPLICATIONS_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER}>
      <div style={APPLICATIONS_CONSTANTS.LAYOUT.EMPTY_ICON}>
        <AppstoreOutlined />
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_PRIMARY,
          marginBottom: 8,
        }}
      >
        {APPLICATIONS_CONSTANTS.MESSAGES.NO_APPLICATIONS_TITLE}
      </div>

      <div
        style={{
          color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_SECONDARY,
          marginBottom: 20,
          maxWidth: APPLICATIONS_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
          lineHeight: 1.6,
        }}
      >
        {APPLICATIONS_CONSTANTS.MESSAGES.NO_APPLICATIONS_DESCRIPTION}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>
          {CONNECTIVITY_CONSTANTS.MESSAGES.REFRESH}
        </Button>
      </div>
    </div>
  );
});

ApplicationsMainEmpty.displayName = 'ApplicationsMainEmpty';

export default ApplicationsMainEmpty;

