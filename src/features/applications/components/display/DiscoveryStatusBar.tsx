import React from 'react';
import { Typography } from 'antd';
import { DEFAULT_COLORS, SPACING, RADIUS } from '../../../../constants';
import { FancySpinner } from '../../../../components/animation';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import { APPLICATIONS_UI, DISCOVERY_STATUS_BAR } from '../../constants';
import { useDiscoveryStatus } from '../../hooks/useDiscoveryStatus';

interface DiscoveryStatusBarProps {
  onCycleComplete: () => void;
}

const DiscoveryStatusBar: React.FC<DiscoveryStatusBarProps> = ({ onCycleComplete }) => {
  const status = useDiscoveryStatus(onCycleComplete);

  // Both branches render the same live region node, so its first text is announced too.
  if (!status) {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{ minHeight: DISCOVERY_STATUS_BAR.MIN_HEIGHT_PX }}
      />
    );
  }

  const text = status.inProgress ? (
    APPLICATIONS_UI.DISCOVERY_IN_PROGRESS(status.remaining)
  ) : status.finishedAt ? (
    <>
      {APPLICATIONS_UI.DISCOVERY_IDLE}{' '}
      {/* The age ticks every minute: kept out of the announcements. */}
      <span aria-live="off">
        <TimeAgo date={status.finishedAt} short />
      </span>
    </>
  ) : (
    APPLICATIONS_UI.DISCOVERY_NEVER_FINISHED
  );

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="discovery-status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.SM,
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
            borderRadius: RADIUS.XS,
            display: 'inline-block',
            // Neutral: a finished scan says nothing about the apps' health.
            background: DEFAULT_COLORS.ICON_SECONDARY,
          }}
        />
      )}
      <Typography.Text style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>{text}</Typography.Text>
    </div>
  );
};

export default DiscoveryStatusBar;
