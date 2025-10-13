import React from 'react';
import { Modal } from 'antd';
import { UI } from '../../../constants/ui';

interface GrouperCardModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const GrouperCardModal: React.FC<GrouperCardModalProps> = React.memo(({ 
  isVisible, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <Modal
      title={UI.CARD.DELETE_TITLE}
      open={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={UI.BUTTONS.CONFIRM}
      cancelText={UI.BUTTONS.CANCEL}
      okButtonProps={{ danger: true }}
    >
      {UI.CARD.DELETE_MESSAGE}
    </Modal>
  );
});

GrouperCardModal.displayName = 'GrouperCardModal';

export default GrouperCardModal;
