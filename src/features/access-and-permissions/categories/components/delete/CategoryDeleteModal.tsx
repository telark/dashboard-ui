import React from 'react';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { CATEGORIES_CONSTANTS as CC } from '../../constants';

interface CategoryDeleteModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent) => void;
  onConfirm: () => Promise<void>;
  categoryName: string;
  loading: boolean;
}

const CategoryDeleteModal: React.FC<CategoryDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  categoryName,
  loading,
}) => {
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <ActionConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        title={CC.LABELS.ACTIONS.DELETE_MODAL_TITLE}
        action="delete"
        resourceName={categoryName}
        resourceType="category"
        confirmText={CC.LABELS.ACTIONS.DELETE_MODAL_OK}
        loading={loading}
      />
    </div>
  );
};

export default CategoryDeleteModal;
