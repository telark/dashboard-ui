import { useState, useCallback } from 'react';
import type { Passkey, PasskeyModalStateReturn } from '../../models/passkeys';

export const passkeyModalState = (): PasskeyModalStateReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPasskey, setSelectedPasskey] = useState<Passkey | null>(null);

  const openCreateModal = useCallback(() => {
    setIsEditMode(false);
    setSelectedPasskey(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((passkey: Passkey) => {
    setSelectedPasskey(passkey);
    setIsEditMode(true);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedPasskey(null);
    setIsEditMode(false);
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    isEditMode,
    selectedPasskey,
    openCreateModal,
    openEditModal,
    closeModal,
  };
};
