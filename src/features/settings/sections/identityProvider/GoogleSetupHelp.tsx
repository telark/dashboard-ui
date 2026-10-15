import React, { useCallback } from 'react';
import { App as AntdApp, Input, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, MONOSPACE_CLASS } from '../../../../constants';
import { googleRedirectUri } from '../../../shared/utils/googleRedirect';
import { SettingsField, SettingsSubsectionHeader } from '../../components/SettingsFields';
import { IDENTITY_PROVIDER_CONSTANTS as C } from './constants';

const { SETUP, LINKS } = C;

// The same bare copy icon as the Insights details panel.
const COPY_ICON_STYLE: React.CSSProperties = {
  all: 'unset',
  cursor: 'pointer',
  color: DEFAULT_COLORS.TEXT_MUTED,
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
    <>
      <SettingsSubsectionHeader
        title={SETUP.CLIENT_TITLE}
        description={
          <>
            {SETUP.CLIENT_HINT_START}{' '}
            <a href={LINKS.CONSOLE_URL} target="_blank" rel="noreferrer">
              {SETUP.CONSOLE_LINK}
            </a>
            {SETUP.CLIENT_HINT_END}{' '}
            <a href={LINKS.GUIDE_URL} target="_blank" rel="noreferrer">
              {SETUP.GUIDE_LINK}
            </a>
          </>
        }
      />
      <SettingsField label={SETUP.REDIRECT_URI_LABEL} info={SETUP.REDIRECT_URI_INFO}>
        <Input
          readOnly
          value={redirectUri}
          className={MONOSPACE_CLASS}
          suffix={
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
          }
        />
      </SettingsField>
    </>
  );
};

export default GoogleSetupHelp;
