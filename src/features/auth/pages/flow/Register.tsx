import React, { useEffect, useState } from 'react';
import { Form, App as AntdApp, Button } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { performRegister, resolveEnrollToken } from '../../utils/flow/register';
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
  // Read once and kept in state: the token leaves the address bar and history right away.
  const [enrollToken] = useState(() =>
    resolveEnrollToken(searchParams.get(REGISTER_CONSTANTS.QUERY.ENROLL)),
  );
  const enrolling = enrollToken !== undefined;
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch<AppDispatch>();
  const selfRegEnabled = useSelector(selectSelfRegistrationEnabled);
  const passkeysAvailable = isWebAuthnSupported();

  useEffect(() => {
    dispatch(ensureAuthConfigThunk());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.has(REGISTER_CONSTANTS.QUERY.ENROLL)) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
      handleAuthError(error, message);
    } finally {
      setLoading(false);
    }
  };

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
