import React, { useCallback, memo } from 'react';
import { Tooltip, Popover, Tag, App as AntdApp } from 'antd';
import { KeyOutlined, EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import { PASSKEYS_CONSTANTS as PPC } from '../../../constants/passkeys';
import {
  DEFAULT_COLORS,
  MONOSPACE_CLASS,
  SECTION_LAYOUT,
  TAG_CLASS,
  UNSTYLED_BUTTON,
  RADIUS,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  MOTION,
} from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import type { Passkey } from '../../../models/passkeys';

const CARD_STYLE: React.CSSProperties = {
  background: DEFAULT_COLORS.SURFACE_ELEVATED,
  border: SECTION_LAYOUT.SUBTLE_DIVIDER,
  borderRadius: RADIUS.LG,
  padding: SPACING.XL,
  display: 'flex',
  flexDirection: 'column',
  gap: SPACING.MD,
  minHeight: 120,
  transition: `box-shadow ${MOTION.BASE_MS}ms, border-color ${MOTION.BASE_MS}ms`,
};

const iconButtonStyle = (color: string): React.CSSProperties => ({
  ...UNSTYLED_BUTTON,
  padding: SPACING.XS,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color,
  fontSize: FONT_SIZE.LG,
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
      () => message.error(PPC.LABELS.COPY_PUBLIC_KEY_FAILED),
    );
  }, [displayKey, message]);

  const publicKeyPopoverContent = displayKey ? (
    <div style={{ position: 'relative', maxWidth: 320, paddingRight: SPACING.XXXL }}>
      <div
        className={MONOSPACE_CLASS}
        // 1.4: the key's leading sits between SNUG and BASE.
        style={{
          fontSize: FONT_SIZE.XS,
          wordBreak: 'break-all',
          color: DEFAULT_COLORS.TEXT_ON_SURFACE,
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
            ...iconButtonStyle(DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED),
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
    <span style={{ fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}>
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
        e.currentTarget.style.borderColor = DEFAULT_COLORS.BORDER_ELEVATED;
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: SPACING.SM,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.SM,
            flex: 1,
            minWidth: 0,
          }}
        >
          <h2
            // 1.3: the card title's leading sits between TIGHT and SNUG.
            style={{
              margin: SPACING.NONE,
              fontSize: FONT_SIZE.LG,
              fontWeight: FONT_WEIGHT.BOLD,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {passkey.deviceName}
          </h2>
          <Tag className={TAG_CLASS.MEDIUM}>{deviceTypeLabel}</Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.XS, flexShrink: 0 }}>
          {displayKey ? (
            <Popover
              content={publicKeyPopoverContent}
              title={PPC.LABELS.PUBLIC_KEY}
              trigger="click"
              placement="bottomRight"
            >
              <Tooltip title={PPC.LABELS.PUBLIC_KEY}>
                <button type="button" style={iconButtonStyle(DEFAULT_COLORS.TEXT_MUTED)}>
                  <KeyOutlined />
                </button>
              </Tooltip>
            </Popover>
          ) : null}
          <Tooltip title={PPC.LABELS.ACTIONS.EDIT}>
            <button
              type="button"
              onClick={() => onEdit(passkey)}
              style={iconButtonStyle(DEFAULT_COLORS.TEXT_PRIMARY)}
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
          gap: SPACING.XS,
          fontSize: FONT_SIZE.MD,
          color: DEFAULT_COLORS.TEXT_MUTED,
        }}
      >
        <div>
          <span style={{ fontWeight: FONT_WEIGHT.MEDIUM, marginRight: SPACING.XS }}>
            {PPC.LABELS.COLUMNS.CREATED}:
          </span>
          {passkey.creationTimestamp ? (
            <TimeAgo date={passkey.creationTimestamp} />
          ) : (
            <span>{PPC.LABELS.NEVER_USED}</span>
          )}
        </div>
        <div>
          <span style={{ fontWeight: FONT_WEIGHT.MEDIUM, marginRight: SPACING.XS }}>
            {PPC.LABELS.COLUMNS.LAST_USED}:
          </span>
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
