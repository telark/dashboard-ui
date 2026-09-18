import React, { memo, useCallback } from 'react';
import { App as AntdApp, Button, Input, Modal, Space } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';

export interface EnrollLinkModalProps {
  url: string | null;
  onClose: () => void;
}

const EnrollLinkModal: React.FC<EnrollLinkModalProps> = memo(({ url, onClose }) => {
  const { message } = AntdApp.useApp();

  const handleCopy = useCallback(() => {
    if (!url) return;
    globalThis.navigator.clipboard.writeText(url).then(
      () => message.success(PPC.ENROLL.COPIED),
      () => message.error(PPC.ENROLL.COPY_FAILED),
    );
  }, [url, message]);

  return (
    <Modal
      open={url !== null}
      title={PPC.ENROLL.MODAL_TITLE}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
    >
      <p>{PPC.ENROLL.MODAL_DESCRIPTION}</p>
      <Space.Compact style={{ width: '100%' }}>
        <Input readOnly value={url ?? ''} />
        <Button icon={<CopyOutlined />} onClick={handleCopy}>
          {PPC.ENROLL.COPY}
        </Button>
      </Space.Compact>
    </Modal>
  );
});

EnrollLinkModal.displayName = 'EnrollLinkModal';

export default EnrollLinkModal;
