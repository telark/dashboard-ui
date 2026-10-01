import React, { memo, useCallback } from 'react';
import { App as AntdApp } from 'antd';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import { BUTTON_TEXTS, MODAL_CHROME } from '../../../../constants';
import { BaseModal } from '../../../../components/display/modal';
import { ActionButtons } from '../../../../components/display/buttons';

export interface EnrollLinkModalProps {
  url: string | null;
  onClose: () => void;
  title?: string;
  description?: React.ReactNode;
}

const EnrollLinkModal: React.FC<EnrollLinkModalProps> = memo(({ url, onClose, ...copy }) => {
  const { message } = AntdApp.useApp();

  const handleCopy = useCallback(() => {
    if (!url) return;
    globalThis.navigator.clipboard.writeText(url).then(
      () => message.success(PPC.ENROLL.COPIED),
      () => message.error(PPC.ENROLL.COPY_FAILED),
    );
  }, [url, message]);

  return (
    <BaseModal
      open={url !== null}
      onCancel={onClose}
      title={copy.title ?? PPC.ENROLL.MODAL_TITLE}
      description={copy.description ?? PPC.ENROLL.MODAL_DESCRIPTION}
      footer={
        <ActionButtons
          confirmText={PPC.ENROLL.COPY}
          onConfirm={handleCopy}
          onCancel={onClose}
          cancelText={BUTTON_TEXTS.CLOSE}
        />
      }
    >
      <div title={url ?? undefined} style={MODAL_CHROME.FIELD}>
        {url}
      </div>
    </BaseModal>
  );
});

EnrollLinkModal.displayName = 'EnrollLinkModal';

export default EnrollLinkModal;
