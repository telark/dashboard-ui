import React from 'react';
import { Button } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants';
import { ConnectivityBanner } from '../display/banners';
import { connectivityIssueFrom } from '../../api/client/health-interceptor';
import type { ConnectivityIssue } from '../../api/client/health-interceptor';
import { DATA_VIEW_ERROR_CONSTANTS as DVE } from './dataViewError.constants';

export type DataViewErrorVariant = 'card' | 'table' | 'fullPage';

export interface DataViewErrorProps {
  variant: DataViewErrorVariant;
  message: string;
  title?: string;
  onRetry: () => void;
  /** Optional override; when omitted the message itself is classified. */
  connectivity?: ConnectivityIssue;
}

const layoutFor = (variant: DataViewErrorVariant): React.CSSProperties => {
  if (variant === 'fullPage') {
    return { flex: 1, minHeight: '100%', padding: DVE.LAYOUT.CARD.PADDING };
  }
  const config = variant === 'card' ? DVE.LAYOUT.CARD : DVE.LAYOUT.TABLE;
  return {
    minHeight: config.MIN_HEIGHT,
    padding: config.PADDING,
  };
};

const containerStyle = (variant: DataViewErrorVariant): React.CSSProperties => {
  if (variant === 'fullPage') {
    return {
      background: DEFAULT_COLORS.PAGE_BG,
      borderRadius: 0,
      border: 'none',
      width: '100%',
      height: '100%',
    };
  }
  return {
    background: DEFAULT_COLORS.PAGE_BG,
    borderRadius: 12,
    border: `1px solid ${DEFAULT_COLORS.BORDER_SUBTLE}`,
  };
};

const DataViewError: React.FC<DataViewErrorProps> = ({
  variant,
  message,
  title = DVE.LABELS.DEFAULT_TITLE,
  onRetry,
  connectivity,
}) => {
  // Classified here rather than at each call site, so every feature that renders
  // an error state gets the status treatment for transient connectivity issues.
  const issue = connectivity ?? connectivityIssueFrom(message);
  if (issue) {
    const banner = (
      <ConnectivityBanner kind={issue.kind} serviceName={issue.serviceName} onRetry={onRetry} />
    );
    // fullPage owns the viewport, so the banner is centred in it instead of
    // sitting flush under the sticky header; inline variants stay in place.
    return variant === 'fullPage' ? (
      <div
        style={{
          ...layoutFor(variant),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <div style={{ width: '100%', maxWidth: DVE.LAYOUT.BANNER_MAX_WIDTH }}>{banner}</div>
      </div>
    ) : (
      banner
    );
  }

  return (
    <div
      role="alert"
      style={{
        ...layoutFor(variant),
        ...containerStyle(variant),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: DVE.LAYOUT.GAP,
        textAlign: 'center',
      }}
    >
      <ExclamationCircleOutlined
        style={{ fontSize: DVE.LAYOUT.ICON_SIZE, color: DEFAULT_COLORS.DANGER }}
      />
      <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontSize: 16, fontWeight: 600 }}>
        {title}
      </div>
      <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14, maxWidth: 480 }}>{message}</div>
      <Button type="primary" icon={<ReloadOutlined />} onClick={onRetry}>
        {DVE.LABELS.RETRY_BUTTON}
      </Button>
    </div>
  );
};

export default DataViewError;
