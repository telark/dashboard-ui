import React, { useMemo } from 'react';
import { Empty, Tag, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  EMPTY_CLASS,
  SECTION_LAYOUT,
  STATUS_COLORS,
  TAG_CLASS,
  TIME_FORMATS,
  getPillColor,
  SPACING,
  FONT_SIZE,
} from '../../../../../constants';
import { formatDateTime } from '../../../../../utils/shared/time';
import { FancySpinner } from '../../../../../components/animation';
import { useUsernamesByIds } from '../../../../../hooks/useUsernamesByIds';
import type { RootState } from '../../../../../store';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  REPORT_ROW_ACTIONS_GAP_PX,
  REPORT_SYSTEM_USER_ID,
} from '../../constants/protectionPlans';
import ReportDownloadButton from '../shared/ReportDownloadButton';
import ReportDeleteButton from '../shared/ReportDeleteButton';
import { usePlanReportDelete } from '../../hooks/usePlanReportDelete';
import type { PlanPhase, PlanReportFormat, PlanReportMeta } from '../../models';

interface ReportsSectionProps {
  data: PlanReportMeta[] | null;
  loading: boolean;
  error: string | null;
  downloading: string | null;
  phase: PlanPhase;
  repeating: boolean;
  planName: string;
  users: RootState['users']['users'];
  canDownload: boolean;
  onDownload: (report: PlanReportMeta, format: PlanReportFormat, filename: string) => void;
  onDeleted: () => void;
}

const LABELS = PPC.LABELS.REPORTS;

const emptyMessage = (phase: PlanPhase, repeating: boolean): string => {
  if (phase === 'draft' || phase === 'scheduled') return LABELS.EMPTY_DRAFT;
  if (phase === 'active') return repeating ? LABELS.EMPTY_ACTIVE_SERIES : LABELS.EMPTY_ACTIVE;
  return LABELS.EMPTY_ENDED;
};

const ReportsSection: React.FC<ReportsSectionProps> = ({
  data,
  loading,
  error,
  downloading,
  phase,
  repeating,
  planName,
  users,
  canDownload,
  onDownload,
  onDeleted,
}) => {
  const reports = data ?? [];
  const { requestDelete, modal } = usePlanReportDelete(onDeleted);
  const generatorIds = useMemo(() => (data ?? []).map((report) => report.generatedBy), [data]);
  const usernamesById = useUsernamesByIds(generatorIds, true);

  if (loading && reports.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING.XXL }}>
        <FancySpinner showLabel={false} size={24} />
      </div>
    );
  }

  // The dialog stays mounted once the last report goes, so it closes as it opened.
  if (error || reports.length === 0) {
    return (
      <>
        <Empty
          className={EMPTY_CLASS.SECTION}
          image={<FileTextOutlined />}
          description={
            error ? (
              <Typography.Text>{error}</Typography.Text>
            ) : (
              <>
                <Typography.Title level={3}>{LABELS.EMPTY_TITLE}</Typography.Title>
                <Typography.Text>{emptyMessage(phase, repeating)}</Typography.Text>
              </>
            )
          }
        />
        {modal}
      </>
    );
  }

  const resolveUser = (id: string): string =>
    id === REPORT_SYSTEM_USER_ID
      ? LABELS.SYSTEM_ACTOR
      : (users.find((u) => u.id === id)?.username ?? usernamesById[id] ?? '');

  return (
    <div>
      {reports.map((report) => {
        return (
          <div
            key={report.id}
            // 10: the row padding sits between SM and MD.
            style={{
              padding: '10px 0',
              borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: SPACING.MD,
            }}
          >
            <div
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: SPACING.S6 }}
            >
              <Tag
                color={getPillColor(STATUS_COLORS.PLAN_REPORT_TRIGGER[report.trigger])}
                className={TAG_CLASS.AS_IS}
              >
                {LABELS.TRIGGER_LABELS[report.trigger]}
              </Tag>
              <span style={{ fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {LABELS.GENERATED_AT}{' '}
                {formatDateTime(report.generatedAt, TIME_FORMATS.DATE_TIME_12H)} ·{' '}
                {LABELS.GENERATED_BY}{' '}
                <span title={report.generatedBy}>{resolveUser(report.generatedBy)}</span>
              </span>
              <span style={{ fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}>
                · {LABELS.DECISIONS}: {report.violationsTotal}
              </span>
              {report.truncated && <Tag className={TAG_CLASS.AS_IS}>{LABELS.TRUNCATED}</Tag>}
            </div>
            <div style={{ display: 'flex', gap: REPORT_ROW_ACTIONS_GAP_PX }}>
              <ReportDownloadButton
                report={report}
                planName={planName}
                canDownload={canDownload}
                downloading={downloading}
                onDownload={onDownload}
              />
              <ReportDeleteButton report={report} onDelete={(r) => requestDelete(r, planName)} />
            </div>
          </div>
        );
      })}
      {modal}
    </div>
  );
};

export default ReportsSection;
