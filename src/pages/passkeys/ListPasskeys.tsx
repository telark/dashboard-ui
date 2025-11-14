import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { APP_ROUTES, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import PasskeysTable from '../../components/display/passkeys/list/Table';
import FormModal from '../../components/display/shared/modal/FormModal';
import { PageContainer } from '../../components/shared';
import { getAllPasskeys, deletePasskey, createPasskey, registerStart } from '../../clients/auth';
import { registerPasskey } from '../../utils/auth/webauthn';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';
import type { Passkey, PublicKeyCredentialCreationOptions } from '../../interfaces/auth';

const PasskeyIcon = ICONS.PASSKEY;

const ListPasskeys: React.FC = () => {
  const navigate = useNavigate();
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadPasskeys = async () => {
    setLoading(true);
    try {
      const data = await getAllPasskeys();
      setPasskeys(data);
    } catch (error) {
      message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEYS_FAILED);
      console.error('Failed to load passkeys:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPasskeys();
  }, []);

  const handleView = (record: Passkey) => {
    if (!record.deviceName) {
      console.warn('Passkey record missing deviceName:', record);
      return;
    }
    navigate(APP_ROUTES.PASSKEY_VIEW.replace(':id', encodeURIComponent(record.deviceName)));
  };

  const handleEdit = (record: Passkey) => {
    if (!record.deviceName) {
      console.warn('Passkey record missing deviceName:', record);
      return;
    }
    navigate(APP_ROUTES.PASSKEY_EDIT.replace(':id', encodeURIComponent(record.deviceName)));
  };

  const handleDelete = async (record: Passkey) => {
    try {
      await deletePasskey(record.credentialId);
      message.success(PPC.LABELS.MESSAGES.DELETED(record.deviceName));
      await loadPasskeys();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.DELETE_PASSKEY_FAILED;
      message.error(errorMessage);
    }
  };

  const handleCreate = async (values: Record<string, any>) => {
    const deviceName = values.deviceName as string;
    if (!deviceName) {
      throw new Error('Device name is required');
    }
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
        throw new Error('Invalid response structure from server');
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
      const deviceType: 'platform' | 'cross-platform' = 'platform';
      await createPasskey(credential, deviceName, deviceType);

      message.success(PPC.LABELS.MESSAGES.CREATED(deviceName));
      setIsCreateModalOpen(false);
      await loadPasskeys();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : AUTH_ERROR_MESSAGES.CREATE_PASSKEY_FAILED;
      message.error(errorMessage);
      throw error; // Re-throw to prevent modal from closing on error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header
        subtitle={PPC.LABELS.HEADER_SUBTITLE}
        primaryText={PPC.LABELS.CREATE_BUTTON}
        primaryIcon={<PasskeyIcon size={16} />}
        onPrimary={() => setIsCreateModalOpen(true)}
        breadcrumbs={[{ label: PPC.LABELS.BREADCRUMBS.PASSKEYS }]}
        icon={<PasskeyIcon />}
      />

      <FormModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreate}
        title={PPC.FORM.TITLE}
        subtitle={PPC.FORM.SUBTITLE}
        sectionTitle={PPC.FORM.SECTION_TITLE}
        sectionSubtitle={PPC.FORM.SECTION_SUBTITLE}
        fields={[...PPC.FORM.FIELDS]}
        buttonText={PPC.FORM.BUTTON_TEXT}
        buttonIcon={<PasskeyIcon size={16} />}
        width={PPC.FORM.MODAL_WIDTH}
        initialValues={PPC.FORM.INITIAL_VALUES}
        loading={submitting}
      />

      <PasskeysTable
        passkeys={passkeys}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
};

export default ListPasskeys;

