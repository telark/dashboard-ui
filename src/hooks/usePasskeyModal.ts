import { useState, useCallback } from 'react';
import type { Passkey } from '../interfaces/auth/passkeys';

export interface UsePasskeyModalReturn {
  isModalOpen: boolean;
  isEditMode: boolean;
  selectedPasskey: Passkey | null;
  openCreateModal: () => void;
  openEditModal: (passkey: Passkey) => void;
  closeModal: () => void;
}

export const usePasskeyModal = (): UsePasskeyModalReturn => {
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
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedPasskey(null);
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

