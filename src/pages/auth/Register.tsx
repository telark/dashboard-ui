import React, { useState } from 'react';
import { Form, App as AntdApp } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { performRegister } from '../../utils/auth/flows/register';
import { handleAuthError } from '../../utils/auth/shared/errors';
import { APP_ROUTES } from '../../constants';
import { REGISTER_CONSTANTS } from '../../constants/pages/register';
import { RegisterForm } from '../../components/auth/register';
import { AuthContainer, AuthCard, AuthHeader, AuthFooter } from '../../components/auth/shared';

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleRegister = async (values: { username: string; deviceName: string }) => {
    setLoading(true);
    try {
      await performRegister(values.username, values.deviceName, message, () =>
        navigate(APP_ROUTES.LOGIN),
      );
    } catch (error) {
      handleAuthError(error, message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <AuthHeader
          icon={<UserAddOutlined style={{ fontSize: '32px', color: '#ffffff' }} />}
          title={REGISTER_CONSTANTS.UI.TITLE}
          subtitle={REGISTER_CONSTANTS.UI.SUBTITLE}
        />
        <RegisterForm form={form} loading={loading} onFinish={handleRegister} />
        <AuthFooter
          text={REGISTER_CONSTANTS.UI.FOOTER_TEXT}
          linkText={REGISTER_CONSTANTS.UI.FOOTER_LINK}
          onLinkClick={() => navigate(APP_ROUTES.LOGIN)}
        />
      </AuthCard>
    </AuthContainer>
  );
};

export default Register;
