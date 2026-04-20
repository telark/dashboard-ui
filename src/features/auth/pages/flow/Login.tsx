import React, { useState } from 'react';
import { Form, App as AntdApp, Button, Divider } from 'antd';
import { LoginOutlined, GoogleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  performLogin,
  cleanupOrphanedPasskeys,
  type OrphanedPasskeysInfo,
} from '../../utils/flow/login';
import { redirectToGoogle } from '../../utils/flow/google';
import { APP_ROUTES } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import {
  LoginForm,
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthFooter,
  OrphanedPasskeysModal,
} from '../../components';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [orphanedInfo, setOrphanedInfo] = useState<OrphanedPasskeysInfo | null>(null);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleLogin = async (values: { username: string }) => {
    setLoading(true);
    try {
      await performLogin(
        values.username,
        message,
        () => navigate(APP_ROUTES.HOME),
        () => navigate(APP_ROUTES.REGISTER),
        undefined,
        (info) => {
          // Show modal when orphaned passkeys detected
          setOrphanedInfo(info);
          setModalOpen(true);
        },
      );
    } catch {
      // Error handling is done in performLogin
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setModalOpen(false);
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      await performLogin(
        values.username,
        message,
        () => navigate(APP_ROUTES.HOME),
        () => navigate(APP_ROUTES.REGISTER),
        undefined,
        (info) => {
          setOrphanedInfo(info);
          setModalOpen(true);
        },
      );
    } catch {
      // Error handling is done in performLogin
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!orphanedInfo) return;

    setRemoving(true);
    try {
      const requiresAuth = await cleanupOrphanedPasskeys(
        orphanedInfo.credentialIds,
        orphanedInfo.userId,
        message,
      );

      if (requiresAuth) {
        message.open({
          type: 'info',
          content: 'Unable to automatically cleanup orphaned passkeys. Please contact support.',
          duration: 8,
        });
      } else {
        // After cleanup, navigate to register
        setModalOpen(false);
        navigate(APP_ROUTES.REGISTER);
      }
    } catch {
      // Error is already handled in cleanupOrphanedPasskeys
    } finally {
      setRemoving(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setOrphanedInfo(null);
  };

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) return;
    setGoogleLoading(true);
    redirectToGoogle(GOOGLE_CLIENT_ID);
  };

  return (
    <>
      <AuthContainer>
        <AuthCard>
          <AuthHeader
            icon={<LoginOutlined style={{ fontSize: '32px', color: '#ffffff' }} />}
            title={LOGIN_CONSTANTS.UI.TITLE}
            subtitle={LOGIN_CONSTANTS.UI.SUBTITLE}
          />
          <LoginForm form={form} loading={loading} onFinish={handleLogin} />
          {GOOGLE_CLIENT_ID && (
            <>
              <Divider plain>{LOGIN_CONSTANTS.UI.GOOGLE_OR_SEPARATOR}</Divider>
              <Button
                icon={<GoogleOutlined />}
                onClick={handleGoogleLogin}
                loading={googleLoading}
                block
                size="large"
              >
                {googleLoading
                  ? LOGIN_CONSTANTS.UI.GOOGLE_BUTTON_LOADING
                  : LOGIN_CONSTANTS.UI.GOOGLE_BUTTON_TEXT}
              </Button>
            </>
          )}
          <AuthFooter
            text={LOGIN_CONSTANTS.UI.FOOTER_TEXT}
            linkText={LOGIN_CONSTANTS.UI.FOOTER_LINK}
            onLinkClick={() => navigate(APP_ROUTES.REGISTER)}
          />
        </AuthCard>
      </AuthContainer>
      <OrphanedPasskeysModal
        open={modalOpen}
        errorName={orphanedInfo?.errorName}
        onRetry={handleRetry}
        onRemove={handleRemove}
        onCancel={handleCancel}
        isRemoving={removing}
      />
    </>
  );
};

export default Login;
