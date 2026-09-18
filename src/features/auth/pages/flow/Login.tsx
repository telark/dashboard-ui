import React, { useEffect, useRef, useState } from 'react';
import { Form, App as AntdApp, Button, Divider } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  performLogin,
  cleanupOrphanedPasskeys,
  type OrphanedPasskeysInfo,
} from '../../utils/flow/login';
import { redirectToGoogle } from '../../utils/flow/google';
import { isWebAuthnSupported } from '../../utils/webauthn/core';
import { APP_ROUTES } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { GoogleIcon } from '../../../../components/display/icons/GoogleIcon';
import {
  LoginForm,
  AuthCard,
  AuthHeader,
  AuthFooter,
  OrphanedPasskeysModal,
  InsecureContextAlert,
} from '../../components';
import {
  ensureAuthConfigThunk,
  selectGoogleClientID,
  selectSelfRegistrationEnabled,
} from '../../store';
import type { AppDispatch } from '../../../../store';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [orphanedInfo, setOrphanedInfo] = useState<OrphanedPasskeysInfo | null>(null);
  const [showPasskeyForm, setShowPasskeyForm] = useState(false);
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const googleClientID = useSelector(selectGoogleClientID);
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

  const isAnyLoading = loading || googleLoading;
  const passkeysAvailable = isWebAuthnSupported();

  return (
    <>
      <AuthCard>
        <AuthHeader title={LOGIN_CONSTANTS.UI.TITLE} subtitle={LOGIN_CONSTANTS.UI.SUBTITLE} />
        {!passkeysAvailable && <InsecureContextAlert />}

        {!showPasskeyForm ? (
          <Button
            block
            onClick={() => setShowPasskeyForm(true)}
            disabled={isAnyLoading || !passkeysAvailable}
            style={{
              fontWeight: 600,
              background: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
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
            onClick={handleGoogleLogin}
            loading={googleLoading}
            disabled={loading}
            style={{
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
