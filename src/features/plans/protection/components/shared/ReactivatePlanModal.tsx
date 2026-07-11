import React from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';

interface ReactivatePlanModalProps {
  open: boolean;
  planName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const REACTIVATE_ACTION = 'reactivate';
const RESOURCE_TYPE = 'protection plan';

const ReactivatePlanModal: React.FC<ReactivatePlanModalProps> = ({
  open,
  planName,
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
    icon={<PlayCircleOutlined />}
    customMessage={PPC.LABELS.DETAIL_PAGE.ACTIONS.REACTIVATE_MODAL_BODY}
    getContainer={() => document.body}
  />
);

export default ReactivatePlanModal;
