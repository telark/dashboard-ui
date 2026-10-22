import React from 'react';
import { Empty, Tag } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import {
  DEFAULT_COLORS,
  SECTION_LAYOUT,
  STATUS_DOT,
  TAG_CLASS,
  SPACING,
  FONT_SIZE,
  LINE_HEIGHT,
  FONT_WEIGHT,
} from '../../../../../constants';
import { FancySpinner } from '../../../../../components/animation';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import { selectProtectionPlanTemplates } from '../../store';
import type { ProtectionPlan, PlanMode, PlanStatusResponse, PlanPolicyStatus } from '../../models';
import { actsAs, auditsOnly, healthRows, isInForce, policyLabel } from './policyHealth';

interface HealthSectionProps {
  plan: ProtectionPlan;
  status: PlanStatusResponse | null;
  loading: boolean;
  error: string | null;
}

const HD = PPC.LABELS.HEALTH_DETAIL;

const policyDotColor = (row: PlanPolicyStatus, mode: PlanMode): string => {
  if (!row.present) return DEFAULT_COLORS.DANGER;
  if (!row.ready || !actsAs(row, mode)) return DEFAULT_COLORS.WARNING;
  return DEFAULT_COLORS.SUCCESS;
};

const outOfForceReason = (row: PlanPolicyStatus): ((label: string) => string) => {
  if (!row.present) return HD.MISSING;
  if (!row.ready) return HD.NOT_ACTIVE;
  return HD.AUDIT_ONLY;
};

// The count, then why each protection is not in force (once per template across namespaces).
const healthSummary = (
  rows: PlanPolicyStatus[],
  mode: PlanMode,
  labelOf: (name: string) => string,
): string => {
  const out = rows.filter((row) => !isInForce(row, mode));
  if (out.length === 0) return HD.ALL_IN_FORCE(rows.length);
  const reasons = new Set(out.map((row) => outOfForceReason(row)(labelOf(row.name))));
  return [HD.NOT_IN_FORCE(out.length, rows.length), ...reasons].join(' ');
};

const yesNo = (value: boolean): string => (value ? HD.YES : HD.NO);

const HealthSection: React.FC<HealthSectionProps> = ({ plan, status, loading, error }) => {
  const templates = useSelector(selectProtectionPlanTemplates);
  const rows = healthRows(plan, status);
  const labelOf = (name: string): string => policyLabel(name, plan.id, templates) ?? name;
  const driftUnexpected = status?.drift?.unexpected ?? [];

  return (
    <div>
      {error && (
        // Red can't be text on the dark page: the icon carries it.
        <div style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, marginBottom: SPACING.SM }}>
          <CloseCircleFilled
            aria-hidden
            style={{ color: DEFAULT_COLORS.DANGER, marginRight: SPACING.S6 }}
          />
          {error}
        </div>
      )}

      {loading && rows.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: SPACING.XXL }}>
          <FancySpinner showLabel={false} size={24} />
        </div>
      ) : rows.length === 0 ? (
        <Empty description={HD.EMPTY} />
      ) : (
        <div>
          <div
            style={{
              fontSize: FONT_SIZE.MD,
              lineHeight: LINE_HEIGHT.BASE,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
            }}
          >
            {healthSummary(rows, plan.mode, labelOf)}
          </div>
          {rows.map((row) => {
            const dot = policyDotColor(row, plan.mode);
            const label = policyLabel(row.name, plan.id, templates);
            return (
              <div
                key={`${row.namespace}/${row.name}`}
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
                    style={{ ...STATUS_DOT, marginTop: 5, background: dot }}
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
                      {/* The operation it refuses, over the engine's policy name. */}
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: FONT_SIZE.MD,
                            fontWeight: FONT_WEIGHT.BOLD,
                            color: DEFAULT_COLORS.TEXT_PRIMARY,
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {label ?? row.name}
                        </span>
                        {label && (
                          <span
                            style={{
                              fontSize: FONT_SIZE.SM,
                              color: DEFAULT_COLORS.TEXT_MUTED,
                              overflowWrap: 'anywhere',
                            }}
                          >
                            {row.name}
                          </span>
                        )}
                      </div>
                      {row.namespace && (
                        <Tag className={TAG_CLASS.AS_IS}>{`${HD.NAMESPACE}: ${row.namespace}`}</Tag>
                      )}
                      <Tag>{`${HD.IN_CLUSTER}: ${yesNo(row.present)}`}</Tag>
                      <Tag>{`${HD.ACTIVE}: ${yesNo(row.ready)}`}</Tag>
                      {row.failureAction && (
                        <Tag>{`${HD.MODE_IN_CLUSTER}: ${row.failureAction}`}</Tag>
                      )}
                    </div>
                    {auditsOnly(row, plan.mode) && (
                      <div
                        style={{
                          marginTop: SPACING.S6,
                          fontSize: FONT_SIZE.SM,
                          color: DEFAULT_COLORS.WARNING,
                        }}
                      >
                        {HD.AUDIT_ONLY(label ?? row.name)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {driftUnexpected.length > 0 && (
        <div
          style={{
            marginTop: SPACING.MD,
            fontSize: FONT_SIZE.SM,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        >
          <strong>{HD.UNEXPECTED}:</strong>{' '}
          {driftUnexpected
            .map((name) => {
              const label = policyLabel(name, plan.id, templates);
              return label ? `${label} (${name})` : name;
            })
            .join(', ')}
        </div>
      )}
    </div>
  );
};

export default HealthSection;
