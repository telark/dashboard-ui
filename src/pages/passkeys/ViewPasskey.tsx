import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { APP_ROUTES, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import { createPasskeyViewConfig } from '../../config/passkeyViewConfig';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { getAllPasskeys } from '../../clients/auth';
import { message } from 'antd';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';
import type { Passkey } from '../../interfaces/auth';

const PasskeyIcon = ICONS.PASSKEY;

const ViewPasskey: React.FC = () => {
  const { id: encodedDeviceName } = useParams<{ id: string }>();
  const deviceName = encodedDeviceName ? decodeURIComponent(encodedDeviceName) : undefined;
  const [passkey, setPasskey] = useState<Passkey | null>(null);
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
        } else {
          setNotFound(true);
        }
      } catch (error) {
        message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEYS_FAILED);
        console.error('Failed to load passkey:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadPasskey();
  }, [deviceName]);

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

  const config = createPasskeyViewConfig(passkey);

  const breadcrumbs = [
    { label: PPC.LABELS.BREADCRUMBS.PASSKEYS, to: APP_ROUTES.PASSKEYS },
    { label: passkey.deviceName },
  ];

  return (
    <PageContainer>
      <Header subtitle={PPC.LABELS.VIEW_SUBTITLE} breadcrumbs={breadcrumbs} icon={<PasskeyIcon />} />

      <AnimatedPageWrapper>
        <ViewDetails config={config} />
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default ViewPasskey;

