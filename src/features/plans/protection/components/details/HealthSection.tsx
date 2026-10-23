import React from 'react';
import { Empty, Tag } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import {
  DEFAULT_COLORS,
  MONOSPACE_CLASS,
  SECTION_LAYOUT,
  STATUS_DOT,
  TAG_CLASS,
  getPillColor,
  SPACING,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
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
const MODE_LABEL_OF: Record<string, string | undefined> = PPC.LABELS.MODE_LABELS;

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

// Pills only for what keeps a policy out of force, or for a mode other than the plan's.
const problemPills = (row: PlanPolicyStatus, mode: PlanMode): string[] => {
  if (!row.present) return [HD.PILL_NOT_IN_CLUSTER];
  const pills: string[] = row.ready ? [] : [HD.PILL_NOT_ACTIVE];
  if (auditsOnly(row, mode)) pills.push(HD.PILL_AUDIT_ONLY);
  else if (row.failureAction && !actsAs(row, mode)) {
    const inCluster = MODE_LABEL_OF[row.failureAction.toLowerCase()] ?? row.failureAction;
    pills.push(`${HD.MODE_IN_CLUSTER}: ${inCluster}`);
  }
  return pills;
};

const ENGINE_NAME_STYLE: React.CSSProperties = { overflowWrap: 'anywhere' };

// The operation it refuses, over the engine's policy name and namespace, then any problem.
const PolicyHealthRow: React.FC<{ row: PlanPolicyStatus; mode: PlanMode; label?: string }> = ({
  row,
  mode,
  label,
}) => {
  const pills = problemPills(row, mode);
  const dot = policyDotColor(row, mode);
  const engineName = (
    <span className={MONOSPACE_CLASS} style={ENGINE_NAME_STYLE}>
      {row.name}
    </span>
  );
  return (
    <div
      // 10: the row padding sits between SM and MD.
      style={{
        padding: '10px 0',
        borderBottom: SECTION_LAYOUT.SUBTLE_DIVIDER,
        display: 'flex',
        gap: SPACING.MD,
        alignItems: 'flex-start',
      }}
    >
      <div
        // 5: drops the dot to the middle of the first text line.
        style={{ ...STATUS_DOT, marginTop: 5, background: dot }}
      />
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          columnGap: SPACING.MD,
          rowGap: SPACING.S6,
        }}
      >
        <div style={{ display: 'grid', minWidth: 0 }}>
          <span
            style={{
              fontSize: FONT_SIZE.MD,
              fontWeight: FONT_WEIGHT.BOLD,
              color: DEFAULT_COLORS.TEXT_PRIMARY,
              overflowWrap: 'anywhere',
            }}
          >
            {label ?? engineName}
          </span>
          <span style={{ fontSize: FONT_SIZE.SM, color: DEFAULT_COLORS.TEXT_MUTED }}>
            {label && engineName}
            {label && row.namespace && PPC.LABELS.CARD.META_SEPARATOR}
            {row.namespace}
          </span>
        </div>
        {pills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SPACING.S6 }}>
            {pills.map((pill) => (
              <Tag key={pill} color={getPillColor(dot)} className={TAG_CLASS.AS_IS}>
                {pill}
              </Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
          {rows.map((row) => (
            <PolicyHealthRow
              key={`${row.namespace}/${row.name}`}
              row={row}
              mode={plan.mode}
              label={policyLabel(row.name, plan.id, templates)}
            />
          ))}
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
          {driftUnexpected.map((name, index) => {
            const label = policyLabel(name, plan.id, templates);
            const engineName = <span className={MONOSPACE_CLASS}>{name}</span>;
            return (
              <React.Fragment key={name}>
                {index > 0 && ', '}
                {label ? (
                  <>
                    {label} ({engineName})
                  </>
                ) : (
                  engineName
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HealthSection;
