import React from 'react';
import { Empty, Tag, Typography } from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  EMPTY_CLASS,
  EMPTY_VALUE,
  SECTION_LAYOUT,
  STATUS_COLORS,
  TAG_CLASS,
  getPillColor,
} from '../../../../../constants';
import { formatDateKey, toDateKey } from '../../../../../utils/shared/time';
import { FancySpinner } from '../../../../../components/animation';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
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

const { Title, Text } = Typography;

const ViolationsSection: React.FC<ViolationsSectionProps> = ({ data, loading, error, mode }) => {
  const violations = data?.violations ?? [];
  const grouped = groupByDay(violations);

  if (loading && violations.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
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
            <Title level={4}>{PPC.LABELS.VIOLATIONS.EMPTY_TITLE}</Title>
            <Text>
              {mode === 'enforce'
                ? PPC.LABELS.VIOLATIONS.EMPTY_ENFORCE
                : PPC.LABELS.VIOLATIONS.EMPTY_AUDIT}
            </Text>
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
              fontSize: 11,
              fontWeight: 700,
              color: DEFAULT_COLORS.TEXT_MUTED,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginTop: groupIdx === 0 ? 0 : 12,
              marginBottom: 8,
              paddingBottom: 6,
              borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
            }}
          >
            {group.dayKey === 'unknown' ? EMPTY_VALUE : formatDateKey(group.dayKey)}
          </div>
          {group.entries.map((entry, idx) => {
            const resultLabel = PPC.LABELS.VIOLATION_RESULT_LABELS[entry.result];
            return (
              <div
                key={`${entry.namespace}:${entry.resource.kind}:${entry.resource.name}:${entry.rule}:${entry.timestamp}:${idx}`}
                style={{
                  padding: '10px 0',
                  borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
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
                      background: STATUS_COLORS.VIOLATION_RESULT[entry.result],
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
                      <Tag color={getPillColor(STATUS_COLORS.VIOLATION_RESULT[entry.result])}>
                        {`${PPC.LABELS.VIOLATIONS.TABLE_RESULT}: ${resultLabel}`}
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
                      {entry.rule && (
                        <Tag className={TAG_CLASS.AS_IS}>
                          {`${PPC.LABELS.VIOLATIONS.TABLE_RULE}: ${entry.rule}`}
                        </Tag>
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
