import React, { useState } from 'react';
import { Modal } from 'antd';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { getSessionToken, removeSessionToken, removeCurrentUser } from '../../utils';
import { deleteCurrentSession } from '../../clients';
import { purgeLocalUserData } from '../../utils/session/cleanup';
import { AUTH_CONSTANTS } from '../../constants/messages';
import { ACTION_CONFIRM_MODAL, APP_ROUTES, DEFAULT_COLORS } from '../../../../constants';
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
          // Matches the confirm button in ActionConfirmModal (e.g. rollback).
          borderRadius: ACTION_CONFIRM_MODAL.BUTTONS.CONFIRM.BORDER_RADIUS,
          fontWeight: ACTION_CONFIRM_MODAL.BUTTONS.CONFIRM.FONT_WEIGHT,
          height: ACTION_CONFIRM_MODAL.BUTTONS.CONFIRM.HEIGHT,
          padding: ACTION_CONFIRM_MODAL.BUTTONS.CONFIRM.PADDING,
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
