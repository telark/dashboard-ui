import { useState, useCallback } from 'react';

export interface UseDeassignModalOptions<T> {
  onConfirm: (item: T) => Promise<void>;
  onSuccess?: (item: T) => void;
}

export interface UseDeassignModalReturn<T> {
  modalOpen: boolean;
  deassigningItem: T | null;
  isDeassigning: boolean;
  openModal: (item: T) => void;
  closeModal: () => void;
  handleConfirm: () => Promise<void>;
}

export const useDeassignModal = <T>({
  onConfirm,
  onSuccess,
}: UseDeassignModalOptions<T>): UseDeassignModalReturn<T> => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deassigningItem, setDeassigningItem] = useState<T | null>(null);
  const [isDeassigning, setIsDeassigning] = useState(false);

  const openModal = useCallback((item: T) => {
    setDeassigningItem(item);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setDeassigningItem(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!deassigningItem) return;
    setIsDeassigning(true);
    try {
      await onConfirm(deassigningItem);
      const confirmedItem = deassigningItem;
      setModalOpen(false);
      setDeassigningItem(null);
      onSuccess?.(confirmedItem);
    } catch {
      // onConfirm handles its own error display; keep modal open
    } finally {
      setIsDeassigning(false);
    }
  }, [deassigningItem, onConfirm, onSuccess]);

  return { modalOpen, deassigningItem, isDeassigning, openModal, closeModal, handleConfirm };
};
