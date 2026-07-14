import React, { useEffect, useRef, useState } from 'react';
import { Form, App as AntdApp, Button, Divider, ConfigProvider, theme as antdTheme } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
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
import { LIGHT_TOKENS, DARK_TOKENS } from '../../constants/theme';
import { GoogleIcon } from '../../../../components/display/icons/GoogleIcon';
import {
  LoginForm,
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthFooter,
  OrphanedPasskeysModal,
  BrandPanel,
  CompactBanner,
  ThemeToggle,
} from '../../components';
import { ensureGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import { ensureAuthConfigThunk, selectSelfRegistrationEnabled } from '../../store';
import type { AppDispatch } from '../../../../store';
import '../../components/login/login.css';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [orphanedInfo, setOrphanedInfo] = useState<OrphanedPasskeysInfo | null>(null);
  const [showPasskeyForm, setShowPasskeyForm] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('auth-theme') === 'dark');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const globalConfig = useSelector(selectGlobalConfigState);
  const googleClientID = globalConfig.data?.oidc?.googleClientID;
  const selfRegEnabled = useSelector(selectSelfRegistrationEnabled);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    dispatch(ensureGlobalConfigThunk());
    dispatch(ensureAuthConfigThunk());
  }, [dispatch]);

  const handleLogin = async (values: { email: string }) => {
    setPasskeyError(null);
    setLoading(true);
    try {
      await performLogin(
        values.email,
        message,
        () => navigate(APP_ROUTES.HOME),
        () => navigate(APP_ROUTES.REGISTER),
        undefined,
        (info) => {
          if (!isMountedRef.current) return;
          setOrphanedInfo(info);
          setModalOpen(true);
        },
      );
    } catch {
      if (isMountedRef.current) setPasskeyError('Authentication failed. Please try again.');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleRetry = async () => {
    setModalOpen(false);
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      await performLogin(
        values.email,
        message,
        () => navigate(APP_ROUTES.HOME),
        () => navigate(APP_ROUTES.REGISTER),
        undefined,
        (info) => {
          if (!isMountedRef.current) return;
          setOrphanedInfo(info);
          setModalOpen(true);
        },
      );
    } catch {
      // Error handling is done in performLogin
    } finally {
      if (isMountedRef.current) setLoading(false);
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
      if (!isMountedRef.current) return;
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
      if (isMountedRef.current) setRemoving(false);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setOrphanedInfo(null);
  };

  const handleGoogleLogin = () => {
    if (!googleClientID) return;
    setGoogleLoading(true);
    redirectToGoogle(googleClientID).catch(() => {
      if (isMountedRef.current) setGoogleLoading(false);
    });
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('auth-theme', next ? 'dark' : 'light');
  };

  const isAnyLoading = loading || googleLoading;

  return (
    <>
      <ConfigProvider
        wave={{ disabled: true }}
        theme={{
          cssVar: { key: 'telark-auth' },
          hashed: false,
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: isDark ? DARK_TOKENS : LIGHT_TOKENS,
        }}
      >
        <div className="auth-root" data-theme={isDark ? 'dark' : 'light'}>
          <AuthContainer leftPanel={<BrandPanel />} compactBanner={<CompactBanner />}>
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            </div>

            <AuthCard>
              <AuthHeader title={LOGIN_CONSTANTS.UI.TITLE} subtitle={LOGIN_CONSTANTS.UI.SUBTITLE} />

              {!showPasskeyForm ? (
                <Button
                  block
                  size="large"
                  onClick={() => setShowPasskeyForm(true)}
                  disabled={isAnyLoading}
                  style={{
                    height: '44px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    background: 'var(--color-primary, #20C997)',
                    borderColor: 'var(--color-primary, #20C997)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <KeyOutlined />
                  {LOGIN_CONSTANTS.UI.BUTTON_TEXT}
                </Button>
              ) : (
                <LoginForm
                  form={form}
                  loading={loading}
                  onFinish={handleLogin}
                  error={passkeyError}
                  onClearError={() => setPasskeyError(null)}
                />
              )}

              {googleClientID && (
                <Divider
                  plain
                  style={{
                    color: 'var(--auth-text-muted, #94a3b8)',
                    fontSize: '11px',
                    margin: '14px 0',
                    borderColor: 'var(--auth-divider, #f1f5f9)',
                  }}
                >
                  {LOGIN_CONSTANTS.UI.GOOGLE_OR_SEPARATOR}
                </Divider>
              )}

              {googleClientID && (
                <Button
                  block
                  size="large"
                  onClick={handleGoogleLogin}
                  loading={googleLoading}
                  disabled={loading}
                  style={{
                    height: '44px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 500,
                    background: '#ffffff',
                    borderColor: '#dadce0',
                    color: '#3c4043',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  icon={!googleLoading ? <GoogleIcon /> : undefined}
                >
                  {googleLoading
                    ? LOGIN_CONSTANTS.UI.GOOGLE_BUTTON_LOADING
                    : LOGIN_CONSTANTS.UI.GOOGLE_BUTTON_TEXT}
                </Button>
              )}

              {selfRegEnabled && (
                <AuthFooter
                  text={LOGIN_CONSTANTS.UI.FOOTER_TEXT}
                  linkText={LOGIN_CONSTANTS.UI.FOOTER_LINK}
                  onLinkClick={() => navigate(APP_ROUTES.REGISTER)}
                />
              )}
            </AuthCard>
          </AuthContainer>
        </div>
      </ConfigProvider>

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
