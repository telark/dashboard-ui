import React, { useEffect, useState } from 'react';
import { Form, App as AntdApp, Button, Divider } from 'antd';
import { GoogleOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons';
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
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <LockOutlined style={{ fontSize: '16px', color: '#e2e8f0' }} />
      </div>
      <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.2px', color: '#f1f5f9' }}>
        {LOGIN_CONSTANTS.UI.BRAND_NAME}
      </span>
    </div>

    <h2
      style={{
        fontSize: '32px',
        fontWeight: 700,
        lineHeight: 1.25,
        margin: '0 0 16px',
        color: '#f8fafc',
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
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.35)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '13px', color: '#94a3b8', letterSpacing: '0.1px' }}>
            {feature}
          </span>
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
  const [showPasskeyForm, setShowPasskeyForm] = useState(false);
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

  const isAnyLoading = loading || googleLoading;

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
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              loading={googleLoading}
              disabled={loading}
              block
              size="large"
              style={{
                height: '44px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                background: '#ffffff',
                borderColor: '#d1d5db',
                color: '#374151',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
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
                color: '#cbd5e1',
                fontSize: '11px',
                margin: '20px 0',
                borderColor: '#f1f5f9',
              }}
            >
              {LOGIN_CONSTANTS.UI.GOOGLE_OR_SEPARATOR}
            </Divider>
          )}

          {!showPasskeyForm ? (
            <Button
              icon={<KeyOutlined />}
              onClick={() => setShowPasskeyForm(true)}
              disabled={isAnyLoading}
              block
              size="large"
              style={{
                height: '44px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 500,
                background: '#f8fafc',
                borderColor: '#e2e8f0',
                color: '#475569',
              }}
            >
              {LOGIN_CONSTANTS.UI.BUTTON_TEXT}
            </Button>
          ) : (
            <LoginForm form={form} loading={loading} onFinish={handleLogin} />
          )}

          <p
            style={{
              textAlign: 'center',
              fontSize: '11px',
              color: '#94a3b8',
              margin: '20px 0 0',
              lineHeight: 1.5,
            }}
          >
            Secure authentication via passkeys and OIDC · No passwords stored
          </p>

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
