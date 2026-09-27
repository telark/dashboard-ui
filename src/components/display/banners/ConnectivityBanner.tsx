import React from 'react';
import { Button, Tooltip } from 'antd';
import { ApiOutlined, CloudServerOutlined, ReloadOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';
import { CONNECTIVITY_BANNER as CB } from './connectivityBanner.constants';

export type ConnectivityKind = 'service' | 'network';

export interface ConnectivityBannerProps {
  kind: ConnectivityKind;
  /** Only meaningful for `service`; omitted when the name is unknown. */
  serviceName?: string;
  onRetry?: () => void;
}

const copyFor = (kind: ConnectivityKind, serviceName?: string) => {
  if (kind === 'network') {
    return { title: CB.LABELS.NETWORK.TITLE, message: CB.LABELS.NETWORK.MESSAGE };
  }
  return {
    title: serviceName ? CB.LABELS.SERVICE.TITLE_NAMED(serviceName) : CB.LABELS.SERVICE.TITLE,
    message: CB.LABELS.SERVICE.MESSAGE,
  };
};

// Both cases are transient and recover on their own, so this reads as a status
// notice rather than the danger treatment reserved for genuine failures.
const ConnectivityBanner: React.FC<ConnectivityBannerProps> = ({ kind, serviceName, onRetry }) => {
  const { title, message } = copyFor(kind, serviceName);
  const accent = kind === 'network' ? DEFAULT_COLORS.DANGER : DEFAULT_COLORS.WARNING;
  const accentTint = kind === 'network' ? DEFAULT_COLORS.DANGER_TINT : DEFAULT_COLORS.WARNING_TINT;

  return (
    <div
      role="status"
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        gap: CB.LAYOUT.GAP,
        background: DEFAULT_COLORS.SURFACE_ELEVATED,
        border: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
        borderRadius: CB.LAYOUT.RADIUS,
        padding: CB.LAYOUT.PADDING,
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'relative',
          width: CB.LAYOUT.ICON_BOX,
          height: CB.LAYOUT.ICON_BOX,
          borderRadius: CB.LAYOUT.ICON_RADIUS,
          background: accentTint,
          color: accent,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: CB.LAYOUT.ICON_SIZE,
          flexShrink: 0,
        }}
      >
        {kind === 'network' ? <ApiOutlined /> : <CloudServerOutlined />}
      </span>

      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
            fontSize: CB.LAYOUT.TITLE_FONT_SIZE,
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          {title}
          <span
            aria-hidden
            style={{
              width: CB.LAYOUT.PULSE_SIZE,
              height: CB.LAYOUT.PULSE_SIZE,
              borderRadius: '50%',
              background: accent,
              animation: CB.LAYOUT.PULSE_ANIMATION,
              flexShrink: 0,
            }}
          />
        </div>
        <div
          style={{
            color: DEFAULT_COLORS.TEXT_MUTED,
            fontSize: CB.LAYOUT.MESSAGE_FONT_SIZE,
            lineHeight: 1.5,
            maxWidth: CB.LAYOUT.MAX_MESSAGE_WIDTH,
          }}
        >
          {message}
        </div>
      </div>

      {onRetry && (
        <Tooltip title={CB.LABELS.RETRY_BUTTON}>
          <Button
            type="text"
            size="small"
            aria-label={CB.LABELS.RETRY_BUTTON}
            icon={<ReloadOutlined />}
            onClick={onRetry}
            style={{
              position: 'relative',
              flexShrink: 0,
              color: DEFAULT_COLORS.ICON_SECONDARY,
            }}
          />
        </Tooltip>
      )}

      <style>{`
        @keyframes connectivityBannerPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(0.82); }
        }
      `}</style>
    </div>
  );
};

export default ConnectivityBanner;
