import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { APP_ROUTES, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC, SHARED_DETAILS_CONSTANTS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import PasskeyForm, {
  type PasskeyFormValues,
} from '../../components/display/passkeys/shared/PasskeyForm';
import { PageContainer, NotFound } from '../../components/shared';
import { getAllPasskeys, updatePasskey } from '../../clients/auth';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';
import { isDevelopment } from '../../utils/helpers/env';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import type { Passkey, UpdatePasskeyRequest } from '../../interfaces/auth';

const PasskeyIcon = ICONS.PASSKEY;

const EditPasskey: React.FC = () => {
  const { id: encodedDeviceName } = useParams<{ id: string }>();
  const deviceName = encodedDeviceName ? decodeURIComponent(encodedDeviceName) : undefined;
  const navigate = useNavigate();
  const [form] = Form.useForm<PasskeyFormValues>();
  const [passkey, setPasskey] = useState<Passkey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadPasskey = async () => {
      if (!deviceName) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Get all passkeys and find the one matching the device name
        const allPasskeys = await getAllPasskeys();
        const found = allPasskeys.find((p) => p.deviceName === deviceName);
        if (found) {
          setPasskey(found);
          form.setFieldsValue({ deviceName: found.deviceName });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEY_FAILED);
        if (isDevelopment()) {
          console.error(PPC.LOGS.FAILED_TO_LOAD_PASSKEY, error);
        }
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPasskey();
  }, [deviceName, form]);

  const handleFinish = async (values: PasskeyFormValues) => {
    if (!passkey) return;

    setSubmitting(true);
    try {
      const updateRequest: UpdatePasskeyRequest = {
        deviceName: values.deviceName,
      };
      await updatePasskey(passkey.credentialId, updateRequest);
      message.success(PPC.LABELS.MESSAGES.UPDATED(values.deviceName));
      // Navigate using the updated device name
      if (values.deviceName) {
        navigate(APP_ROUTES.PASSKEY_VIEW.replace(':id', encodeURIComponent(values.deviceName)));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.UPDATE_PASSKEY_FAILED;
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div>{SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING}</div>
      </PageContainer>
    );
  }

  if (notFound || !passkey) {
    return <NotFound message={PPC.LABELS.NOT_FOUND} />;
  }

  const breadcrumbs = [
    { label: PPC.LABELS.BREADCRUMBS.PASSKEYS, to: APP_ROUTES.PASSKEYS },
    { label: passkey.deviceName },
    { label: PPC.LABELS.BREADCRUMBS.EDIT },
  ];

  return (
    <PageContainer>
      <Header
        subtitle={PPC.LABELS.EDIT_SUBTITLE}
        breadcrumbs={breadcrumbs}
        icon={<PasskeyIcon />}
      />

      <PasskeyForm
        form={form}
        initialValues={{ deviceName: passkey.deviceName }}
        onSubmit={handleFinish}
        buttonText={PPC.LABELS.UPDATE_BUTTON}
        submitting={submitting}
        wrapper={AnimatedPageWrapper}
      />
    </PageContainer>
  );
};

export default EditPasskey;
