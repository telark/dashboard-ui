import React from 'react';
import { Empty } from 'antd';
import { DEFAULT_COLORS, MONOSPACE_CLASS } from '../../../../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../../../applications/constants/sectionLayout';
import RowTag from '../../../../../components/display/table/RowTag';
import { FancySpinner } from '../../../../../components/animation';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type {
  ProtectionPlan,
  PlanStatusResponse,
  PlanPolicyStatus,
  PlanHealthDetail,
} from '../../models';

interface HealthSectionProps {
  plan: ProtectionPlan;
  status: PlanStatusResponse | null;
  loading: boolean;
  error: string | null;
}

const policyDotColor = (row: PlanPolicyStatus): string => {
  if (!row.present) return DEFAULT_COLORS.DANGER;
  if (!row.ready) return DEFAULT_COLORS.WARNING;
  return DEFAULT_COLORS.SUCCESS;
};

const HealthSection: React.FC<HealthSectionProps> = ({ plan, status, loading, error }) => {
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
        <Empty description="No policy details available." />
      ) : (
        <div>
          {rows.map((row) => {
            const dot = policyDotColor(row);
            return (
              <div
                key={`${row.namespace}/${row.name}`}
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
                        className={MONOSPACE_CLASS}
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
                        <RowTag
                          text={row.namespace}
                          capitalize={false}
                          {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                        />
                      )}
                      <RowTag
                        text={`${PPC.LABELS.HEALTH_DETAIL.PRESENT}: ${row.present ? 'yes' : 'no'}`}
                        fontSize={11}
                      />
                      <RowTag
                        text={`${PPC.LABELS.HEALTH_DETAIL.READY}: ${row.ready ? 'yes' : 'no'}`}
                        fontSize={11}
                      />
                      {row.failureAction && (
                        <RowTag
                          text={`${PPC.LABELS.HEALTH_DETAIL.FAILURE_ACTION}: ${row.failureAction}`}
                          {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                        />
                      )}
                    </div>
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
