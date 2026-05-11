import React from 'react';
import { Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants';
import { DATA_VIEW_ERROR_CONSTANTS as DVE } from './dataViewError.constants';

export type DataViewErrorVariant = 'card' | 'table';

export interface DataViewErrorProps {
  variant: DataViewErrorVariant;
  message: string;
  title?: string;
  onRetry: () => void;
}

const layoutFor = (variant: DataViewErrorVariant): React.CSSProperties => {
  const config = variant === 'card' ? DVE.LAYOUT.CARD : DVE.LAYOUT.TABLE;
  return {
    minHeight: config.MIN_HEIGHT,
    padding: config.PADDING,
  };
};

const DataViewError: React.FC<DataViewErrorProps> = ({
  variant,
  message,
  title = DVE.LABELS.DEFAULT_TITLE,
  onRetry,
}) => {
  return (
    <div
      role="alert"
      style={{
        ...layoutFor(variant),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: DVE.LAYOUT.GAP,
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: 12,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
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
      <Button type="primary" onClick={onRetry}>
        {DVE.LABELS.RETRY_BUTTON}
      </Button>
    </div>
  );
};

export default DataViewError;
