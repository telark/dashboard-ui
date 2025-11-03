import React from 'react';
import { Modal } from 'antd';
import { AiOutlineClose } from 'react-icons/ai';
import type { BaseModalProps } from '../../../../interfaces/modal';

const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onCancel,
  width = 360,
  children,
  centered = true,
  styles,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={width}
      centered={centered}
      styles={{
        body: { padding: 0, minHeight: 320, ...styles?.body },
        content: { borderRadius: 16, overflow: 'hidden', ...styles?.content },
      }}
      closeIcon={
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 20px' }}>
          <AiOutlineClose size={18} color="#000" />
        </span>
      }
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
