import React from 'react';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { APPLICATIONS_UI } from '../../constants';

interface ApplicationDeleteModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent) => void;
  onConfirm: () => Promise<void>;
  applicationName: string;
  loading: boolean;
}

const ApplicationDeleteModal: React.FC<ApplicationDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  applicationName,
  loading,
}) => {
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <ActionConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        title={APPLICATIONS_UI.CARD.ACTIONS.DELETE_CONFIRM_TITLE}
        action="delete"
        resourceName={applicationName}
        resourceType="application"
        confirmText={APPLICATIONS_UI.CARD.ACTIONS.DELETE}
        cancelText={APPLICATIONS_UI.CARD.ACTIONS.CANCEL}
        loading={loading}
        danger={true}
        customMessage={APPLICATIONS_UI.CARD.ACTIONS.DELETE_CONFIRM_MESSAGE}
      />
    </div>
  );
};

export default ApplicationDeleteModal;
