import React, { useEffect, useState } from 'react';
import { Form, App as AntdApp, Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isEnrollLinkRefused, performRegister, resolveEnrollLink } from '../../utils/flow/register';
import { handleUserLogout } from '../../utils/logout/logout';
import { hasSessionToken } from '../../utils/session/token';
import { handleAuthError } from '../../utils/shared/errors';
import { isWebAuthnSupported } from '../../utils/webauthn/core';
import { APP_ROUTES } from '../../../../constants';
import { REGISTER_CONSTANTS } from '../../constants/register';
import {
  RegisterForm,
  AuthCard,
  AuthHeader,
  AuthFooter,
  InsecureContextAlert,
} from '../../components';
import { ensureAuthConfigThunk, selectSelfRegistrationEnabled } from '../../store';
import type { AppDispatch } from '../../../../store';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // Read once and kept in state: the link leaves the address bar and history right away.
  const [{ token: enrollToken, email: enrollEmail }] = useState(() =>
    resolveEnrollLink(
      searchParams.get(REGISTER_CONSTANTS.QUERY.ENROLL),
      searchParams.get(REGISTER_CONSTANTS.QUERY.EMAIL),
    ),
  );
  const enrolling = enrollToken !== undefined;
  const signedIn = hasSessionToken();
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch<AppDispatch>();
  const selfRegEnabled = useSelector(selectSelfRegistrationEnabled);
  const passkeysAvailable = isWebAuthnSupported();

  useEffect(() => {
    dispatch(ensureAuthConfigThunk());
  }, [dispatch]);

  // While signed in, the link stays in the address bar: the route keeps this page only for a link.
  useEffect(() => {
    if (!signedIn && searchParams.has(REGISTER_CONSTANTS.QUERY.ENROLL)) {
      setSearchParams({}, { replace: true });
    }
  }, [signedIn, searchParams, setSearchParams]);

  // Auth lets a session win over the link, so the link's account can enroll only once it's gone.
  const signOut = () => {
    void handleUserLogout(() => navigate(APP_ROUTES.REGISTER, { replace: true }), message);
  };

  const handleRegister = async (values: { email: string; deviceName: string }) => {
    setLoading(true);
    try {
      await performRegister(
        values.email,
        values.deviceName,
        message,
        () => navigate(APP_ROUTES.LOGIN),
        enrollToken,
      );
    } catch (error) {
      const linkRefused = enrolling && isEnrollLinkRefused(error);
      handleAuthError(
        error,
        message,
        linkRefused ? { customMessage: REGISTER_CONSTANTS.UI.ENROLL_LINK_INVALID } : undefined,
      );
    } finally {
      setLoading(false);
    }
  };

  if (enrolling && signedIn) {
    return (
      <AuthCard>
        <AuthHeader
          title={REGISTER_CONSTANTS.UI.ENROLL_TITLE}
          subtitle={REGISTER_CONSTANTS.UI.ENROLL_SIGNED_IN}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Button type="primary" block onClick={signOut}>
            {REGISTER_CONSTANTS.UI.SIGN_OUT}
          </Button>
          <Button block onClick={() => navigate(APP_ROUTES.HOME, { replace: true })}>
            {REGISTER_CONSTANTS.UI.BACK_TO_DASHBOARD}
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      {!selfRegEnabled && !enrolling ? (
        <>
          <AuthHeader
            title={REGISTER_CONSTANTS.UI.DISABLED_TITLE}
            subtitle={REGISTER_CONSTANTS.UI.DISABLED_MESSAGE}
          />
          <Button block onClick={() => navigate(APP_ROUTES.LOGIN)}>
            {REGISTER_CONSTANTS.UI.BACK_TO_LOGIN}
          </Button>
        </>
      ) : (
        <>
          <AuthHeader
            title={enrolling ? REGISTER_CONSTANTS.UI.ENROLL_TITLE : REGISTER_CONSTANTS.UI.TITLE}
            subtitle={
              enrolling ? REGISTER_CONSTANTS.UI.ENROLL_SUBTITLE : REGISTER_CONSTANTS.UI.SUBTITLE
            }
          />
          {!passkeysAvailable && <InsecureContextAlert />}
          <RegisterForm
            form={form}
            loading={loading}
            onFinish={handleRegister}
            disabled={!passkeysAvailable}
            lockedEmail={enrollEmail}
          />
          <AuthFooter
            text={REGISTER_CONSTANTS.UI.FOOTER_TEXT}
            linkText={REGISTER_CONSTANTS.UI.FOOTER_LINK}
            onLinkClick={() => navigate(APP_ROUTES.LOGIN)}
          />
        </>
      )}
    </AuthCard>
  );
};

export default Register;
