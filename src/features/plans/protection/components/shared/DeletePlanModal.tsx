import React, { useState } from 'react';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import Switch from '../../../../../components/display/inputs/Switch';
import { MODAL_CHROME } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';

interface DeletePlanModalProps {
  open: boolean;
  planName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: (keepReports: boolean) => void | Promise<void>;
}

const DELETE_ACTION = 'delete';
const RESOURCE_TYPE = 'protection plan';
const L = PPC.LABELS.ACTIONS;

// The switch sits above the note, so the note's two texts never move it.
const DeletePlanModal: React.FC<DeletePlanModalProps> = ({
  open,
  planName,
  loading,
  onClose,
  onConfirm,
}) => {
  const [keepReports, setKeepReports] = useState(false);
  const [wasOpen, setWasOpen] = useState(open);
  // Each opening starts from the default, where the reports go with the plan.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setKeepReports(false);
  }

  return (
    <ActionConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(keepReports)}
      title={L.DELETE_MODAL_TITLE}
      action={DELETE_ACTION}
      resourceName={planName}
      resourceType={RESOURCE_TYPE}
      confirmText={L.DELETE_MODAL_OK}
      loading={loading}
      getContainer={() => document.body}
    >
      <Switch
        checked={keepReports}
        onChange={setKeepReports}
        label={L.KEEP_REPORTS}
        disabled={loading}
      />
      <div style={MODAL_CHROME.NOTE}>
        {keepReports ? L.DELETE_MODAL_NOTE_KEEP : L.DELETE_MODAL_NOTE}
      </div>
    </ActionConfirmModal>
  );
};

export default DeletePlanModal;
