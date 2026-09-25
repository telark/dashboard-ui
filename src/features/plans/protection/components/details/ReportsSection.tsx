import React from 'react';
import { Button, Tooltip } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, TIME_FORMATS } from '../../../../../constants';
import { formatDateTime } from '../../../../../utils/shared/time';
import { APPLICATION_SECTION_LAYOUT } from '../../../../resources/applications/constants/sectionLayout';
import RowTag from '../../../../../components/display/table/RowTag';
import { FancySpinner } from '../../../../../components/animation';
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

const EMPTY_STATE_CONTAINER: React.CSSProperties = {
  minHeight: 96,
  padding: '14px 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const MUTED_TEXT: React.CSSProperties = {
  margin: 0,
  fontSize: 13,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

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

  if (loading && reports.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <FancySpinner showLabel={false} size={24} />
      </div>
    );
  }

  if (error || reports.length === 0) {
    return (
      <div style={EMPTY_STATE_CONTAINER}>
        <FileTextOutlined
          style={{ fontSize: 32, color: DEFAULT_COLORS.ICON_MUTED, marginBottom: 8 }}
        />
        <p style={MUTED_TEXT}>{error ?? emptyMessage(phase)}</p>
      </div>
    );
  }

  const resolveUser = (id: string): string =>
    id === REPORT_SYSTEM_USER_ID
      ? LABELS.SYSTEM_ACTOR
      : (users.find((u) => u.id === id)?.username ?? id);

  return (
    <div>
      {reports.map((report) => {
        const final = report.trigger !== 'manual';
        return (
          <div
            key={report.id}
            style={{
              padding: '10px 0',
              borderBottom: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
              <RowTag
                text={LABELS.TRIGGER_LABELS[report.trigger]}
                accent={final ? DEFAULT_COLORS.SUCCESS : undefined}
                fontSize={11}
              />
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                {LABELS.GENERATED_AT}{' '}
                {formatDateTime(report.generatedAt, TIME_FORMATS.DATE_TIME_12H)} ·{' '}
                {LABELS.GENERATED_BY} {resolveUser(report.generatedBy)}
              </span>
              <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
                · {LABELS.DECISIONS}: {report.violationsTotal}
              </span>
              {report.truncated && (
                <RowTag text={LABELS.TRUNCATED} fontSize={11} capitalize={false} />
              )}
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
