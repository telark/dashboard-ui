import React from 'react';
import { Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../constants';
import { APPLICATIONS_UI } from '../../constants';
import { useDiscoveryStatus } from '../../hooks/useDiscoveryStatus';

interface DiscoveryStatusBarProps {
  onCycleComplete: () => void;
}

const DiscoveryStatusBar: React.FC<DiscoveryStatusBarProps> = ({ onCycleComplete }) => {
  const status = useDiscoveryStatus(onCycleComplete);

  if (!status) return null;

  const text = status.inProgress
    ? APPLICATIONS_UI.DISCOVERY_IN_PROGRESS(status.remaining)
    : APPLICATIONS_UI.DISCOVERY_IDLE;

  return (
    <div data-testid="discovery-status" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {status.inProgress ? (
        <LoadingOutlined style={{ color: DEFAULT_COLORS.WARNING }} />
      ) : (
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            display: 'inline-block',
            background: DEFAULT_COLORS.SUCCESS,
          }}
        />
      )}
      <Typography.Text type="secondary">{text}</Typography.Text>
    </div>
  );
};

export default DiscoveryStatusBar;
