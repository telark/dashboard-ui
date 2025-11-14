import React, { useState } from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getSessionToken, removeSessionToken } from '../../utils/auth/session';
import { removeCurrentUser } from '../../utils/user/session';
import { deleteSession } from '../../clients/exporter';
import { AUTH_CONSTANTS } from '../../constants/auth/messages';
import { APP_ROUTES } from '../../constants';
import { DEFAULT_COLORS } from '../../constants';
import { isDevelopment } from '../../utils/helpers/env';

interface SessionExpiredModalProps {
  open: boolean;
  onClose?: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoToLogin = async () => {
    setLoading(true);
    try {
      const sessionToken = getSessionToken();

      // Delete session from server
      if (sessionToken) {
        try {
          const deleteResponse = await deleteSession(sessionToken);
          if (deleteResponse.status !== 200) {
            if (isDevelopment()) {
              console.warn(
                AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.DELETE_NON_200_STATUS,
                deleteResponse.status,
              );
            }
          }
        } catch (error) {
          if (isDevelopment()) {
            console.error(AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.DELETE_FAILED, error);
          }
          // Continue with cleanup even if delete fails
        }
      }

      // Clean up local storage
      try {
        removeSessionToken();
        removeCurrentUser();
      } catch (error) {
        if (isDevelopment()) {
          console.error(AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.LOCAL_CLEANUP_ERROR, error);
        }
      }

      // Close modal
      if (onClose) {
        onClose();
      }

      // Navigate to login
      navigate(APP_ROUTES.LOGIN);
    } catch (error) {
      if (isDevelopment()) {
        console.error(AUTH_CONSTANTS.SESSION.EXPIRATION.LOGS.HANDLE_LOGIN_ERROR, error);
      }
      // Still navigate to login even if there's an error
      if (onClose) {
        onClose();
      }
      navigate(APP_ROUTES.LOGIN);
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
      maskClosable={false}
      centered
      destroyOnHidden
    >
      <p>{AUTH_CONSTANTS.SESSION.EXPIRATION.MODAL.MESSAGE}</p>
    </Modal>
  );
};

export default SessionExpiredModal;
