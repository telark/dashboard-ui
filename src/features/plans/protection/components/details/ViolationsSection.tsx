import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Empty, Select, Spin, Table } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../constants';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  VIOLATION_RESULT_BADGE,
} from '../../constants/protectionPlans';
import { fetchPlanViolations } from '../../clients/protectionPlansClient';
import type { PlanViolation, PlanViolationsResponse, ViolationResult } from '../../models';
import TimeAgo from '../../../../../components/display/time/TimeAgo';

interface ViolationsSectionProps {
  planId: string;
}

const RESULT_FILTER_OPTIONS: Array<{ value: ViolationResult | 'all'; label: string }> = [
  { value: 'all', label: PPC.LABELS.VIOLATIONS.FILTER_ALL },
  { value: 'fail', label: PPC.LABELS.VIOLATION_RESULT_LABELS.fail },
  { value: 'pass', label: PPC.LABELS.VIOLATION_RESULT_LABELS.pass },
  { value: 'warn', label: PPC.LABELS.VIOLATION_RESULT_LABELS.warn },
  { value: 'error', label: PPC.LABELS.VIOLATION_RESULT_LABELS.error },
  { value: 'skip', label: PPC.LABELS.VIOLATION_RESULT_LABELS.skip },
];

const ViolationsSection: React.FC<ViolationsSectionProps> = ({ planId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PlanViolationsResponse | null>(null);
  const [resultFilter, setResultFilter] = useState<ViolationResult | 'all'>('all');
  const [reloadKey, setReloadKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

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

  const columns = useMemo(
    () => [
      {
        title: PPC.LABELS.VIOLATIONS.TABLE_RESOURCE,
        key: 'resource',
        render: (_: unknown, row: PlanViolation) => (
          <span>
            <strong>{row.resource.kind}</strong> {row.resource.name}
          </span>
        ),
      },
      {
        title: PPC.LABELS.VIOLATIONS.TABLE_NAMESPACE,
        dataIndex: 'namespace',
        key: 'namespace',
      },
      {
        title: PPC.LABELS.VIOLATIONS.TABLE_RULE,
        dataIndex: 'rule',
        key: 'rule',
      },
      {
        title: PPC.LABELS.VIOLATIONS.TABLE_RESULT,
        dataIndex: 'result',
        key: 'result',
        render: (value: ViolationResult) => {
          const badge = VIOLATION_RESULT_BADGE[value];
          const label = PPC.LABELS.VIOLATION_RESULT_LABELS[value];
          return (
            <span
              style={{
                background: badge.background,
                color: badge.color,
                padding: '2px 8px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {label}
            </span>
          );
        },
      },
      {
        title: PPC.LABELS.VIOLATIONS.TABLE_TIMESTAMP,
        dataIndex: 'timestamp',
        key: 'timestamp',
        render: (value: string) => (value ? <TimeAgo date={value} /> : '—'),
      },
      {
        title: PPC.LABELS.VIOLATIONS.TABLE_MESSAGE,
        dataIndex: 'message',
        key: 'message',
        ellipsis: true,
      },
    ],
    [],
  );

  const violations = data?.violations ?? [];

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
        <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} size="small">
          {PPC.LABELS.VIOLATIONS.REFRESH}
        </Button>
      </div>

      {error && <div style={{ color: DEFAULT_COLORS.ERROR, marginBottom: 8 }}>{error}</div>}

      {loading && violations.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : violations.length === 0 ? (
        <Empty description={PPC.LABELS.VIOLATIONS.EMPTY} />
      ) : (
        <Table
          rowKey={(row) =>
            `${row.namespace}/${row.resource.kind}/${row.resource.name}/${row.rule}/${row.timestamp}`
          }
          columns={columns}
          dataSource={violations}
          pagination={{ pageSize: 10 }}
          size="small"
        />
      )}
    </div>
  );
};

export default ViolationsSection;
