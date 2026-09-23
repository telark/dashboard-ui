import React from 'react';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { labelsFor } from '../../constants';

interface CategoryDeleteModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  onConfirm: () => Promise<void>;
  categoryName: string;
  loading: boolean;
  scope: string;
}

const CategoryDeleteModal: React.FC<CategoryDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  categoryName,
  loading,
  scope,
}) => {
  const L = labelsFor(scope);
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <ActionConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        title={L.ACTIONS.DELETE_MODAL_TITLE}
        action="delete"
        resourceName={categoryName}
        resourceType={L.RESOURCE_TYPE}
        confirmText={L.ACTIONS.DELETE_MODAL_OK}
        loading={loading}
      />
    </div>
  );
};

export default CategoryDeleteModal;
