import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  APP_ROUTES,
  ICONS,
  PASSKEYS_PAGE_CONSTANTS as PPC,
  SHARED_DETAILS_CONSTANTS,
} from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import PasskeyForm, {
  type PasskeyFormValues,
} from '../../components/display/passkeys/shared/PasskeyForm';
import { PageContainer, NotFound } from '../../components/shared';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';
import { isDevelopment } from '../../utils/helpers/env';
import logger from '../../logging';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { AppDispatch } from '../../store';
import {
  fetchAllPasskeysThunk,
  updatePasskeyThunk,
} from '../../store/passkeys/slices/passkeySlice';
import {
  selectPasskeys,
  selectPasskeyLoading,
  selectPasskeyError,
} from '../../store/passkeys/selectors/passkeySelectors';
import type { UpdatePasskeyRequest } from '../../interfaces/passkeys';

const PasskeyIcon = ICONS.PASSKEY;

const EditPasskey: React.FC = () => {
  const { id: encodedDeviceName } = useParams<{ id: string }>();
  const deviceName = encodedDeviceName ? decodeURIComponent(encodedDeviceName) : undefined;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm<PasskeyFormValues>();
  const passkeys = useSelector(selectPasskeys);
  const loading = useSelector(selectPasskeyLoading);
  const error = useSelector(selectPasskeyError);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (passkeys.length === 0) {
      dispatch(fetchAllPasskeysThunk());
    }
  }, [dispatch, passkeys.length]);

  useEffect(() => {
    if (error) {
      message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEY_FAILED);
      if (isDevelopment()) {
        logger.error(PPC.LOGS.FAILED_TO_LOAD_PASSKEY, error);
      }
      setNotFound(true);
    }
  }, [error]);

  const passkey = deviceName ? passkeys.find((p) => p.deviceName === deviceName) : null;

  useEffect(() => {
    if (passkey) {
      form.setFieldsValue({ deviceName: passkey.deviceName });
    }
  }, [passkey, form]);

  useEffect(() => {
    if (!loading && deviceName && !passkey) {
      setNotFound(true);
    }
  }, [loading, deviceName, passkey]);

  const handleFinish = async (values: PasskeyFormValues) => {
    if (!passkey) return;

    try {
      const updateRequest: UpdatePasskeyRequest = {
        deviceName: values.deviceName,
      };
      const result = await dispatch(
        updatePasskeyThunk({ credentialId: passkey.credentialId, request: updateRequest }),
      );
      if (updatePasskeyThunk.fulfilled.match(result)) {
        message.success(PPC.LABELS.MESSAGES.UPDATED(values.deviceName));
        // Navigate using the updated device name
        if (values.deviceName) {
          navigate(APP_ROUTES.PASSKEY_VIEW.replace(':id', encodeURIComponent(values.deviceName)));
        }
      } else {
        const errorMessage =
          result.payload instanceof Error
            ? result.payload.message
            : AUTH_ERROR_MESSAGES.UPDATE_PASSKEY_FAILED;
        message.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.UPDATE_PASSKEY_FAILED;
      message.error(errorMessage);
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
        submitting={loading}
        wrapper={AnimatedPageWrapper}
      />
    </PageContainer>
  );
};

export default EditPasskey;
