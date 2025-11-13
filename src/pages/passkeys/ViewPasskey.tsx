import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { APP_ROUTES, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import { createPasskeyViewConfig } from '../../config/passkeyViewConfig';
import { Card } from 'antd';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { getAllPasskeys, getPasskey } from '../../clients/auth';
import { message } from 'antd';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';
import type { Passkey } from '../../interfaces/auth';

const PasskeyIcon = ICONS.PASSKEY;

const ViewPasskey: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [passkey, setPasskey] = useState<Passkey | null>(null);
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
        } catch {
          // If that fails, try to find in list by id
          const allPasskeys = await getAllPasskeys();
          const found = allPasskeys.find((p) => p.id === id || p.credentialId === id);
          if (found) {
            setPasskey(found);
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
  }, [id]);

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

