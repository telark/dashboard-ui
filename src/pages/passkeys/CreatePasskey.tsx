import React, { useState } from 'react';
import { Form, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import PasskeyForm, {
  type PasskeyFormValues,
} from '../../components/display/passkeys/shared/PasskeyForm';
import { PageContainer } from '../../components/shared';
import { createPasskey, registerStart } from '../../clients/auth';
import { registerPasskey } from '../../utils/auth/webauthn';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';
import type { PublicKeyCredentialCreationOptions } from '../../interfaces/auth/credentials';

const PasskeyIcon = ICONS.PASSKEY;

const CreatePasskey: React.FC = () => {
  const [form] = Form.useForm<PasskeyFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFinish = async (values: PasskeyFormValues) => {
    setSubmitting(true);
    try {
      // Step 1: Start registration - get challenge and options
      const registerStartResponse = await registerStart();

      // Extract options from nested structure
      let options: PublicKeyCredentialCreationOptions;

      if (registerStartResponse.options?.publicKey) {
        const publicKey = (registerStartResponse.options as any).publicKey;
        options = {
          challenge: publicKey.challenge,
          rp: publicKey.rp,
          user: publicKey.user,
          pubKeyCredParams: publicKey.pubKeyCredParams,
          timeout: publicKey.timeout,
          attestation: publicKey.attestation,
          authenticatorSelection: publicKey.authenticatorSelection,
        };
      } else if (registerStartResponse.options?.response) {
        options = registerStartResponse.options.response;
      } else if (registerStartResponse.challenge) {
        options = {
          challenge: registerStartResponse.challenge!,
          rp: registerStartResponse.rp!,
          user: registerStartResponse.user!,
          pubKeyCredParams: registerStartResponse.pubKeyCredParams!,
          timeout: registerStartResponse.timeout,
          attestation: registerStartResponse.attestation,
          authenticatorSelection: registerStartResponse.authenticatorSelection,
        };
      } else {
        throw new Error(PPC.ERRORS.INVALID_RESPONSE_STRUCTURE);
      }

      // Step 2: Create passkey with WebAuthn
      const credential = await registerPasskey({
        challenge: options.challenge,
        rp: options.rp,
        user: options.user,
        pubKeyCredParams: options.pubKeyCredParams,
        timeout: options.timeout,
        attestation: options.attestation,
        authenticatorSelection: options.authenticatorSelection,
      });

      // Step 3: Create passkey - verify attestation and store
      const deviceType: 'platform' | 'cross-platform' = PPC.VALUES
        .DEVICE_TYPE_PLATFORM as 'platform';
      const response = await createPasskey(credential, values.deviceName, deviceType);

      message.success(PPC.LABELS.MESSAGES.CREATED(values.deviceName));
      form.resetFields();
      // Navigate using the device name from the response
      if (response.deviceName) {
        navigate(APP_ROUTES.PASSKEY_VIEW.replace(':id', encodeURIComponent(response.deviceName)));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.CREATE_PASSKEY_FAILED;
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header
        subtitle={PPC.LABELS.CREATE_SUBTITLE}
        breadcrumbs={[
          { label: PPC.LABELS.BREADCRUMBS.PASSKEYS, to: APP_ROUTES.PASSKEYS },
          { label: PPC.LABELS.BREADCRUMBS.CREATE },
        ]}
        icon={<PasskeyIcon />}
      />

      <PasskeyForm
        form={form}
        initialValues={PPC.FORM.INITIAL_VALUES}
        onSubmit={handleFinish}
        buttonText={PPC.LABELS.CREATE_BUTTON_TEXT}
        submitting={submitting}
      />
    </PageContainer>
  );
};

export default CreatePasskey;
