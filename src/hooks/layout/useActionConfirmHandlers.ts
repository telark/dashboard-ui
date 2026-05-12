import React, { useCallback } from 'react';

interface UseActionConfirmHandlersProps {
  onClose: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  onConfirm: () => void | Promise<void>;
}

export const useActionConfirmHandlers = ({ onClose, onConfirm }: UseActionConfirmHandlersProps) => {
  const handleClose = useCallback(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      onClose(e);
    },
    [onClose],
  );

  const handleConfirm = useCallback(async () => {
    await onConfirm();
    handleClose();
  }, [onConfirm, handleClose]);

  const handleModalCancel = useCallback(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      // Use setTimeout to prevent click from propagating to row
      setTimeout(() => {
        handleClose(e);
      }, 10);
    },
    [handleClose],
  );

  const handleCloseIconClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleClose(e);
    },
    [handleClose],
  );

  const handleCancelClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      handleClose(e);
    },
    [handleClose],
  );

  const handleConfirmClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handleConfirm();
    },
    [handleConfirm],
  );

  return {
    handleClose,
    handleConfirm,
    handleModalCancel,
    handleCloseIconClick,
    handleCancelClick,
    handleConfirmClick,
  };
};
