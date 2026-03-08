import { useState, useCallback, useEffect } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import type { Passkey } from '../../models/passkeys';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';

export type PasskeyPanelFormValues = { deviceName: string };

export interface UsePasskeyPanelStateReturn {
  isPanelOpen: boolean;
  isEditMode: boolean;
  selectedPasskey: Passkey | null;
  formSyncKey: number;
  openCreatePanel: () => void;
  openEditPanel: (passkey: Passkey) => void;
  closePanel: () => void;
  form: FormInstance<PasskeyPanelFormValues>;
}

export const usePasskeyPanelState = (): UsePasskeyPanelStateReturn => {
  const [form] = Form.useForm<PasskeyPanelFormValues>();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState<Passkey | null>(null);
  const [formSyncKey, setFormSyncKey] = useState(0);

  const openCreatePanel = useCallback(() => {
    setIsEditMode(false);
    setSelectedPasskey(null);
    setIsPanelOpen(true);
  }, []);

  const openEditPanel = useCallback((passkey: Passkey) => {
    setSelectedPasskey(passkey);
    setIsEditMode(true);
    setIsPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setSelectedPasskey(null);
    setIsEditMode(false);
    setIsPanelOpen(false);
    form.resetFields();
  }, [form]);

  useEffect(() => {
    if (!isPanelOpen) return;
    if (isEditMode && selectedPasskey) {
      form.setFieldsValue({ deviceName: selectedPasskey.deviceName });
    } else {
      form.setFieldsValue(PPC.FORM.INITIAL_VALUES);
    }
    const id = setTimeout(() => setFormSyncKey((k) => k + 1), 0);
    return () => clearTimeout(id);
  }, [isPanelOpen, isEditMode, selectedPasskey, form]);

  return {
    isPanelOpen,
    isEditMode,
    selectedPasskey,
    formSyncKey,
    openCreatePanel,
    openEditPanel,
    closePanel,
    form,
  };
};
