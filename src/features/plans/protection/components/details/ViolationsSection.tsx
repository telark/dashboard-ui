import React, { useEffect, useState } from 'react';
import { Button, Empty, Select, Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { DEFAULT_COLORS } from '../../../../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../../../resources/applications/constants/sectionLayout';
import RowTag from '../../../../../components/display/table/RowTag';
import { FancySpinner } from '../../../../../components/animation';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  VIOLATION_RESULT_BADGE,
  VIOLATION_RESULT_DOT,
} from '../../constants/protectionPlans';
import { fetchPlanViolations } from '../../clients/protectionPlansClient';
import type { PlanViolation, PlanViolationsResponse, ViolationResult } from '../../models';
import TimeAgo from '../../../../../components/display/time/TimeAgo';

interface ViolationsSectionProps {
  planId: string;
}

const COMPACT_REFRESH_BUTTON_STYLE: React.CSSProperties = {
  color: DEFAULT_COLORS.ICON_SECONDARY,
  flexShrink: 0,
  width: 30,
  height: 30,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
  background: 'transparent',
  transition: 'background 120ms ease, color 120ms ease',
};

const RESULT_FILTER_OPTIONS: Array<{ value: ViolationResult | 'all'; label: string }> = [
  { value: 'all', label: PPC.LABELS.VIOLATIONS.FILTER_ALL },
  { value: 'fail', label: PPC.LABELS.VIOLATION_RESULT_LABELS.fail },
  { value: 'pass', label: PPC.LABELS.VIOLATION_RESULT_LABELS.pass },
  { value: 'warn', label: PPC.LABELS.VIOLATION_RESULT_LABELS.warn },
  { value: 'error', label: PPC.LABELS.VIOLATION_RESULT_LABELS.error },
  { value: 'skip', label: PPC.LABELS.VIOLATION_RESULT_LABELS.skip },
];

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
    const dayKey = format(new Date(v.timestamp), 'yyyy-MM-dd');
    const last = groups[groups.length - 1];
    if (!last || last.dayKey !== dayKey) {
      groups.push({ dayKey, entries: [v] });
    } else {
      last.entries.push(v);
    }
  }
  return groups;
};

const ViolationsSection: React.FC<ViolationsSectionProps> = ({ planId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PlanViolationsResponse | null>(null);
  const [resultFilter, setResultFilter] = useState<ViolationResult | 'all'>('all');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPlanViolations(planId, {
      result: resultFilter === 'all' ? undefined : resultFilter,
    })
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : PPC.LABELS.VIOLATIONS.LOAD_ERROR;
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [planId, resultFilter, reloadKey]);

  const violations = data?.violations ?? [];
  const grouped = groupByDay(violations);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          gap: 12,
        }}
      >
        <Select
          value={resultFilter}
          onChange={(v) => setResultFilter(v)}
          options={RESULT_FILTER_OPTIONS}
          size="small"
          style={{ width: 160 }}
          placeholder={PPC.LABELS.VIOLATIONS.FILTER_PLACEHOLDER}
        />
        <Tooltip title={PPC.LABELS.VIOLATIONS.REFRESH}>
          <Button
            type="text"
            shape="circle"
            size="small"
            icon={<ReloadOutlined />}
            onClick={() => setReloadKey((k) => k + 1)}
            style={COMPACT_REFRESH_BUTTON_STYLE}
            aria-label={PPC.LABELS.VIOLATIONS.REFRESH}
          />
        </Tooltip>
      </div>

      {error && <div style={{ color: DEFAULT_COLORS.ERROR, marginBottom: 8 }}>{error}</div>}

      {loading && violations.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <FancySpinner showLabel={false} size={24} />
        </div>
      ) : violations.length === 0 ? (
        <Empty description={PPC.LABELS.VIOLATIONS.EMPTY} />
      ) : (
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
                {group.dayKey === 'unknown'
                  ? '—'
                  : format(new Date(`${group.dayKey}T12:00:00`), 'MMMM d, yyyy')}
              </div>
              {group.entries.map((entry, idx) => {
                const badge = VIOLATION_RESULT_BADGE[entry.result];
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
                            background={badge.background}
                            color={badge.color}
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
                              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                            />
                          )}
                          {entry.namespace && (
                            <RowTag
                              text={`${PPC.LABELS.VIOLATIONS.TABLE_NAMESPACE}: ${entry.namespace}`}
                              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
                            />
                          )}
                          {entry.rule && (
                            <RowTag
                              text={`${PPC.LABELS.VIOLATIONS.TABLE_RULE}: ${entry.rule}`}
                              background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                              color={DEFAULT_COLORS.TEXT_SECONDARY}
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
        </div>
      )}
    </div>
  );
};

export default ViolationsSection;
