import React from 'react';
import { Form, Input, Button, FormInstance } from 'antd';
import { FieldError } from '../../../../components/display/inputs';
import { KeyOutlined } from '@ant-design/icons';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { AuthForm } from '../shared/AuthForm';
import {
  BUTTON_CONFIGS,
  DEFAULT_COLORS,
  SPACING,
  FONT_WEIGHT,
  FONT_SIZE,
  INPUT_LIMITS,
} from '../../../../constants';
import { inputGuard } from '../../../../utils/helpers/inputGuard';

interface LoginFormProps {
  form: FormInstance;
  loading: boolean;
  onFinish: (values: { email: string }) => void;
  error?: string | null;
}

const emailGuard = inputGuard(INPUT_LIMITS.EMAIL.MAX, {
  required: AUTH_ERROR_MESSAGES.MISSING_EMAIL,
});

export const LoginForm: React.FC<LoginFormProps> = ({ form, loading, onFinish, error }) => (
  <AuthForm form={form} onFinish={onFinish}>
    <Form.Item
      name="email"
      normalize={emailGuard.normalize}
      rules={[
        ...emailGuard.rules,
        { type: 'email', message: 'Please enter a valid email address' },
      ]}
      style={{ marginBottom: SPACING.MD }}
    >
      <Input
        {...emailGuard.input}
        type="email"
        placeholder={LOGIN_CONSTANTS.UI.EMAIL_PLACEHOLDER}
        autoFocus
        style={{
          borderColor: `var(--auth-card-border, ${DEFAULT_COLORS.AUTH_LIGHT_BORDER})`,
          background: `var(--auth-input-bg, ${DEFAULT_COLORS.AUTH_LIGHT_CARD_BG})`,
          color: `var(--auth-text-primary, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT})`,
        }}
      />
    </Form.Item>

    <Form.Item style={{ marginBottom: SPACING.NONE }}>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        block
        style={{
          fontWeight: FONT_WEIGHT.SEMIBOLD,
          background: DEFAULT_COLORS.SUCCESS,
          borderColor: DEFAULT_COLORS.SUCCESS,
          color: BUTTON_CONFIGS.PRIMARY_BUTTON.TEXT_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: SPACING.SM,
        }}
        icon={!loading ? <KeyOutlined /> : undefined}
      >
        {loading ? LOGIN_CONSTANTS.UI.BUTTON_LOADING : LOGIN_CONSTANTS.UI.BUTTON_SUBMIT}
      </Button>
    </Form.Item>

    {loading && (
      <p
        style={{
          textAlign: 'center',
          fontSize: FONT_SIZE.SM,
          color: `var(--auth-text-muted, ${DEFAULT_COLORS.AUTH_LIGHT_TEXT_MUTED})`,
          margin: `${SPACING.SM}px 0 0`,
        }}
      >
        Waiting for your authenticator…
      </p>
    )}

    {error && (
      <div style={{ marginTop: SPACING.SM }}>
        <FieldError message={error} />
      </div>
    )}
  </AuthForm>
);
