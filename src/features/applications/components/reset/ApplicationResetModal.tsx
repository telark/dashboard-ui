import React from 'react';
import { ActionConfirmModal } from '../../../../components/display/modal';
import { APPLICATIONS_UI } from '../../constants';

interface ApplicationResetModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  onConfirm: () => Promise<void>;
  applicationNames: string[];
  loading: boolean;
  title?: string;
  message?: React.ReactNode;
}

const ApplicationResetModal: React.FC<ApplicationResetModalProps> = ({
  open,
  onClose,
  onConfirm,
  applicationNames,
  loading,
  title,
  message,
}) => {
  const primaryName = applicationNames[0] ?? '';
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <ActionConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        title={title ?? APPLICATIONS_UI.CARD.ACTIONS.RESET_CONFIRM_TITLE}
        action="reset"
        resourceName={primaryName}
        resourceType="application"
        confirmText={APPLICATIONS_UI.CARD.ACTIONS.RESET}
        cancelText={APPLICATIONS_UI.CARD.ACTIONS.CANCEL}
        loading={loading}
        danger={true}
        customMessage={message ?? APPLICATIONS_UI.CARD.ACTIONS.RESET_CONFIRM_MESSAGE}
      />
    </div>
  );
};

export default ApplicationResetModal;
