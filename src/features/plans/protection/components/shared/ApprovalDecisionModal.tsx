import React, { useState } from 'react';
import { Input } from 'antd';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { DEFAULT_COLORS } from '../../../../../constants';
import { formatDateTime } from '../../../../../utils/shared/time';
import { PLAN_APPROVAL, PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { usePlanTaxonomyLists } from '../../hooks/usePlanTaxonomies';
import type { PlanApprovalDecision, ProtectionPlan } from '../../models';

interface ApprovalDecisionModalProps {
  open: boolean;
  decision: PlanApprovalDecision;
  plan: ProtectionPlan;
  loading: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void | Promise<void>;
}

const RESOURCE_TYPE = 'protection plan';
const ACTIONS = PPC.LABELS.DETAIL_PAGE.ACTIONS;
const CARD_LABELS = PPC.LABELS.CARD;

const buildSummary = (plan: ProtectionPlan, environmentName: string | undefined): string => {
  const targets =
    plan.scope.type === 'namespaces'
      ? CARD_LABELS.NAMESPACES_COUNT(plan.scope.namespaces?.length ?? 0)
      : CARD_LABELS.APPLICATIONS_COUNT(plan.scope.applicationRefs?.length ?? 0);
  const window =
    plan.timeMode === 'time_range' && plan.timeRange
      ? `${formatDateTime(plan.timeRange.startAt, CARD_LABELS.WINDOW_TIME_FORMAT)}${
          CARD_LABELS.RANGE_SEPARATOR
        }${formatDateTime(plan.timeRange.endAt, CARD_LABELS.WINDOW_TIME_FORMAT)}`
      : CARD_LABELS.PERMANENT_RANGE;
  return [
    PPC.LABELS.EXECUTION_LABELS[plan.approvalMode ?? 'automatic'],
    environmentName,
    ACTIONS.DECISION_POLICIES_COUNT(plan.policies?.length ?? 0),
    targets,
    window,
  ]
    .filter(Boolean)
    .join(CARD_LABELS.META_SEPARATOR);
};

const ApprovalDecisionModal: React.FC<ApprovalDecisionModalProps> = ({
  open,
  decision,
  plan,
  loading,
  onClose,
  onConfirm,
}) => {
  const [comment, setComment] = useState('');
  const trimmedComment = comment.trim();
  const { environments } = usePlanTaxonomyLists();
  const environmentName = environments.find((c) => c.id === plan.environmentRef)?.name;
  const rejecting = decision === 'rejected';

  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setComment('');
  }

  return (
    <ActionConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(trimmedComment)}
      title={rejecting ? ACTIONS.REJECT_MODAL_TITLE : ACTIONS.APPROVE_MODAL_TITLE}
      action={rejecting ? ACTIONS.REJECT : ACTIONS.APPROVE}
      resourceName={plan.name}
      resourceType={RESOURCE_TYPE}
      confirmText={rejecting ? ACTIONS.REJECT_MODAL_OK : ACTIONS.APPROVE_MODAL_OK}
      loading={loading}
      confirmDisabled={rejecting && trimmedComment === ''}
      danger={rejecting}
      getContainer={() => document.body}
      customMessage={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <span>{rejecting ? ACTIONS.REJECT_MODAL_BODY : ACTIONS.APPROVE_MODAL_BODY}</span>
          <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
            {buildSummary(plan, environmentName)}
          </span>
          <Input.TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={PLAN_APPROVAL.COMMENT_MAX}
            showCount
            placeholder={ACTIONS.DECISION_COMMENT_PLACEHOLDER}
            aria-label={ACTIONS.DECISION_COMMENT_LABEL}
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
          {rejecting && (
            <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
              {ACTIONS.REJECT_COMMENT_REQUIRED}
            </span>
          )}
        </div>
      }
    />
  );
};

export default ApprovalDecisionModal;
