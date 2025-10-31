import React, { useState } from 'react';
import {
  AppstoreOutlined,
  FileOutlined,
  SyncOutlined,
  DeploymentUnitOutlined,
} from '@ant-design/icons';
import { Button, Pagination, Tag, Collapse } from 'antd';
import { DEFAULT_COLORS } from '../../../constants';
import { UI } from '../../../constants/ui';
import { Label, Row } from '../../../components/shared';

interface BridgeResourcesProps {
  name: string;
  workloads: Array<{
    name: string;
    type: string;
    isSameGrouper?: boolean;
    matchedLabels?: Array<{ key: string; value: string }>;
  }>;
}

const BridgeResources: React.FC<BridgeResourcesProps> = React.memo(function BridgeResources({
  workloads,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleRefresh = () => window.location.reload();

  if (!workloads || workloads.length === 0) {
    return (
      <div
        style={{
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(32,201,151,0.12)',
            boxShadow: 'inset 0 0 0 2px rgba(32,201,151,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            color: DEFAULT_COLORS.SUCCESS,
            fontSize: 24,
          }}
        >
          <DeploymentUnitOutlined />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0B1F33', marginBottom: 6 }}>
          {UI.RESOURCES.EMPTY_TITLE}
        </div>
        <div style={{ color: '#5B6B7C', marginBottom: 16, maxWidth: 520, lineHeight: 1.6 }}>
          This bridge currently has no workloads attached. Once workloads are connected, they'll be
          listed here.
        </div>
        <Button type="primary" icon={<SyncOutlined />} onClick={handleRefresh}>
          {UI.RESOURCES.REFRESH}
        </Button>
      </div>
    );
  }

  const paginatedWorkloads = workloads.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const showPagination = workloads.length > pageSize;

  const kindPill = (kind: string) => (
    <span
      style={{
        border: '1px solid #e5e7eb',
        color: '#111827',
        background: '#F9FAFB',
        borderRadius: 999,
        padding: '2px 10px',
        fontWeight: 700,
      }}
    >
      {kind}
    </span>
  );

  const headerNode = (workload: (typeof workloads)[number]) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(32,201,151,0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: DEFAULT_COLORS.SUCCESS,
          }}
        >
          <DeploymentUnitOutlined />
        </span>
        <span style={{ fontWeight: 700, color: '#0B1F33' }}>{workload.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {kindPill(workload.type)}
        {workload.isSameGrouper && (
          <Tag style={{ borderRadius: 999, padding: '2px 10px', fontWeight: 700, margin: 0 }}>
            Same Grouper
          </Tag>
        )}
      </div>
    </div>
  );

  const detailNode = (workload: (typeof workloads)[number]) => (
    <div style={{ paddingTop: 4 }}>
      <Row
        left={<Label icon={<FileOutlined />} text={UI.RESOURCES.LABELS.KIND} />}
        right={<span>{kindPill(workload.type)}</span>}
        withDivider={false}
      />
      {workload.matchedLabels && workload.matchedLabels.length > 0 && (
        <Row
          left={<Label icon={<AppstoreOutlined />} text="Matched Labels" />}
          right={
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {workload.matchedLabels.map((label, idx) => (
                <Tag key={idx} style={{ margin: 0 }}>
                  {label.key}={label.value}
                </Tag>
              ))}
            </div>
          }
          withDivider={false}
        />
      )}
      <Row
        left={<Label icon={<SyncOutlined />} text="Same Grouper" />}
        right={<span>{workload.isSameGrouper ? 'Yes' : 'No'}</span>}
        withDivider={false}
      />
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {paginatedWorkloads.map((workload, index) => (
          <Collapse
            key={index}
            items={[{ key: 'panel', label: headerNode(workload), children: detailNode(workload) }]}
            expandIconPosition="end"
            style={{ border: '1px solid #eef2f6', borderRadius: 12, background: '#fff' }}
          />
        ))}
      </div>

      {showPagination && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={workloads.length}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
});

export default BridgeResources;
