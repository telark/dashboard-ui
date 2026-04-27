/*
 * Login page layout breakpoints:
 *   1440px — 2-col split, left panel shows terminal demo
 *   1024px — 2-col split, left panel visible (lg threshold ≥992px)
 *   768px  — compact top banner; auth card full width
 *   375px  — banner hidden; auth card centered, full-screen padding
 *
 * Preserved state/handlers (auth logic untouched):
 *   form, loading, googleLoading, modalOpen, removing, orphanedInfo,
 *   showPasskeyForm, handleLogin, handleRetry, handleRemove,
 *   handleCancel, handleGoogleLogin, fetchGlobalConfigThunk effect.
 *
 * New UI-only state: isDark (theme toggle), passkeyError (inline alert).
 *
 * Left panel: animated terminal — chosen over logo wall / SVG diagram
 * because it's developer-centric (target audience: k8s platform teams),
 * concretely shows the product value prop, and mirrors the Vercel/
 * PlanetScale aesthetic of showing real CLI output.
 */
import React, { useEffect, useState } from 'react';
import { Form, App as AntdApp, Button, Divider, ConfigProvider, theme as antdTheme } from 'antd';
import { LockOutlined, MoonOutlined, SunOutlined, KeyOutlined } from '@ant-design/icons';
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
import { ensureGlobalConfigThunk, selectGlobalConfigState } from '../../../globalconfig/store';
import type { AppDispatch } from '../../../../store';

// ─── Design tokens ────────────────────────────────────────────────────────────

const LIGHT_TOKENS = {
  colorPrimary: '#1e293b',
  colorBgContainer: '#ffffff',
  colorBorder: '#e2e8f0',
  borderRadius: 10,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const DARK_TOKENS = {
  colorPrimary: '#f8fafc',
  colorBgContainer: '#0f172a',
  colorBorder: '#1e293b',
  borderRadius: 10,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const GoogleIcon: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.659 14.013 17.64 11.705 17.64 9.2z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
      fill="#EA4335"
    />
  </svg>
);

const TerminalDemo: React.FC = () => (
  <div
    style={{
      fontFamily: '"SF Mono", "Fira Code", "Roboto Mono", monospace',
      background: 'rgba(0,0,0,0.32)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '10px',
      padding: '16px 18px',
      fontSize: '13px',
      lineHeight: 1.75,
      width: '100%',
    }}
  >
    <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
      {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
        <span
          key={c}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: c,
            display: 'inline-block',
          }}
        />
      ))}
    </div>
    <div>
      <span style={{ color: '#475569' }}>$ </span>
      <span style={{ color: '#e2e8f0' }}>kubectl platform auth login</span>
    </div>
    <div className="auth-terminal-line-2">
      <span style={{ color: '#475569' }}>↳ </span>
      <span style={{ color: '#20c997' }}>Passkey challenge sent to device…</span>
    </div>
    <div className="auth-terminal-line-3">
      <span style={{ color: '#475569' }}>✓ </span>
      <span style={{ color: '#e2e8f0' }}>Token issued. Valid for 8h.</span>
      <span className="auth-terminal-cursor" style={{ color: '#20c997', marginLeft: 2 }}>
        █
      </span>
    </div>
  </div>
);

