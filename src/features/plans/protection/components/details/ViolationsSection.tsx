import React from 'react';
import { Empty, Tag, Typography } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import {
  DEFAULT_COLORS,
  EMPTY_CLASS,
  EMPTY_VALUE,
  SECTION_LAYOUT,
  STATUS_COLORS,
  STATUS_DOT,
  TAG_CLASS,
  TRUNCATE_STYLE,
  getPillColor,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
} from '../../../../../constants';
import { formatDateKey, toDateKey } from '../../../../../utils/shared/time';
import { FancySpinner } from '../../../../../components/animation';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { selectProtectionPlanTemplates } from '../../store';
import type {
  PlanMode,
  PlanViolation,
  PlanViolationsResponse,
  ViolationResult,
} from '../../models';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { policyLabel } from './policyHealth';

interface ViolationsSectionProps {
  data: PlanViolationsResponse | null;
  loading: boolean;
  error: string | null;
  planId: string;
  mode: PlanMode;
  empty: { title: string; body: string };
}

export const resultLabel = (result: ViolationResult, mode: PlanMode): string =>
  result === 'fail' && mode === 'audit'
    ? PPC.LABELS.VIOLATIONS.AUDIT_FAIL
    : PPC.LABELS.VIOLATION_RESULT_LABELS[result];

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

const { Title, Text } = Typography;
const V = PPC.LABELS.VIOLATIONS;

const ViolationsSection: React.FC<ViolationsSectionProps> = ({
  data,
  loading,
  error,
  planId,
  mode,
  empty,
}) => {
  const templates = useSelector(selectProtectionPlanTemplates);
  const violations = data?.violations ?? [];
  const grouped = groupByDay(violations);

  if (loading && violations.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING.XXL }}>
        <FancySpinner showLabel={false} size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <Empty
        className={EMPTY_CLASS.SECTION}
        image={<SafetyCertificateOutlined />}
        description={<Text>{error}</Text>}
      />
    );
  }

  if (violations.length === 0) {
    return (
      <Empty
        className={EMPTY_CLASS.SECTION}
        image={<SafetyCertificateOutlined style={{ color: DEFAULT_COLORS.SUCCESS }} />}
        description={
          <>
            <Title level={3}>{empty.title}</Title>
            <Text>{empty.body}</Text>
          </>
        }
      />
    );
  }

  return (
    <div>
      {grouped.map((group, groupIdx) => (
        <div key={group.dayKey}>
          <div
            style={{
              fontSize: FONT_SIZE.XS,
              fontWeight: FONT_WEIGHT.BOLD,
              color: DEFAULT_COLORS.TEXT_MUTED,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginTop: groupIdx === 0 ? SPACING.NONE : SPACING.MD,
              marginBottom: SPACING.SM,
              paddingBottom: SPACING.S6,
              borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
            }}
          >
            {group.dayKey === 'unknown' ? EMPTY_VALUE : formatDateKey(group.dayKey)}
          </div>
          {group.entries.map((entry, idx) => {
            const operation = policyLabel(entry.policy, planId, templates) ?? entry.rule;
            return (
              <div
                key={`${entry.namespace}:${entry.resource.kind}:${entry.resource.name}:${entry.rule}:${entry.timestamp}:${idx}`}
                // 10: the row padding sits between SM and MD.
                style={{
                  padding: '10px 0',
                  borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: SPACING.MD,
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    // 5: drops the dot to the middle of the first text line.
                    style={{
                      ...STATUS_DOT,
                      marginTop: 5,
                      background: STATUS_COLORS.VIOLATION_RESULT[entry.result],
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: SPACING.S6,
                      }}
                    >
                      <Tag color={getPillColor(STATUS_COLORS.VIOLATION_RESULT[entry.result])}>
                        {`${PPC.LABELS.VIOLATIONS.TABLE_RESULT}: ${resultLabel(entry.result, mode)}`}
                      </Tag>
                      {entry.resource.kind && (
                        <Tag>{`${PPC.LABELS.VIOLATIONS.TABLE_RESOURCE_KIND}: ${entry.resource.kind}`}</Tag>
                      )}
                      {entry.resource.name && (
                        <Tag className={TAG_CLASS.AS_IS}>
                          {`${PPC.LABELS.VIOLATIONS.TABLE_RESOURCE_NAME}: ${entry.resource.name}`}
                        </Tag>
                      )}
                      {entry.namespace && (
                        <Tag className={TAG_CLASS.AS_IS}>
                          {`${PPC.LABELS.VIOLATIONS.TABLE_NAMESPACE}: ${entry.namespace}`}
                        </Tag>
                      )}
                      {operation && <Tag className={TAG_CLASS.AS_IS}>{operation}</Tag>}
                    </div>
                    {entry.message && (
                      <div
                        style={{
                          marginTop: SPACING.S6,
                          fontSize: FONT_SIZE.MD,
                          color: DEFAULT_COLORS.TEXT_PRIMARY,
                          lineHeight: LINE_HEIGHT.BASE,
                        }}
                      >
                        {entry.message}
                      </div>
                    )}
                    {/* Shown only when the request named its user: never imply a requester. */}
                    {entry.requestedBy && (
                      <div
                        title={entry.requestedBy}
                        style={{
                          ...TRUNCATE_STYLE,
                          marginTop: SPACING.XS,
                          fontSize: FONT_SIZE.SM,
                          color: DEFAULT_COLORS.TEXT_MUTED,
                        }}
                      >
                        {V.REQUESTED_BY(entry.requestedBy)}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: FONT_SIZE.SM,
                      color: DEFAULT_COLORS.TEXT_MUTED,
                      flexShrink: 0,
                      textAlign: 'right',
                      lineHeight: LINE_HEIGHT.SNUG,
                    }}
                  >
                    {entry.timestamp ? <TimeAgo date={entry.timestamp} /> : EMPTY_VALUE}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export type { ViolationResult };
export default ViolationsSection;
