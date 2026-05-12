import React from 'react';
import { Modal } from 'antd';
import { AiOutlineClose } from 'react-icons/ai';
import type { BaseModalProps } from '../../../../interfaces/layout/modal';

const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onCancel,
  width = 360,
  children,
  centered = true,
  showCloseIcon = true,
  styles,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={width}
      centered={centered}
      destroyOnHidden
      styles={{
        body: { padding: 0, minHeight: 'auto', ...styles?.body },
        container: { borderRadius: 16, overflow: 'hidden', ...styles?.content },
      }}
      closeIcon={
        showCloseIcon ? (
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <AiOutlineClose size={18} color="#000" />
          </span>
        ) : (
          false
        )
      }
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
