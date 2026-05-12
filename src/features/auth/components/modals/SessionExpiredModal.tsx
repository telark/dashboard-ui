import React, { useState } from 'react';
import { Modal } from 'antd';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { getSessionToken, removeSessionToken, removeCurrentUser } from '../../utils';
import { deleteSession } from '../../clients';
import { AUTH_CONSTANTS } from '../../constants/messages';
import { APP_ROUTES, DEFAULT_COLORS } from '../../../../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';

interface SessionExpiredModalProps {
  open: boolean;
  onClose?: () => void;
}

const deleteServerSession = async (sessionToken: string): Promise<void> => {
  try {
    const deleteResponse = await deleteSession(sessionToken);
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
      const sessionToken = getSessionToken();
      if (sessionToken) {
        await deleteServerSession(sessionToken);
      }

      cleanupLocalStorage();
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
    <Modal
      open={open}
      title={AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.TITLE}
      onOk={handleGoToLogin}
      onCancel={handleGoToLogin}
      okText={AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.BUTTON_TEXT}
      cancelButtonProps={{ style: { display: 'none' } }}
      okButtonProps={{
        loading: loading,
        style: {
          backgroundColor: DEFAULT_COLORS.SUCCESS,
          borderColor: DEFAULT_COLORS.SUCCESS,
        },
      }}
      closable={false}
      mask={{ closable: false }}
      centered
      destroyOnHidden
    >
      <p>{AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.MESSAGE}</p>
    </Modal>
  );
};

export default SessionExpiredModal;