const BrandPanel: React.FC = () => (
  <div style={{ maxWidth: '340px', width: '100%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '52px' }}>
      <div
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '8px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <LockOutlined style={{ fontSize: '15px', color: '#e2e8f0' }} />
      </div>
      <span
        style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.2px' }}
      >
        {LOGIN_CONSTANTS.UI.BRAND_NAME}
      </span>
    </div>

    <h2
      style={{
        fontSize: '30px',
        fontWeight: 700,
        lineHeight: 1.25,
        margin: '0 0 14px',
        color: '#f8fafc',
        letterSpacing: '-0.7px',
      }}
    >
      {LOGIN_CONSTANTS.UI.BRAND_HEADLINE}
    </h2>

    <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 36px', lineHeight: 1.65 }}>
      {LOGIN_CONSTANTS.UI.BRAND_TAGLINE}
    </p>

    <TerminalDemo />
  </div>
);

const CompactBanner: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <LockOutlined style={{ fontSize: '14px', color: '#94a3b8' }} />
    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.2px' }}>
      {LOGIN_CONSTANTS.UI.BRAND_NAME}
    </span>
    <span style={{ color: '#475569', fontSize: '13px' }}>·</span>
    <span style={{ fontSize: '13px', color: '#94a3b8' }}>{LOGIN_CONSTANTS.UI.BRAND_TAGLINE}</span>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const Login: React.FC = () => {
  // ── Preserved state (auth logic) ──
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

  // ── New UI-only state ──
  const [isDark, setIsDark] = useState(() => localStorage.getItem('auth-theme') === 'dark');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  // ── Preserved effect ──
  useEffect(() => {
    dispatch(ensureGlobalConfigThunk());
  }, [dispatch]);

  // ── Preserved handlers (auth logic untouched) ──
  const handleLogin = async (values: { username: string }) => {
    setPasskeyError(null);
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
      setPasskeyError('Authentication failed. Please try again.');
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

  // ── Theme helpers ──
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('auth-theme', next ? 'dark' : 'light');
  };

  const isAnyLoading = loading || googleLoading;

  const cssVars = isDark
    ? `
      .auth-root {
        --color-primary: #f8fafc;
        --auth-right-bg: #020617;
        --auth-card-bg: #0f172a;
        --auth-card-border: #1e293b;
        --auth-card-shadow: 0 20px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.25);
        --auth-text-primary: #f8fafc;
        --auth-text-muted: #94a3b8;
        --auth-divider: #1e293b;
        --auth-input-bg: #1e293b;
        --color-border: #1e293b;
      }
    `
    : `
      .auth-root {
        --color-primary: #1e293b;
        --auth-right-bg: #f8fafc;
        --auth-card-bg: #ffffff;
        --auth-card-border: #e2e8f0;
        --auth-card-shadow: 0 20px 60px rgba(15,23,42,0.10), 0 4px 16px rgba(15,23,42,0.06);
        --auth-text-primary: #0B1F33;
        --auth-text-muted: #64748b;
        --auth-divider: #f1f5f9;
        --auth-input-bg: #ffffff;
        --color-border: #e2e8f0;
      }
    `;

  const inputOverrideCSS = `
    .auth-root .ant-input:hover,
    .auth-root .ant-input:focus,
    .auth-root .ant-input-outlined:hover,
    .auth-root .ant-input-outlined:focus,
    .auth-root .ant-input-outlined:focus-within {
      border-color: var(--auth-card-border, #e2e8f0) !important;
      box-shadow: none !important;
    }
    .auth-root .ant-btn,
    .auth-root .ant-btn:focus,
    .auth-root .ant-btn:hover,
    .auth-root .ant-btn:active {
      box-shadow: none !important;
    }
  `;

  const terminalAnimCSS = `
    .auth-terminal-line-2 { opacity: 0; animation: authFadeUp 0.4s ease 0.9s forwards; }
    .auth-terminal-line-3 { opacity: 0; animation: authFadeUp 0.4s ease 1.9s forwards; }
    .auth-terminal-cursor { animation: authBlink 1.1s step-start infinite; }
    @keyframes authFadeUp {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes authBlink { 50% { opacity: 0; } }
  `;

  return (
    <>
      <style>{cssVars}</style>
      <style>{inputOverrideCSS}</style>
      <style>{terminalAnimCSS}</style>

      <ConfigProvider
        wave={{ disabled: true }}
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: isDark ? DARK_TOKENS : LIGHT_TOKENS,
        }}
      >
        <div className="auth-root">
          <AuthContainer leftPanel={<BrandPanel />} compactBanner={<CompactBanner />}>
            {/* Theme toggle */}
            <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
              <button
                type="button"
                onClick={toggleTheme}
                style={{
                  background: 'none',
                  border: '1px solid var(--auth-card-border, #e2e8f0)',
                  borderRadius: '8px',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  color: 'var(--auth-text-muted, #64748b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  transition: 'border-color 0.15s',
                }}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <SunOutlined /> : <MoonOutlined />}
              </button>
            </div>

            <AuthCard>
              <AuthHeader title={LOGIN_CONSTANTS.UI.TITLE} subtitle={LOGIN_CONSTANTS.UI.SUBTITLE} />

              {/* PRIMARY CTA: Passkey */}
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
                    background: 'var(--color-primary, #1e293b)',
                    borderColor: 'var(--color-primary, #1e293b)',
                    color: isDark ? '#0f172a' : '#ffffff',
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

              {/* Divider */}
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

              {/* SECONDARY CTA: Google — complies with Google branding guidelines */}
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

              <AuthFooter
                text={LOGIN_CONSTANTS.UI.FOOTER_TEXT}
                linkText={LOGIN_CONSTANTS.UI.FOOTER_LINK}
                onLinkClick={() => navigate(APP_ROUTES.REGISTER)}
              />
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
