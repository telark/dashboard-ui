import React from 'react';
import { Button, Tooltip } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, SPACING, FONT_SIZE, LINE_HEIGHT } from '../../../../../constants';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  REPORT_FILE_NAME,
  REPORT_OPEN_FORMAT,
} from '../../constants/protectionPlans';
import type { UsePlanReportsResult } from '../../hooks/usePlanReports';
import type { PlanViolationsResponse, ProtectionPlan } from '../../models';
import { getGenerateReportTooltip } from '../../utils/phaseRules';
import { windowNote } from './violationsCopy';

interface ViolationsWindowNoteProps {
  plan: ProtectionPlan;
  data: PlanViolationsResponse | null;
  reports: UsePlanReportsResult;
  canViewReports: boolean;
  canGenerate: boolean;
  canDownload: boolean;
}

const LABELS = PPC.LABELS.REPORTS;

// Where the older decisions are: the newest report, else a new one while the plan runs.
const ReportAction: React.FC<ViolationsWindowNoteProps> = ({
  plan,
  reports,
  canViewReports,
  canGenerate,
  canDownload,
}) => {
  // Nothing until the list is known, so the button never flips from Generate to Open.
  if (canViewReports && reports.loading) return null;
  const latest = canViewReports ? reports.reports[0] : undefined;
  if (latest) {
    return (
      <Tooltip title={canDownload ? undefined : PPC.LABELS.PERMISSION_DENIED.DOWNLOAD_REPORT}>
        <Button
          icon={<FileTextOutlined />}
          disabled={!canDownload}
          loading={reports.downloading?.startsWith(`${latest.id}:`) ?? false}
          onClick={() =>
            void reports.download(
              latest,
              REPORT_OPEN_FORMAT,
              REPORT_FILE_NAME(plan.name, latest.id, REPORT_OPEN_FORMAT),
            )
          }
        >
          {LABELS.OPEN_LATEST}
        </Button>
      </Tooltip>
    );
  }
  if (plan.phase !== 'active') return null;
  return (
    <Tooltip title={getGenerateReportTooltip(plan, canGenerate)}>
      <Button
        icon={<FileTextOutlined />}
        disabled={!canGenerate}
        loading={reports.generating}
        onClick={() => void reports.generate()}
      >
        {LABELS.GENERATE}
      </Button>
    </Tooltip>
  );
};

const ViolationsWindowNote: React.FC<ViolationsWindowNoteProps> = (props) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: SPACING.MD,
      marginBottom: SPACING.MD,
    }}
  >
    <span
      style={{
        flex: '1 1 320px',
        fontSize: FONT_SIZE.MD,
        lineHeight: LINE_HEIGHT.BASE,
        color: DEFAULT_COLORS.TEXT_SECONDARY,
      }}
    >
      {windowNote(props.plan, props.data)}
    </span>
    <ReportAction {...props} />
  </div>
);

export default ViolationsWindowNote;
