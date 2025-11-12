import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { loginStart, loginFinish } from '../../clients/auth';
import { authenticateWithPasskey } from '../../utils/auth/webauthn';
import { setSessionToken } from '../../utils/auth/session';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES, AUTH_INFO_MESSAGES } from '../../constants/auth';
import { APP_ROUTES } from '../../constants';
import type { AuthenticatorAssertionResponse, PublicKeyCredentialRequestOptions } from '../../interfaces/auth';

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { username: string }) => {
    setLoading(true);
    try {
      // Step 1: Start login - get challenge and options
      const loginStartResponse = await loginStart({ username: values.username });

      // Extract options from nested structure
      // Backend returns: { options: { publicKey: { challenge, rpId, allowCredentials, timeout } } }
      let options: PublicKeyCredentialRequestOptions;
      
      // Try different possible response structures
      if (loginStartResponse.options?.publicKey) {
        // Structure: { options: { publicKey: {...} } } - This is the actual structure
        const publicKey = (loginStartResponse.options as any).publicKey;
        options = {
          challenge: publicKey.challenge,
          timeout: publicKey.timeout,
          rpId: publicKey.rpId,
          allowCredentials: publicKey.allowCredentials,
          userVerification: publicKey.userVerification || 'preferred',
        };
      } else if (loginStartResponse.options?.response) {
        // Structure: { options: { response: {...} } } (alternative structure)
        options = loginStartResponse.options.response;
      } else if (loginStartResponse.challenge) {
        // Flattened structure (fallback)
        options = {
          challenge: loginStartResponse.challenge!,
          timeout: loginStartResponse.timeout,
          rpId: loginStartResponse.rpId,
          allowCredentials: loginStartResponse.allowCredentials,
          userVerification: 'preferred',
        };
      } else {
        console.error('Unexpected login response structure:', loginStartResponse);
        throw new Error('Invalid response structure from server. Please check console for details.');
      }

      // Step 2: Authenticate with WebAuthn
      const credential = await authenticateWithPasskey({
        challenge: options.challenge,
        timeout: options.timeout,
        rpId: options.rpId,
        allowCredentials: options.allowCredentials,
        userVerification: options.userVerification || 'preferred',
      });

      // Step 3: Finish login - verify credential and get session
      // Send credential at top level (WebAuthn format) with username
      // The go-webauthn library's FinishLogin expects the credential at the top level
      const assertionResponse = credential.response as AuthenticatorAssertionResponse;
      const loginFinishResponse = await loginFinish({
        username: values.username,
        // Credential fields at top level (WebAuthn format)
        id: credential.id,
        rawId: credential.rawId,
        response: {
          authenticatorData: assertionResponse.authenticatorData,
          clientDataJSON: assertionResponse.clientDataJSON,
          signature: assertionResponse.signature,
          userHandle: assertionResponse.userHandle || null,
        },
        type: credential.type,
      });

      // Step 4: Store session token
      setSessionToken(loginFinishResponse.sessionToken);

      message.success(AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS);
      navigate('/');
    } catch (error: any) {
      // Check if error is about no passkeys
      if (error?.response?.status === 404 || error?.status === 404) {
        const errorMsg = error?.response?.data?.message || error?.message || '';
        if (errorMsg.includes('no passkeys') || errorMsg.includes('No passkeys')) {
          const errorMessage = 'No passkeys found. Please register a passkey first.';
          message.error(errorMessage);
          setTimeout(() => {
            navigate(APP_ROUTES.REGISTER);
          }, 2000);
          return;
        }
      }
      
      const errorMessage = error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.LOGIN_FINISH_FAILED;
      message.error(errorMessage);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '48px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Login</h1>
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: AUTH_ERROR_MESSAGES.MISSING_USERNAME },
            ]}
          >
            <Input placeholder="Enter your username" size="large" />
          </Form.Item>

          <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
            <PrimaryButton
              action="Login with Passkey"
              loading={loading}
              loadingLabel={AUTH_INFO_MESSAGES.LOGGING_IN}
              onClick={() => form.submit()}
              icon={<LoginOutlined />}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

