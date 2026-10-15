import React, { useEffect } from 'react';
import { Empty, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_COLORS, SECTION_LAYOUT, TAG_CLASS } from '../../../../../constants';
import { FancySpinner } from '../../../../../components/animation';
import {
  POLICY_CHIP_LABEL,
  POLICY_NAME_PREFIX,
  PROTECTION_PLANS_CONSTANTS as PPC,
} from '../../constants/protectionPlans';
import type { AppDispatch } from '../../../../../store';
import { fetchProtectionPlanTemplatesThunk, selectProtectionPlanTemplates } from '../../store';
import type {
  ProtectionPlan,
  PlanMode,
  PlanStatusResponse,
  PlanPolicyStatus,
  PlanHealthDetail,
  PlanTemplate,
} from '../../models';

interface HealthSectionProps {
  plan: ProtectionPlan;
  status: PlanStatusResponse | null;
  loading: boolean;
  error: string | null;
}

// The engine reports `Audit`/`Enforce`, the plan `audit`/`enforce`.
const actsAs = (row: PlanPolicyStatus, mode: PlanMode): boolean =>
  row.failureAction.toLowerCase() === mode;

const policyDotColor = (row: PlanPolicyStatus, mode: PlanMode): string => {
  if (!row.present) return DEFAULT_COLORS.DANGER;
  if (!row.ready || !actsAs(row, mode)) return DEFAULT_COLORS.WARNING;
  return DEFAULT_COLORS.SUCCESS;
};

// The operation label when the policy name maps to one of the plan's templates, else the raw name.
const policyLabel = (name: string, planId: string, templates: PlanTemplate[]): string => {
  const template = templates.find((t) => name.startsWith(POLICY_NAME_PREFIX(planId, t.code)));
  return (template && POLICY_CHIP_LABEL[template.id]) ?? name;
};

const yesNo = (value: boolean): string =>
  value ? PPC.LABELS.HEALTH_DETAIL.YES : PPC.LABELS.HEALTH_DETAIL.NO;

const HealthSection: React.FC<HealthSectionProps> = ({ plan, status, loading, error }) => {
  const dispatch: AppDispatch = useDispatch();
  const templates = useSelector(selectProtectionPlanTemplates);
  // Template codes map policy names to operation labels; only the plan forms load them otherwise.
  useEffect(() => {
    if (templates.length === 0) void dispatch(fetchProtectionPlanTemplatesThunk());
  }, [templates.length, dispatch]);

  const rows: PlanPolicyStatus[] = status
    ? (status.policies ?? [])
    : (plan.healthDetail ?? []).map((d: PlanHealthDetail) => ({
        name: d.policyName,
        namespace: d.namespace,
        present: d.present,
        ready: d.ready,
        failureAction: d.failureAction,
      }));

  const driftMissing = status?.drift?.missing ?? [];
  const driftUnexpected = status?.drift?.unexpected ?? [];

  return (
    <div>
      {error && <div style={{ color: DEFAULT_COLORS.DANGER, marginBottom: 8 }}>{error}</div>}

      {loading && rows.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <FancySpinner showLabel={false} size={24} />
        </div>
      ) : rows.length === 0 ? (
        <Empty description={PPC.LABELS.HEALTH_DETAIL.EMPTY} />
      ) : (
        <div>
          {rows.map((row) => {
            const dot = policyDotColor(row, plan.mode);
            const auditsOnly = plan.mode === 'enforce' && row.present && actsAs(row, 'audit');
            return (
              <div
                key={`${row.namespace}/${row.name}`}
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
                      background: dot,
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
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: DEFAULT_COLORS.TEXT_PRIMARY,
                          wordBreak: 'break-all',
                        }}
                      >
                        {row.name}
                      </span>
                      {row.namespace && (
                        <Tag className={TAG_CLASS.AS_IS}>
                          {`${PPC.LABELS.HEALTH_DETAIL.NAMESPACE}: ${row.namespace}`}
                        </Tag>
                      )}
                      <Tag>{`${PPC.LABELS.HEALTH_DETAIL.PRESENT}: ${yesNo(row.present)}`}</Tag>
                      <Tag>{`${PPC.LABELS.HEALTH_DETAIL.READY}: ${yesNo(row.ready)}`}</Tag>
                      {row.failureAction && (
                        <Tag>
                          {`${PPC.LABELS.HEALTH_DETAIL.FAILURE_ACTION}: ${row.failureAction}`}
                        </Tag>
                      )}
                    </div>
                    {auditsOnly && (
                      <div style={{ marginTop: 6, fontSize: 12, color: DEFAULT_COLORS.WARNING }}>
                        {PPC.LABELS.HEALTH_DETAIL.AUDIT_ONLY(
                          policyLabel(row.name, plan.id, templates),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {(driftMissing.length > 0 || driftUnexpected.length > 0) && (
        <div style={{ marginTop: 12, fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {driftMissing.length > 0 && (
            <div>
              <strong>{PPC.LABELS.HEALTH_DETAIL.MISSING}:</strong> {driftMissing.join(', ')}
            </div>
          )}
          {driftUnexpected.length > 0 && (
            <div>
              <strong>{PPC.LABELS.HEALTH_DETAIL.UNEXPECTED}:</strong> {driftUnexpected.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthSection;
