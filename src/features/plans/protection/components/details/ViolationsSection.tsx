import React from 'react';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../constants';
import { formatDateKey, toDateKey } from '../../../../../utils/shared/time';
import { APPLICATION_SECTION_LAYOUT } from '../../../../applications/constants/sectionLayout';
import RowTag from '../../../../../components/display/table/RowTag';
import { FancySpinner } from '../../../../../components/animation';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  VIOLATION_RESULT_DOT,
} from '../../constants/protectionPlans';
import type {
  PlanMode,
  PlanViolation,
  PlanViolationsResponse,
  ViolationResult,
} from '../../models';
import TimeAgo from '../../../../../components/display/time/TimeAgo';

interface ViolationsSectionProps {
  data: PlanViolationsResponse | null;
  loading: boolean;
  error: string | null;
  mode: PlanMode;
}

const groupByDay = (
  violations: PlanViolation[],
): { dayKey: string; entries: PlanViolation[] }[] => {
  const groups: { dayKey: string; entries: PlanViolation[] }[] = [];
  for (const v of violations) {
    if (!v.timestamp) {
      const last = groups[groups.length - 1];
      const key = 'unknown';
      if (!last || last.dayKey !== key) groups.push({ dayKey: key, entries: [v] });
      else last.entries.push(v);
      continue;
    }
    const dayKey = toDateKey(v.timestamp);
    const last = groups[groups.length - 1];
    if (!last || last.dayKey !== dayKey) {
      groups.push({ dayKey, entries: [v] });
    } else {
      last.entries.push(v);
    }
  }
  return groups;
};

const EMPTY_STATE_CONTAINER: React.CSSProperties = {
  minHeight: 96,
  padding: '14px 12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

const RETENTION_NOTE_STYLE: React.CSSProperties = {
  margin: 0,
  marginTop: 10,
  fontSize: 12,
  color: DEFAULT_COLORS.TEXT_MUTED,
};

const ViolationsSection: React.FC<ViolationsSectionProps> = ({ data, loading, error, mode }) => {
  const violations = data?.violations ?? [];
  const grouped = groupByDay(violations);
  const retentionWindow = data?.retentionWindow;
  const retentionNote = retentionWindow ? (
    <p style={RETENTION_NOTE_STYLE}>{PPC.LABELS.VIOLATIONS.RETENTION_NOTE(retentionWindow)}</p>
  ) : null;

  if (loading && violations.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <FancySpinner showLabel={false} size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={EMPTY_STATE_CONTAINER}>
        <SafetyCertificateOutlined
          style={{ fontSize: 32, color: DEFAULT_COLORS.ICON_MUTED, marginBottom: 8 }}
        />
        <p style={{ margin: 0, fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>{error}</p>
      </div>
    );
  }

  if (violations.length === 0) {
    return (
      <div style={EMPTY_STATE_CONTAINER}>
        <SafetyCertificateOutlined
          style={{ fontSize: 32, color: DEFAULT_COLORS.SUCCESS, marginBottom: 8 }}
        />
        <h4
          style={{
            margin: 0,
            marginBottom: 6,
            fontSize: 15,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {PPC.LABELS.VIOLATIONS.EMPTY_TITLE}
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {mode === 'enforce'
            ? PPC.LABELS.VIOLATIONS.EMPTY_ENFORCE
            : PPC.LABELS.VIOLATIONS.EMPTY_AUDIT}
        </p>
        {retentionNote}
      </div>
    );
  }

  return (
    <div>
      {grouped.map((group, groupIdx) => (
        <div key={group.dayKey}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: DEFAULT_COLORS.TEXT_MUTED,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginTop: groupIdx === 0 ? 0 : 12,
              marginBottom: 8,
              paddingBottom: 6,
              borderBottom: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
            }}
          >
            {group.dayKey === 'unknown' ? '—' : formatDateKey(group.dayKey)}
          </div>
          {group.entries.map((entry, idx) => {
            const resultLabel = PPC.LABELS.VIOLATION_RESULT_LABELS[entry.result];
            return (
              <div
                key={`${entry.namespace}:${entry.resource.kind}:${entry.resource.name}:${entry.rule}:${entry.timestamp}:${idx}`}
                style={{
                  padding: '10px 0',
                  borderBottom: APPLICATION_SECTION_LAYOUT.SUBTLE_DIVIDER,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      marginTop: 5,
                      flexShrink: 0,
                      background: VIOLATION_RESULT_DOT[entry.result],
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <RowTag
                        text={`${PPC.LABELS.VIOLATIONS.TABLE_RESULT}: ${resultLabel}`}
                        accent={VIOLATION_RESULT_DOT[entry.result]}
                        fontSize={11}
                      />
                      {entry.resource.kind && (
                        <RowTag
                          text={`${PPC.LABELS.VIOLATIONS.TABLE_RESOURCE_KIND}: ${entry.resource.kind}`}
                          {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                        />
                      )}
                      {entry.resource.name && (
                        <RowTag
                          text={`${PPC.LABELS.VIOLATIONS.TABLE_RESOURCE_NAME}: ${entry.resource.name}`}
                          capitalize={false}
                          {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                        />
                      )}
                      {entry.namespace && (
                        <RowTag
                          text={`${PPC.LABELS.VIOLATIONS.TABLE_NAMESPACE}: ${entry.namespace}`}
                          capitalize={false}
                          {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                        />
                      )}
                      {entry.rule && (
                        <RowTag
                          text={`${PPC.LABELS.VIOLATIONS.TABLE_RULE}: ${entry.rule}`}
                          capitalize={false}
                          fontSize={11}
                        />
                      )}
                    </div>
                    {entry.message && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 13,
                          color: DEFAULT_COLORS.TEXT_PRIMARY,
                          lineHeight: 1.5,
                        }}
                      >
                        {entry.message}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      flexShrink: 0,
                      textAlign: 'right',
                      lineHeight: 1.35,
                    }}
                  >
                    {entry.timestamp ? <TimeAgo date={entry.timestamp} /> : '—'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {retentionNote}
    </div>
  );
};

export type { ViolationResult };
export default ViolationsSection;
