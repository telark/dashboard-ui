import React from 'react';
import { Form, Select, Tooltip } from 'antd';
import { PLAN_APPROVAL, PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { CREATE_PANEL_TEXTS } from '../../constants/createPanel';
import type { PlanApprovalMode } from '../../models';
import { FORM_ITEM_CLASS } from '../create/types';
import { SPACING } from '../../../../../constants';

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
  const repeating = Form.useWatch('timeMode', form) === 'repeating';
  const requiredHelp = repeating ? FORM.APPROVAL_HELP_REQUIRED_SERIES : FORM.APPROVAL_HELP_REQUIRED;

  const approvalHelp = [
    approvalMode === 'required' ? requiredHelp : FORM.APPROVAL_HELP_AUTOMATIC,
    env === PLAN_APPROVAL.PRODUCTION_ENVIRONMENT_ID && approvalMode === 'automatic'
      ? FORM.APPROVAL_PRODUCTION_HINT
      : undefined,
    // Edit says it in the disabled field's tooltip.
    editMode ? undefined : CREATE_PANEL_TEXTS.APPROVAL_IMMUTABLE_HELP,
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
          style={{ marginBottom: SPACING.NONE }}
          className={FORM_ITEM_CLASS}
        >
          <Select options={PPC.CREATE_PAGE.APPROVAL_MODE_OPTIONS} disabled={editMode} />
        </Form.Item>
      </div>
    </Tooltip>
  );
};

export default PlanApprovalModeField;
