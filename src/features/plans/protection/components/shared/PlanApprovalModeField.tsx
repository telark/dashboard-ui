import React from 'react';
import { Form, Select, Tooltip } from 'antd';
import { PLAN_APPROVAL, PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanApprovalMode } from '../../models';
import { FORM_ITEM_CLASS } from '../create/types';

const { FORM } = PPC.CREATE_PAGE;

interface PlanApprovalModeFieldProps {
  editMode?: boolean;
}

const PlanApprovalModeField: React.FC<PlanApprovalModeFieldProps> = ({ editMode = false }) => {
  const form = Form.useFormInstance();
  const env = (Form.useWatch('environmentRef', form) ?? form.getFieldValue('environmentRef')) as
    string | undefined;
  const approvalMode = (Form.useWatch('approvalMode', form) ??
    form.getFieldValue('approvalMode')) as PlanApprovalMode | undefined;

  const approvalHelp = [
    approvalMode === 'required' ? FORM.APPROVAL_HELP_REQUIRED : FORM.APPROVAL_HELP_AUTOMATIC,
    env === PLAN_APPROVAL.PRODUCTION_ENVIRONMENT_ID && approvalMode === 'automatic'
      ? FORM.APPROVAL_PRODUCTION_HINT
      : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tooltip title={editMode ? FORM.APPROVAL_MODE_IMMUTABLE_TOOLTIP : undefined}>
      <div>
        <Form.Item
          name="approvalMode"
          label={FORM.APPROVAL_MODE_LABEL}
          extra={approvalHelp}
          style={{ marginBottom: 0 }}
          className={FORM_ITEM_CLASS}
        >
          <Select options={PPC.CREATE_PAGE.APPROVAL_MODE_OPTIONS} disabled={editMode} />
        </Form.Item>
      </div>
    </Tooltip>
  );
};

export default PlanApprovalModeField;
