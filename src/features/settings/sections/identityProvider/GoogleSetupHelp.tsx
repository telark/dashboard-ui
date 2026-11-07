import React, { useCallback } from 'react';
import { App as AntdApp, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  FONT_SIZE,
  FONT_WEIGHT,
  MONOSPACE_CLASS,
  RADIUS,
  SECTION_LAYOUT,
  SPACING,
} from '../../../../constants';
import { googleRedirectUri } from '../../../shared/utils/googleRedirect';
import { SettingsSubsectionHeader } from '../../components/SettingsFields';
import { SETTINGS_CONSTANTS } from '../../constants';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';

const { SETUP, LINKS } = C;

// The same bare copy icon as the Insights details panel.
const COPY_ICON_STYLE: React.CSSProperties = {
  all: 'unset',
  cursor: 'pointer',
  color: DEFAULT_COLORS.TEXT_MUTED,
};

// One inset box holds the whole setup, so it reads as a checklist rather than a form field.
const BOX: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: SPACING.SM,
  padding: `${SPACING.MD}px ${SPACING.LG}px`,
  background: DEFAULT_COLORS.PAGE_BG,
  border: SECTION_LAYOUT.SUBTLE_DIVIDER,
  borderRadius: RADIUS.MD,
};

const HEAD: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: SPACING.MD,
};

const STEPS: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: SPACING.S6,
  margin: SPACING.NONE,
  padding: SPACING.NONE,
  listStyle: 'none',
  fontSize: SETTINGS_CONSTANTS.CONTENT.CARD_DESCRIPTION_FONT_SIZE,
  color: DEFAULT_COLORS.TEXT_SECONDARY,
};

const STEP: React.CSSProperties = { display: 'flex', alignItems: 'baseline', gap: SPACING.SM };

// Off scale, kept exact: an 18px numeral disc, centered on the step's first line.
const STEP_NUMBER: React.CSSProperties = {
  flex: '0 0 auto',
  width: 18,
  height: 18,
  lineHeight: '18px',
  textAlign: 'center',
  borderRadius: RADIUS.PILL,
  background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
  color: DEFAULT_COLORS.TEXT_SECONDARY,
  fontSize: FONT_SIZE.XS,
  fontWeight: FONT_WEIGHT.SEMIBOLD,
};

const URI: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: SPACING.S6,
  padding: `0 ${SPACING.S6}px`,
  borderRadius: RADIUS.XS,
  background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  wordBreak: 'break-all',
};

const GoogleSetupHelp: React.FC = () => {
  const { message } = AntdApp.useApp();
  const redirectUri = googleRedirectUri();

  const copyRedirectUri = useCallback(() => {
    globalThis.navigator.clipboard.writeText(redirectUri).then(
      () => message.success(C.MESSAGES.REDIRECT_URI_COPIED),
      () => message.error(C.MESSAGES.REDIRECT_URI_COPY_FAILED),
    );
  }, [message, redirectUri]);

  return (
    <div style={BOX}>
      <div style={HEAD}>
        <SettingsSubsectionHeader title={SETUP.CLIENT_TITLE} />
        <a href={LINKS.GUIDE_URL} target="_blank" rel="noreferrer">
          {SETUP.GUIDE_LINK}
        </a>
      </div>
      <ol style={STEPS}>
        <li style={STEP}>
          <span style={STEP_NUMBER}>1</span>
          <span>
            {SETUP.STEP_CREATE_START}{' '}
            <a href={LINKS.CONSOLE_URL} target="_blank" rel="noreferrer">
              {SETUP.CONSOLE_LINK}
            </a>
            {SETUP.STEP_CREATE_END}
          </span>
        </li>
        <li style={STEP}>
          <span style={STEP_NUMBER}>2</span>
          <span>
            {SETUP.STEP_REDIRECT}{' '}
            <span style={URI}>
              <code className={MONOSPACE_CLASS}>{redirectUri}</code>
              <Tooltip title={SETUP.COPY_LABEL}>
                <button
                  type="button"
                  aria-label={SETUP.COPY_LABEL}
                  onClick={copyRedirectUri}
                  style={COPY_ICON_STYLE}
                >
                  <CopyOutlined />
                </button>
              </Tooltip>
            </span>
          </span>
        </li>
        <li style={STEP}>
          <span style={STEP_NUMBER}>3</span>
          <span>{SETUP.STEP_CLIENT_ID}</span>
        </li>
      </ol>
    </div>
  );
};

export default GoogleSetupHelp;
