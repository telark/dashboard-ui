import React, { useEffect, useState, startTransition } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  APP_ROUTES,
  Icons,
  SHARED_DETAILS_CONSTANTS,
} from '../../../../constants';
import { PASSKEYS_PAGE_CONSTANTS as PPC } from '../../constants/passkeys';
import Header from '../../../../components/display/shared/sections/Header';
import ViewDetails from '../../../../components/display/shared/views/ViewDetails';
import { createPasskeyViewConfig } from '../../config';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../../../components/shared';
import { message } from 'antd';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { AppDispatch } from '../../../../store';
import { fetchAllPasskeysThunk } from '../../../../store/passkeys/slices/passkeySlice';
import {
  selectPasskeys,
  selectPasskeyLoading,
  selectPasskeyError,
} from '../../../../store/passkeys/selectors/passkeySelectors';

const PasskeyIcon = Icons.Passkey;

const ViewPasskey: React.FC = () => {
  const { id: encodedDeviceName } = useParams<{ id: string }>();
  const deviceName = encodedDeviceName ? decodeURIComponent(encodedDeviceName) : undefined;
  const dispatch: AppDispatch = useDispatch();
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
      message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEYS_FAILED);
      if (isDevelopment()) {
        logger.error(PPC.LOGS.FAILED_TO_LOAD_PASSKEY, error);
      }
      startTransition(() => {
        setNotFound(true);
      });
    }
  }, [error]);

  const passkey = deviceName ? passkeys.find((p) => p.deviceName === deviceName) : null;

  useEffect(() => {
    if (!loading && deviceName && !passkey) {
      startTransition(() => {
        setNotFound(true);
      });
    }
  }, [loading, deviceName, passkey]);

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

  const config = createPasskeyViewConfig(passkey);

  const breadcrumbs = [
    { label: PPC.LABELS.BREADCRUMBS.PASSKEYS, to: APP_ROUTES.PASSKEYS },
    { label: passkey.deviceName },
  ];

  return (
    <PageContainer>
      <Header
        subtitle={PPC.LABELS.VIEW_SUBTITLE}
        breadcrumbs={breadcrumbs}
        icon={<PasskeyIcon />}
      />

      <AnimatedPageWrapper>
        <ViewDetails config={config} />
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default ViewPasskey;
