import React, { useEffect, useState } from 'react';
import { Form, App as AntdApp, Button, ConfigProvider, theme as antdTheme } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { performRegister } from '../../utils/flow/register';
import { handleAuthError } from '../../utils/shared/errors';
import { APP_ROUTES } from '../../../../constants';
import { REGISTER_CONSTANTS } from '../../constants/register';
import { RegisterForm, AuthContainer, AuthCard, AuthHeader, AuthFooter } from '../../components';
import {
  ensureAuthConfigThunk,
  selectAuthConfigState,
  selectSelfRegistrationEnabled,
} from '../../store';
import type { AppDispatch } from '../../../../store';

const LIGHT_TOKENS = {
  colorPrimary: '#1e293b',
  colorBgContainer: '#ffffff',
  colorBorder: '#e2e8f0',
  borderRadius: 10,
};

const DARK_TOKENS = {
  colorPrimary: '#f8fafc',
  colorBgContainer: '#0f172a',
  colorBorder: '#1e293b',
  borderRadius: 10,
};

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('auth-theme') === 'dark');
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch<AppDispatch>();
  const authConfig = useSelector(selectAuthConfigState);
  const selfRegEnabled = useSelector(selectSelfRegistrationEnabled);

  useEffect(() => {
    dispatch(ensureAuthConfigThunk());
  }, [dispatch]);

  const handleRegister = async (values: { email: string; deviceName: string }) => {
    setLoading(true);
    try {
      await performRegister(values.email, values.deviceName, message, () =>
        navigate(APP_ROUTES.LOGIN),
      );
    } catch (error) {
      handleAuthError(error, message);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('auth-theme', next ? 'dark' : 'light');
  };

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

  const overrideCSS = `
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

  return (
    <>
      <style>{cssVars}</style>
      <style>{overrideCSS}</style>

      <ConfigProvider
        wave={{ disabled: true }}
        theme={{
          cssVar: { key: 'telark-auth' },
          hashed: false,
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: isDark ? DARK_TOKENS : LIGHT_TOKENS,
        }}
      >
        <div className="auth-root">
          <AuthContainer>
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
                }}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <SunOutlined /> : <MoonOutlined />}
              </button>
            </div>

            <AuthCard>
              {authConfig.initialized && !selfRegEnabled ? (
                <>
                  <AuthHeader
                    title={REGISTER_CONSTANTS.UI.DISABLED_TITLE}
                    subtitle={REGISTER_CONSTANTS.UI.DISABLED_MESSAGE}
                  />
                  <Button
                    block
                    size="large"
                    onClick={() => navigate(APP_ROUTES.LOGIN)}
                    style={{ height: '44px', borderRadius: '10px' }}
                  >
                    {REGISTER_CONSTANTS.UI.BACK_TO_LOGIN}
                  </Button>
                </>
              ) : (
                <>
                  <AuthHeader
                    title={REGISTER_CONSTANTS.UI.TITLE}
                    subtitle={REGISTER_CONSTANTS.UI.SUBTITLE}
                  />
                  <RegisterForm form={form} loading={loading} onFinish={handleRegister} />
                  <AuthFooter
                    text={REGISTER_CONSTANTS.UI.FOOTER_TEXT}
                    linkText={REGISTER_CONSTANTS.UI.FOOTER_LINK}
                    onLinkClick={() => navigate(APP_ROUTES.LOGIN)}
                  />
                </>
              )}
            </AuthCard>
          </AuthContainer>
        </div>
      </ConfigProvider>
    </>
  );
};

export default Register;
