import React, { useCallback, memo } from 'react';
import { Tooltip, Popover, App as AntdApp } from 'antd';
import { KeyOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import RowTag from '../../../../../components/display/table/RowTag';
import { PASSKEYS_CONSTANTS as PPC } from '../../../constants/passkeys';
import { DEFAULT_COLORS } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type { Passkey } from '../../../models/passkeys';

const CARD_STYLE: React.CSSProperties = {
  background: DEFAULT_COLORS.SURFACE_WHITE,
  border: `1px solid ${DEFAULT_COLORS.BORDER_SUBTLE}`,
  borderRadius: 12,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minHeight: 120,
  transition: 'box-shadow 0.2s, border-color 0.2s',
};

const iconButtonStyle = (color: string): React.CSSProperties => ({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color,
  fontSize: 16,
});

interface PasskeyCardProps {
  passkey: Passkey;
  onEdit: (passkey: Passkey) => void;
  onDelete: (passkey: Passkey) => void;
}

const PasskeyCard: React.FC<PasskeyCardProps> = memo(({ passkey, onEdit, onDelete }) => {
  const { message } = AntdApp.useApp();
  const displayKey = passkey.publicKey ?? passkey.credentialId ?? null;
  const deviceTypeLabel =
    passkey.deviceType === PPC.VALUES.DEVICE_TYPE_PLATFORM
      ? PPC.LABELS.DEVICE_TYPE_PLATFORM
      : PPC.LABELS.DEVICE_TYPE_CROSS_PLATFORM;

  const handleCopy = useCallback(() => {
    if (!displayKey) return;
    navigator.clipboard.writeText(displayKey).then(
      () => message.success(PPC.LABELS.COPIED),
      () => message.error('Failed to copy'),
    );
  }, [displayKey, message]);

  const publicKeyPopoverContent = displayKey ? (
    <div style={{ position: 'relative', maxWidth: 320, paddingRight: 32 }}>
      <div
        style={{
          fontSize: 11,
          fontFamily: 'monospace',
          wordBreak: 'break-all',
          color: PPC.COLORS.TEXT_PRIMARY,
          maxHeight: 80,
          overflowY: 'auto',
          lineHeight: 1.4,
        }}
      >
        {displayKey}
      </div>
      <Tooltip title={PPC.LABELS.COPY_PUBLIC_KEY}>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            ...iconButtonStyle(DEFAULT_COLORS.TEXT_SECONDARY),
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        >
          <CopyOutlined />
        </button>
      </Tooltip>
    </div>
  ) : (
    <span style={{ fontSize: 12, color: PPC.COLORS.TEXT_MUTED }}>
      {PPC.LABELS.PUBLIC_KEY_UNAVAILABLE}
    </span>
  );

  return (
    <div
      style={CARD_STYLE}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px ${DEFAULT_COLORS.SHADOW}`;
        e.currentTarget.style.borderColor = DEFAULT_COLORS.BORDER_HOVER;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = DEFAULT_COLORS.BORDER_SUBTLE;
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: PPC.COLORS.TEXT_PRIMARY,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {passkey.deviceName}
          </h3>
          <RowTag text={deviceTypeLabel} fontSize={PPC.SIZES.CHIP_FONT} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {displayKey ? (
            <Popover
              content={publicKeyPopoverContent}
              title={PPC.LABELS.PUBLIC_KEY}
              trigger="click"
              placement="bottomRight"
            >
              <Tooltip title={PPC.LABELS.PUBLIC_KEY}>
                <button type="button" style={iconButtonStyle(PPC.COLORS.TEXT_MUTED)}>
                  <KeyOutlined />
                </button>
              </Tooltip>
            </Popover>
          ) : null}
          <Tooltip title={PPC.LABELS.ACTIONS.EDIT}>
            <button
              type="button"
              onClick={() => onEdit(passkey)}
              style={iconButtonStyle(PPC.COLORS.TEXT_PRIMARY)}
            >
              <EditOutlined />
            </button>
          </Tooltip>
          <Tooltip title={PPC.LABELS.ACTIONS.DELETE}>
            <button
              type="button"
              onClick={() => onDelete(passkey)}
              style={iconButtonStyle(DEFAULT_COLORS.DANGER)}
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontSize: 13,
          color: PPC.COLORS.TEXT_MUTED,
        }}
      >
        <div>
          <span style={{ fontWeight: 500, marginRight: 4 }}>{PPC.LABELS.COLUMNS.CREATED}:</span>
          {passkey.creationTimestamp ? (
            <TimeAgo date={passkey.creationTimestamp} />
          ) : (
            <span>{PPC.LABELS.NEVER_USED}</span>
          )}
        </div>
        <div>
          <span style={{ fontWeight: 500, marginRight: 4 }}>{PPC.LABELS.COLUMNS.LAST_USED}:</span>
          {passkey.lastUsedTimestamp ? (
            <TimeAgo date={passkey.lastUsedTimestamp} />
          ) : (
            <span>{PPC.LABELS.NEVER_USED}</span>
          )}
        </div>
      </div>
    </div>
  );
});

PasskeyCard.displayName = 'PasskeyCard';

export default PasskeyCard;
