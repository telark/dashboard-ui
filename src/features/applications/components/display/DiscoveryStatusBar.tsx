import React from 'react';
import { Typography } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import { FancySpinner } from '../../../../components/animation';
import { APPLICATIONS_UI, DISCOVERY_STATUS_BAR } from '../../constants';
import { useDiscoveryStatus } from '../../hooks/useDiscoveryStatus';

interface DiscoveryStatusBarProps {
  onCycleComplete: () => void;
}

const DiscoveryStatusBar: React.FC<DiscoveryStatusBarProps> = ({ onCycleComplete }) => {
  const status = useDiscoveryStatus(onCycleComplete);

  if (!status) return <div style={{ minHeight: DISCOVERY_STATUS_BAR.MIN_HEIGHT_PX }} />;

  const text = status.inProgress
    ? APPLICATIONS_UI.DISCOVERY_IN_PROGRESS(status.remaining)
    : APPLICATIONS_UI.DISCOVERY_IDLE;

  return (
    <div
      data-testid="discovery-status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minHeight: DISCOVERY_STATUS_BAR.MIN_HEIGHT_PX,
      }}
    >
      {status.inProgress ? (
        <FancySpinner size={14} color={DEFAULT_COLORS.WARNING} />
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
