import React from 'react';
import { LockOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  getPillSurface,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  withAlpha,
} from '../../../../constants';
import { AUTH_ERROR_MESSAGES } from '../../constants';

const MESSAGE = AUTH_ERROR_MESSAGES.PASSKEYS_INSECURE_CONTEXT;

// Shown on the auth card (its --auth-* colors) and on the dark passkeys page (the fallbacks).
export const InsecureContextAlert: React.FC = () => (
  <div
    role="alert"
    // 14: the right padding sits between MD and LG.
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: SPACING.MD,
      padding: `${SPACING.MD}px 14px ${SPACING.MD}px ${SPACING.LG}px`,
      marginBottom: SPACING.LG,
      borderRadius: RADIUS.LG,
      background: DEFAULT_COLORS.WARNING_TINT,
      // An antd warning Alert's hairline: the accent, stronger than the fill, on either surface.
      border: `1px solid ${withAlpha(DEFAULT_COLORS.WARNING, 0.35)}`,
    }}
  >
    <span
      aria-hidden
      // 15: the lock icon's size sits between BASE and LG.
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: `var(--auth-card-bg, ${DEFAULT_COLORS.SURFACE_ELEVATED})`,
        color: DEFAULT_COLORS.WARNING,
        fontSize: 15,
      }}
    >
      <LockOutlined />
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: `${SPACING.XS}px ${SPACING.SM}px`,
        }}
      >
        <span
          style={{
            fontSize: FONT_SIZE.BASE,
            fontWeight: FONT_WEIGHT.SEMIBOLD,
            lineHeight: LINE_HEIGHT.SNUG,
            color: `var(--auth-text-primary, ${DEFAULT_COLORS.TEXT_PRIMARY})`,
          }}
        >
          {MESSAGE.TITLE}
        </span>
        <span
          // 1.4: the tag's leading sits between SNUG and BASE.
          style={{
            padding: `${SPACING.XXS}px ${SPACING.SM}px`,
            borderRadius: RADIUS.PILL,
            ...getPillSurface(DEFAULT_COLORS.WARNING),
            fontSize: FONT_SIZE.XS,
            fontWeight: FONT_WEIGHT.SEMIBOLD,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
          }}
        >
          {MESSAGE.TAG}
        </span>
      </div>
      <p
        // 1.55: the description's leading sits between BASE and LOOSE.
        style={{
          margin: `${SPACING.XS}px 0 0`,
          fontSize: FONT_SIZE.MD,
          lineHeight: 1.55,
          color: `var(--auth-text-muted, ${DEFAULT_COLORS.TEXT_MUTED})`,
        }}
      >
        {MESSAGE.DESCRIPTION}
      </p>
    </div>
  </div>
);
