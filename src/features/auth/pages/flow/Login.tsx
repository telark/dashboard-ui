import React, { useEffect, useState } from 'react';
import { Form, App as AntdApp, Button, Divider } from 'antd';
import { GoogleOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  performLogin,
  cleanupOrphanedPasskeys,
  type OrphanedPasskeysInfo,
} from '../../utils/flow/login';
import { redirectToGoogle } from '../../utils/flow/google';
import { APP_ROUTES } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { DEFAULT_COLORS } from '../../../../constants';
import {
  LoginForm,
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthFooter,
  OrphanedPasskeysModal,
} from '../../components';
import { fetchGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';

const BrandPanel: React.FC = () => (
  <div style={{ maxWidth: '340px', width: '100%', color: '#ffffff' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '56px' }}>
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: DEFAULT_COLORS.SUCCESS,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <LockOutlined style={{ fontSize: '18px', color: '#fff' }} />
      </div>
      <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px', color: '#f1f5f9' }}>
        {LOGIN_CONSTANTS.UI.BRAND_NAME}
      </span>
    </div>

    <h2
      style={{
        fontSize: '34px',
        fontWeight: 700,
        lineHeight: 1.2,
        margin: '0 0 20px',
        color: '#f1f5f9',
        letterSpacing: '-0.8px',
      }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_HEADLINE}
    </h2>

    <p
      style={{
        fontSize: '15px',
        color: '#94a3b8',
        margin: '0 0 48px',
        lineHeight: 1.65,
      }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_TAGLINE}
    </p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {[
        'Passkey & OIDC authentication',
        'Session management & audit logs',
        'Role-based access control',
      ].map((feature) => (
        <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: DEFAULT_COLORS.SUCCESS,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{feature}</span>
        </div>
      ))}
    </div>
  </div>
);

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [orphanedInfo, setOrphanedInfo] = useState<OrphanedPasskeysInfo | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const googleClientID = globalConfig.data?.oidc?.googleClientID;
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  useEffect(() => {
    if (!globalConfig.initialized && !globalConfig.loading) {
      dispatch(fetchGlobalConfigThunk());
    }
  }, [dispatch, globalConfig.initialized, globalConfig.loading]);

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
    if (!googleClientID) return;
    setGoogleLoading(true);
    redirectToGoogle(googleClientID);
  };

  return (
    <>
      <AuthContainer leftPanel={<BrandPanel />}>
        <AuthCard>
          <AuthHeader
            title={LOGIN_CONSTANTS.UI.TITLE}
            subtitle={LOGIN_CONSTANTS.UI.SUBTITLE}
          />

          {googleClientID && (
            <Button
              type="primary"
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              loading={googleLoading}
              disabled={loading}
              block
              size="large"
              style={{
                height: '44px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                background: DEFAULT_COLORS.SUCCESS,
                borderColor: DEFAULT_COLORS.SUCCESS,
                boxShadow: '0 2px 8px rgba(32, 201, 151, 0.25)',
                marginBottom: '4px',
              }}
            >
              {googleLoading
                ? LOGIN_CONSTANTS.UI.GOOGLE_BUTTON_LOADING
                : LOGIN_CONSTANTS.UI.GOOGLE_BUTTON_TEXT}
            </Button>
          )}

          {googleClientID && (
            <Divider
              plain
              style={{
                color: '#94a3b8',
                fontSize: '12px',
                margin: '20px 0',
                borderColor: '#e2e8f0',
              }}
            >
              {LOGIN_CONSTANTS.UI.GOOGLE_OR_SEPARATOR}
            </Divider>
          )}

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
