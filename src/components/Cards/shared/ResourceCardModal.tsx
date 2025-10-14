import React from 'react';
import { Modal } from 'antd';
import { UI } from '../../../constants/ui';

interface ResourceCardModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ResourceCardModal: React.FC<ResourceCardModalProps> = React.memo(
  ({ isVisible, title, message, onConfirm, onCancel }) => {
    return (
      <Modal
        title={title}
        open={isVisible}
        onOk={onConfirm}
        onCancel={onCancel}
        okText={UI.BUTTONS.CONFIRM}
        cancelText={UI.BUTTONS.CANCEL}
        okButtonProps={{ danger: true }}
      >
        {message}
      </Modal>
    );
  },
);

ResourceCardModal.displayName = 'ResourceCardModal';

export default ResourceCardModal;
