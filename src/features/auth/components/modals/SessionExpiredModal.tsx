import React, { useState } from 'react';
import { App as AntdApp } from 'antd';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { isSignedIn, removeCurrentUser } from '../../utils';
import { logout } from '../../clients/logout';
import { purgeLocalUserData } from '../../utils/session/cleanup';
import { AUTH_CONSTANTS, AUTH_ERROR_MESSAGES } from '../../constants/messages';
import { APP_ROUTES } from '../../../../constants';
import { BaseModal } from '../../../../components/display/modal';
import { ActionButtons } from '../../../../components/display/buttons';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';

interface SessionExpiredModalProps {
  open: boolean;
  /** The session routes refused two session cookies: the text says how to clear them. */
  duplicateCookie: boolean;
  onClose?: () => void;
}

// Auth logout, not the exporter's session delete: only auth can clear the cookie. False when it failed.
const endServerSession = async (): Promise<boolean> => {
  try {
    await logout();
    return true;
  } catch (error) {
    if (isDevelopment()) {
      logger.error(AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.DELETE_FAILED, error);
    }
    return false;
  }
};

const navigateToLogin = (navigate: NavigateFunction, onClose?: () => void): void => {
  if (onClose) {
    onClose();
  }
  navigate(APP_ROUTES.LOGIN);
};

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  open,
  duplicateCookie,
  onClose,
}) => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(false);

  const handleGoToLogin = async () => {
    setLoading(true);
    try {
      // The session stays until auth answers, so the modal stays too, for another try.
      if (isSignedIn() && !(await endServerSession())) {
        message.error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED);
        return;
      }

      removeCurrentUser();
      await purgeLocalUserData();
      navigateToLogin(navigate, onClose);
    } catch (error) {
      if (isDevelopment()) {
        logger.error(AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.HANDLE_LOGIN_ERROR, error);
      }
      navigateToLogin(navigate, onClose);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={open}
      onCancel={handleGoToLogin}
      closable={false}
      title={AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.TITLE}
      description={
        duplicateCookie
          ? AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.DUPLICATE_COOKIE_MESSAGE
          : AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.MESSAGE
      }
      footer={
        <ActionButtons
          confirmText={AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.BUTTON_TEXT}
          onConfirm={handleGoToLogin}
          loading={loading}
        />
      }
    />
  );
};

export default SessionExpiredModal;
