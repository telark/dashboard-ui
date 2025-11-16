import React, { useState } from 'react';
import { Form, App as AntdApp } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { performLogin, cleanupOrphanedPasskeys, type OrphanedPasskeysInfo } from '../../utils/auth/flows/login';
import { APP_ROUTES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/pages/login';
import { LoginForm } from '../../components/auth/login';
import { AuthContainer, AuthCard, AuthHeader, AuthFooter } from '../../components/auth/shared';
import OrphanedPasskeysModal from '../../components/auth/OrphanedPasskeysModal';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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
    } catch (error) {
      // Error is already handled in cleanupOrphanedPasskeys
    } finally {
      setRemoving(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setOrphanedInfo(null);
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
