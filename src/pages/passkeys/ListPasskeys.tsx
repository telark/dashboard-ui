import React, { useEffect } from 'react';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  ICONS,
  PASSKEYS_PAGE_CONSTANTS as PPC,
  SHARED_DETAILS_CONSTANTS,
} from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import PasskeysTable from '../../components/display/passkeys/list/Table';
import PasskeyFormModal from '../../components/display/passkeys/shared/PasskeyFormModal';
import { PageContainer } from '../../components/shared';
import { AUTH_ERROR_MESSAGES } from '../../constants/auth';
import { isDevelopment } from '../../utils/helpers/env';
import logger from '../../logging';
import { AppDispatch } from '../../store';
import { fetchAllPasskeysThunk } from '../../store/passkeys/slices/passkeySlice';
import {
  selectPasskeys,
  selectPasskeyLoading,
  selectPasskeyError,
} from '../../store/passkeys/selectors/passkeySelectors';
import { usePasskeyModal, usePasskeyHandlers } from '../../hooks/auth/passkeys';

const PasskeyIcon = ICONS.PASSKEY;

const ListPasskeys: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const passkeys = useSelector(selectPasskeys);
  const loading = useSelector(selectPasskeyLoading);
  const error = useSelector(selectPasskeyError);

  const { isModalOpen, isEditMode, selectedPasskey, openCreateModal, openEditModal, closeModal } =
    usePasskeyModal();

  const { submitting, handleView, handleEdit, handleDelete, handleCreate, handleUpdate } =
    usePasskeyHandlers(openEditModal);

  useEffect(() => {
    dispatch(fetchAllPasskeysThunk());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(AUTH_ERROR_MESSAGES.FETCH_PASSKEYS_FAILED);
      if (isDevelopment()) {
        logger.error(PPC.LOGS.FAILED_TO_LOAD_PASSKEYS, error);
      }
    }
  }, [error]);

  const handleModalSubmit = async (values: Record<string, any>) => {
    if (isEditMode) {
      await handleUpdate(values, selectedPasskey);
    } else {
      await handleCreate(values);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header
          subtitle={PPC.LABELS.HEADER_SUBTITLE}
          primaryText={PPC.LABELS.CREATE_BUTTON}
          onPrimary={openCreateModal}
          breadcrumbs={[{ label: PPC.LABELS.BREADCRUMBS.PASSKEYS }]}
          icon={<PasskeyIcon />}
        />
        <div>{SHARED_DETAILS_CONSTANTS.MESSAGES.LOADING}</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header
        subtitle={PPC.LABELS.HEADER_SUBTITLE}
        primaryText={PPC.LABELS.CREATE_BUTTON}
        primaryIcon={<PasskeyIcon size={16} />}
        onPrimary={openCreateModal}
        breadcrumbs={[{ label: PPC.LABELS.BREADCRUMBS.PASSKEYS }]}
        icon={<PasskeyIcon />}
      />

      <PasskeyFormModal
        open={isModalOpen}
        isEditMode={isEditMode}
        selectedPasskey={selectedPasskey}
        passkeys={passkeys}
        submitting={submitting}
        onCancel={closeModal}
        onSubmit={handleModalSubmit}
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
