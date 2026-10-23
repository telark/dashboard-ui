import React from 'react';
import { Button, Dropdown, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { BUTTON_COLORS, ROW_ICON_BUTTON_SIZE } from '../../../../../constants';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  REPORT_FILE_NAME,
  REPORT_FORMATS,
} from '../../constants/protectionPlans';
import type { PlanReportFormat, PlanReportMeta } from '../../models';

interface ReportDownloadButtonProps {
  report: PlanReportMeta;
  planName: string;
  canDownload: boolean;
  downloading: string | null;
  onDownload: (report: PlanReportMeta, format: PlanReportFormat, filename: string) => void;
}

const LABEL = PPC.LABELS.REPORTS_TAB.DOWNLOAD;

const MENU_ITEMS = REPORT_FORMATS.map(({ key, label }) => ({
  key,
  label:
    key === 'html' ? (
      <Tooltip title={PPC.LABELS.REPORTS.PRINT_HINT} placement="left">
        <span>{label}</span>
      </Tooltip>
    ) : (
      label
    ),
}));

const ReportDownloadButton: React.FC<ReportDownloadButtonProps> = ({
  report,
  planName,
  canDownload,
  downloading,
  onDownload,
}) => {
  const button = (
    <Button
      type="text"
      icon={<DownloadOutlined />}
      aria-label={LABEL}
      disabled={!canDownload}
      loading={downloading?.startsWith(`${report.id}:`) ?? false}
      // Color only while enabled: an inline color would hide antd's disabled look.
      style={{
        width: ROW_ICON_BUTTON_SIZE,
        height: ROW_ICON_BUTTON_SIZE,
        ...(canDownload && { color: BUTTON_COLORS.MUTED_TEXT }),
      }}
    />
  );
  if (!canDownload) {
    return <Tooltip title={PPC.LABELS.PERMISSION_DENIED.DOWNLOAD_REPORT}>{button}</Tooltip>;
  }
  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{
        items: MENU_ITEMS,
        onClick: ({ key }) =>
          onDownload(report, key as PlanReportFormat, REPORT_FILE_NAME(planName, report.id, key)),
      }}
    >
      <Tooltip title={LABEL}>{button}</Tooltip>
    </Dropdown>
  );
};

export default ReportDownloadButton;
