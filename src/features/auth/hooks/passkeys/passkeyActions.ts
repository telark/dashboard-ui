import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { App as AntdApp } from 'antd';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { AppDispatch } from '../../../../store';
import { handleCreatePasskey, handleUpdatePasskey, handleDeletePasskey } from '../../utils';
import type { Passkey, PasskeyActionsReturn } from '../../models/passkeys';

export const usePasskeyActions = (
  openEditModal: (passkey: Passkey) => void,
): PasskeyActionsReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = useCallback(
    (record: Passkey) => {
      if (!record?.deviceName) {
        if (isDevelopment()) {
          logger.warn(PPC.LOGS.MISSING_DEVICE_NAME, record);
        }
        return;
      }
      openEditModal(record);
    },
    [openEditModal],
  );

  const handleDelete = useCallback(
    async (record: Passkey, forceLastDelete = false) => {
      await handleDeletePasskey({
        passkey: record,
        forceLastDelete,
        dispatch,
        message,
      });
    },
    [dispatch, message],
  );

  const handleCreate = useCallback(
    async (values: Record<string, unknown>) => {
      await handleCreatePasskey({
        deviceName: values.deviceName as string,
        dispatch,
        setSubmitting,
        message,
      });
    },
    [dispatch, message],
  );

  const handleUpdate = useCallback(
    async (values: Record<string, unknown>, selectedPasskey: Passkey | null) => {
      if (!selectedPasskey) {
        throw new Error('No passkey selected for update');
      }
      await handleUpdatePasskey({
        passkey: selectedPasskey,
        deviceName: values.deviceName as string,
        dispatch,
        setSubmitting,
        message,
      });
    },
    [dispatch, message],
  );

  return {
    submitting,
    handleEdit,
    handleDelete,
    handleCreate,
    handleUpdate,
  };
};
