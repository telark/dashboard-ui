import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
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
      });
    },
    [dispatch],
  );

  const handleCreate = useCallback(
    async (values: Record<string, any>) => {
      await handleCreatePasskey({
        deviceName: values.deviceName as string,
        dispatch,
        setSubmitting,
      });
    },
    [dispatch],
  );

  const handleUpdate = useCallback(
    async (values: Record<string, any>, selectedPasskey: Passkey | null) => {
      if (!selectedPasskey) {
        throw new Error('No passkey selected for update');
      }
      await handleUpdatePasskey({
        passkey: selectedPasskey,
        deviceName: values.deviceName as string,
        dispatch,
        setSubmitting,
      });
    },
    [dispatch],
  );

  return {
    submitting,
    handleEdit,
    handleDelete,
    handleCreate,
    handleUpdate,
  };
};
