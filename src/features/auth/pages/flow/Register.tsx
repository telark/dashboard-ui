import React, { useEffect, useState } from 'react';
import { Form, App as AntdApp, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { performRegister } from '../../utils/flow/register';
import { handleAuthError } from '../../utils/shared/errors';
import { APP_ROUTES } from '../../../../constants';
import { REGISTER_CONSTANTS } from '../../constants/register';
import { RegisterForm, AuthCard, AuthHeader, AuthFooter } from '../../components';
import {
  ensureAuthConfigThunk,
  selectAuthConfigState,
  selectSelfRegistrationEnabled,
} from '../../store';
import type { AppDispatch } from '../../../../store';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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

  return (
    <AuthCard>
      {authConfig.initialized && !selfRegEnabled ? (
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
  );
};

export default Register;
