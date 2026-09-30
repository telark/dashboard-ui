import React, { useState } from 'react';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { getSessionToken, removeSessionToken, removeCurrentUser } from '../../utils';
import { deleteCurrentSession } from '../../clients';
import { purgeLocalUserData } from '../../utils/session/cleanup';
import { AUTH_CONSTANTS } from '../../constants/messages';
import { APP_ROUTES } from '../../../../constants';
import { BaseModal } from '../../../../components/display/modal';
import { ActionButtons } from '../../../../components/display/buttons';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';

interface SessionExpiredModalProps {
  open: boolean;
  onClose?: () => void;
}

const deleteServerSession = async (): Promise<void> => {
  try {
    const deleteResponse = await deleteCurrentSession();
    if (deleteResponse.status !== 200 && isDevelopment()) {
      logger.warn(
        AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.DELETE_NON_200_STATUS,
        deleteResponse.status,
      );
    }
  } catch (error) {
    if (isDevelopment()) {
      logger.error(AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.DELETE_FAILED, error);
    }
  }
};

const cleanupLocalStorage = (): void => {
  try {
    removeSessionToken();
    removeCurrentUser();
  } catch (error) {
    if (isDevelopment()) {
      logger.error(AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.LOCAL_CLEANUP_ERROR, error);
    }
  }
};

const navigateToLogin = (navigate: NavigateFunction, onClose?: () => void): void => {
  if (onClose) {
    onClose();
  }
  navigate(APP_ROUTES.LOGIN);
};

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoToLogin = async () => {
    setLoading(true);
    try {
      if (getSessionToken()) {
        await deleteServerSession();
      }

      cleanupLocalStorage();
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
      description={AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.MESSAGE}
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
