import React, { useMemo } from 'react';
import { Button, Empty, Tag, Tooltip, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  EMPTY_CLASS,
  SECTION_LAYOUT,
  STATUS_COLORS,
  TAG_CLASS,
  TIME_FORMATS,
  getPillColor,
} from '../../../../../constants';
import { formatDateTime } from '../../../../../utils/shared/time';
import { FancySpinner } from '../../../../../components/animation';
import { useUsernamesByIds } from '../../../../../hooks/useUsernamesByIds';
import type { RootState } from '../../../../../store';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  REPORT_FORMATS,
  REPORT_SYSTEM_USER_ID,
} from '../../constants/protectionPlans';
import type { PlanPhase, PlanReportFormat, PlanReportMeta } from '../../models';

interface ReportsSectionProps {
  data: PlanReportMeta[] | null;
  loading: boolean;
  error: string | null;
  downloading: string | null;
  phase: PlanPhase;
  planName: string;
  users: RootState['users']['users'];
  canDownload: boolean;
  onDownload: (report: PlanReportMeta, format: PlanReportFormat, filename: string) => void;
}

const LABELS = PPC.LABELS.REPORTS;

const emptyMessage = (phase: PlanPhase): string => {
  if (phase === 'draft' || phase === 'scheduled') return LABELS.EMPTY_DRAFT;
  if (phase === 'active') return LABELS.EMPTY_ACTIVE;
  return LABELS.EMPTY_ENDED;
};

const ReportsSection: React.FC<ReportsSectionProps> = ({
  data,
  loading,
  error,
  downloading,
  phase,
  planName,
  users,
  canDownload,
  onDownload,
}) => {
  const reports = data ?? [];
  const generatorIds = useMemo(() => (data ?? []).map((report) => report.generatedBy), [data]);
  const usernamesById = useUsernamesByIds(generatorIds, true);

  if (loading && reports.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <FancySpinner showLabel={false} size={24} />
      </div>
    );
  }

  if (error || reports.length === 0) {
    return (
      <Empty
        className={EMPTY_CLASS.SECTION}
        image={<FileTextOutlined />}
        description={
          error ? (
            <Typography.Text>{error}</Typography.Text>
          ) : (
            <>
              <Typography.Title level={4}>{LABELS.EMPTY_TITLE}</Typography.Title>
              <Typography.Text>{emptyMessage(phase)}</Typography.Text>
            </>
          )
        }
      />
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
            style={{
              padding: '10px 0',
              borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
              <Tag
                color={getPillColor(STATUS_COLORS.PLAN_REPORT_TRIGGER[report.trigger])}
                className={TAG_CLASS.AS_IS}
              >
                {LABELS.TRIGGER_LABELS[report.trigger]}
              </Tag>
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {LABELS.GENERATED_AT}{' '}
                {formatDateTime(report.generatedAt, TIME_FORMATS.DATE_TIME_12H)} ·{' '}
                {LABELS.GENERATED_BY}{' '}
                <span title={report.generatedBy}>{resolveUser(report.generatedBy)}</span>
              </span>
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                · {LABELS.DECISIONS}: {report.violationsTotal}
              </span>
              {report.truncated && <Tag className={TAG_CLASS.AS_IS}>{LABELS.TRUNCATED}</Tag>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {REPORT_FORMATS.map(({ key, label }) => {
                const button = (
                  <Button
                    key={key}
                    size="small"
                    loading={downloading === `${report.id}:${key}`}
                    disabled={!canDownload}
                    onClick={() => onDownload(report, key, `${planName}-${report.id}.${key}`)}
                  >
                    {label}
                  </Button>
                );
                const title = !canDownload
                  ? PPC.LABELS.PERMISSION_DENIED.DOWNLOAD_REPORT
                  : key === 'html'
                    ? LABELS.PRINT_HINT
                    : undefined;
                return title ? (
                  <Tooltip key={key} title={title}>
                    {button}
                  </Tooltip>
                ) : (
                  button
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportsSection;
