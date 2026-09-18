import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../constants';
import { AUTH_ERROR_MESSAGES } from '../../constants';

const MESSAGE = AUTH_ERROR_MESSAGES.PASSKEYS_INSECURE_CONTEXT;

export const InsecureContextAlert: React.FC = () => (
  <div
    role="alert"
    style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 14px 12px 16px',
      marginBottom: 16,
      borderRadius: 12,
      background: DEFAULT_COLORS.WARNING_TINT,
      border: `1px solid ${DEFAULT_COLORS.WARNING_TINT}`,
    }}
  >
    <span
      aria-hidden
      style={{
        position: 'absolute',
        left: 0,
        top: 12,
        bottom: 12,
        width: 3,
        borderRadius: 3,
        background: DEFAULT_COLORS.WARNING,
      }}
    />
    <span
      aria-hidden
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: DEFAULT_COLORS.SURFACE_WHITE,
        color: DEFAULT_COLORS.WARNING,
        fontSize: 15,
      }}
    >
      <LockOutlined />
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px' }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.35,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE,
          }}
        >
          {MESSAGE.TITLE}
        </span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 999,
            background: DEFAULT_COLORS.WARNING_TINT,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE,
            fontSize: 11,
            fontWeight: 600,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
          }}
        >
          {MESSAGE.TAG}
        </span>
      </div>
      <p
        style={{
          margin: '4px 0 0',
          fontSize: 13,
          lineHeight: 1.55,
          color: DEFAULT_COLORS.CHIP_ON_SURFACE_TEXT,
        }}
      >
        {MESSAGE.DESCRIPTION}
      </p>
    </div>
  </div>
);
