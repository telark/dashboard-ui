import React from 'react';
import { Button, Tooltip } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { BUTTON_COLORS, ROW_ICON_BUTTON_SIZE } from '../../../../../constants';
import { ACTION_PERMISSIONS, usePermission } from '../../../../auth/hooks';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type { PlanReportMeta } from '../../models';

interface ReportDeleteButtonProps {
  report: PlanReportMeta;
  onDelete: (report: PlanReportMeta) => void;
}

// Deleting a plan deletes its reports, so the plan delete permission gates a single report too.
const { delete: deletePermission } = ACTION_PERMISSIONS.protectionPlans;
const LABEL = PPC.LABELS.REPORTS.DELETE;

// Without the permission it is aria-disabled rather than disabled, so it keeps focus and hover,
// and both show the reason.
const ReportDeleteButton: React.FC<ReportDeleteButtonProps> = ({ report, onDelete }) => {
  const canDelete = usePermission(
    deletePermission.scope,
    deletePermission.level,
    deletePermission.deny,
  );
  return (
    // Focus shows only the reason: the dialog hands focus back on close, and a focus tooltip
    // opening inside that commit makes React warn (flushSync in a lifecycle).
    <Tooltip
      title={canDelete ? LABEL : PPC.LABELS.PERMISSION_DENIED.DELETE_REPORT}
      trigger={canDelete ? ['hover'] : ['hover', 'focus']}
    >
      <Button
        type="text"
        icon={<DeleteOutlined />}
        aria-label={LABEL}
        aria-disabled={!canDelete}
        onClick={() => {
          if (canDelete) onDelete(report);
        }}
        style={{
          width: ROW_ICON_BUTTON_SIZE,
          height: ROW_ICON_BUTTON_SIZE,
          color: canDelete ? BUTTON_COLORS.MUTED_TEXT : BUTTON_COLORS.TOOLBAR_DISABLED_TEXT,
          cursor: canDelete ? undefined : 'not-allowed',
        }}
      />
    </Tooltip>
  );
};

export default ReportDeleteButton;
