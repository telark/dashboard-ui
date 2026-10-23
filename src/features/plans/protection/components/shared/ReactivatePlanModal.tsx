import React from 'react';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';

interface ReactivatePlanModalProps {
  open: boolean;
  planName: string;
  repeating: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const REACTIVATE_ACTION = 'reactivate';
const RESOURCE_TYPE = 'protection plan';

const ReactivatePlanModal: React.FC<ReactivatePlanModalProps> = ({
  open,
  planName,
  repeating,
  loading,
  onClose,
  onConfirm,
}) => (
  <ActionConfirmModal
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title={PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_MODAL_TITLE}
    action={REACTIVATE_ACTION}
    resourceName={planName}
    resourceType={RESOURCE_TYPE}
    confirmText={PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_MODAL_OK}
    loading={loading}
    danger={false}
    customMessage={
      repeating
        ? PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_MODAL_BODY_SERIES
        : PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_MODAL_BODY
    }
    getContainer={() => document.body}
  />
);

export default ReactivatePlanModal;
