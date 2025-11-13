import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { APP_ROUTES, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import PasskeyForm, { type PasskeyFormValues } from '../../components/display/passkeys/shared/PasskeyForm';
import { PageContainer, NotFound } from '../../components/shared';
import { getAllPasskeys, getPasskey, updatePasskey } from '../../clients/auth';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants/auth';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import type { Passkey, UpdatePasskeyRequest } from '../../interfaces/auth';

const PasskeyIcon = ICONS.PASSKEY;

const EditPasskey: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<PasskeyFormValues>();
  const [passkey, setPasskey] = useState<Passkey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadPasskey = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Try to get by credentialId first (if id is credentialId)
        try {
          const data = await getPasskey(id);
          setPasskey(data);
          form.setFieldsValue({ deviceName: data.deviceName });
        } catch {
          // If that fails, try to find in list by id
          const allPasskeys = await getAllPasskeys();
          const found = allPasskeys.find((p) => p.id === id || p.credentialId === id);
          if (found) {
            setPasskey(found);
            form.setFieldsValue({ deviceName: found.deviceName });
          } else {
            setNotFound(true);
          }
        }
      } catch (error) {
        message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEY_FAILED);
        console.error('Failed to load passkey:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPasskey();
  }, [id, form]);

  const handleFinish = async (values: PasskeyFormValues) => {
    if (!passkey) return;

    setSubmitting(true);
    try {
      const updateRequest: UpdatePasskeyRequest = {
        deviceName: values.deviceName,
      };
      await updatePasskey(passkey.credentialId, updateRequest);
      message.success(PPC.LABELS.MESSAGES.UPDATED(passkey.deviceName));
      navigate(`${APP_ROUTES.PASSKEYS}/${passkey.id}/view`);
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
        <div>Loading...</div>
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
      <Header subtitle={PPC.LABELS.EDIT_SUBTITLE} breadcrumbs={breadcrumbs} icon={<PasskeyIcon />} />

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

