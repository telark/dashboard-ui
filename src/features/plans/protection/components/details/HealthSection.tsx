import React, { useCallback, useEffect, useState } from 'react';
import { Button, Spin, Table, Tag, Empty } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../../constants';
import HealthBadge from '../shared/HealthBadge';
import { fetchPlanStatus } from '../../clients/protectionPlansClient';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import type {
  ProtectionPlan,
  PlanStatusResponse,
  PlanPolicyStatus,
  PlanHealthDetail,
} from '../../models';
import TimeAgo from '../../../../../components/display/time/TimeAgo';

interface HealthSectionProps {
  plan: ProtectionPlan;
  onPlanRefresh?: () => void;
}

const tableColumns = [
  {
    title: PPC.LABELS.HEALTH_DETAIL.POLICY_NAME,
    dataIndex: 'name',
    key: 'name',
    render: (value: string) => (
      <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{value}</span>
    ),
  },
  {
    title: PPC.LABELS.HEALTH_DETAIL.NAMESPACE,
    dataIndex: 'namespace',
    key: 'namespace',
  },
  {
    title: PPC.LABELS.HEALTH_DETAIL.PRESENT,
    dataIndex: 'present',
    key: 'present',
    render: (value: boolean) => <Tag color={value ? 'green' : 'red'}>{value ? 'Yes' : 'No'}</Tag>,
  },
  {
    title: PPC.LABELS.HEALTH_DETAIL.READY,
    dataIndex: 'ready',
    key: 'ready',
    render: (value: boolean) => <Tag color={value ? 'green' : 'red'}>{value ? 'Yes' : 'No'}</Tag>,
  },
  {
    title: PPC.LABELS.HEALTH_DETAIL.FAILURE_ACTION,
    dataIndex: 'failureAction',
    key: 'failureAction',
    render: (value: string) => value || '—',
  },
];

const HealthSection: React.FC<HealthSectionProps> = ({ plan, onPlanRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PlanStatusResponse | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleRefresh = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchPlanStatus(plan.id)
      .then((data) => {
        if (cancelled) return;
        setStatus(data);
        setError(null);
        onPlanRefresh?.();
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : PPC.LABELS.HEALTH_DETAIL.LOAD_ERROR;
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [plan.id, reloadKey, onPlanRefresh]);

  const rows: PlanPolicyStatus[] = status
    ? status.policies
    : (plan.healthDetail ?? []).map((d: PlanHealthDetail) => ({
        name: d.policyName,
        namespace: d.namespace,
        present: d.present,
        ready: d.ready,
        failureAction: d.failureAction,
      }));

  const checkedAt = plan.healthCheckedAt;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <HealthBadge health={status?.health ?? plan.health} />
          {checkedAt && (
            <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
              {PPC.LABELS.HEALTH_DETAIL.CHECKED_AT}: <TimeAgo date={checkedAt} />
            </span>
          )}
        </div>
        <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} size="small">
          {PPC.LABELS.HEALTH_DETAIL.REFRESH_BUTTON}
        </Button>
      </div>

      {error && <div style={{ color: DEFAULT_COLORS.ERROR, marginBottom: 8 }}>{error}</div>}

      {loading && rows.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
          <Spin />
        </div>
      ) : rows.length === 0 ? (
        <Empty description="No policy details available." />
      ) : (
        <Table
          rowKey={(row) => `${row.namespace}/${row.name}`}
          columns={tableColumns}
          dataSource={rows}
          pagination={false}
          size="small"
        />
      )}

      {status && (status.drift.missing.length > 0 || status.drift.unexpected.length > 0) && (
        <div style={{ marginTop: 12, fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED }}>
          {status.drift.missing.length > 0 && (
            <div>
              <strong>{PPC.LABELS.HEALTH_DETAIL.MISSING}:</strong> {status.drift.missing.join(', ')}
            </div>
          )}
          {status.drift.unexpected.length > 0 && (
            <div>
              <strong>{PPC.LABELS.HEALTH_DETAIL.UNEXPECTED}:</strong>{' '}
              {status.drift.unexpected.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthSection;
