import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  FileOutlined,
  SyncOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Pagination, Space, Tag, Collapse } from 'antd';
import { ResourcesInterface } from '../../../interfaces/common';
import TimeAgo from '../../time/TimeAgo';
import { DEFAULT_COLORS } from '../../../constants';
import { UI } from '../../../constants/ui';

const Label: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ color: DEFAULT_COLORS.SUCCESS, fontSize: 16, display: 'inline-flex' }}>
      {icon}
    </span>
    <span
      style={{
        color: '#6b7280',
        fontWeight: 700,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
      }}
    >
      {text}
    </span>
  </div>
);

const Row: React.FC<{ left: React.ReactNode; right: React.ReactNode; withDivider?: boolean }> = ({
  left,
  right,
  withDivider = true,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: withDivider ? '1px solid #eef2f6' : 'none',
      minHeight: 40,
    }}
  >
    <div>{left}</div>
    <div style={{ color: '#111827', fontWeight: 600 }}>{right}</div>
  </div>
);

const Resources: React.FC<ResourcesInterface> = React.memo(({ name, resources }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleView = (resourceName: string) =>
    navigate(`/groupers/${name}/details/${resourceName}`);
  const handleSync = (resourceName: string) => void resourceName; // future
  const handleDelete = (resourceName: string) => void resourceName; // future

  const handleRefresh = () => window.location.reload();

  const renderTime = (date?: string) => {
    if (!date) return <span style={{ color: '#9CA3AF' }}>—</span>;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return <span style={{ color: '#9CA3AF' }}>—</span>;
    return <TimeAgo date={date} />;
  };

  if (!resources || resources.length === 0) {
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
          <AppstoreOutlined />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#0B1F33', marginBottom: 6 }}>
          {UI.RESOURCES.EMPTY_TITLE}
        </div>
        <div style={{ color: '#5B6B7C', marginBottom: 16, maxWidth: 520, lineHeight: 1.6 }}>
          {UI.RESOURCES.EMPTY_DESC}
        </div>
        <Button type="primary" icon={<SyncOutlined />} onClick={handleRefresh}>
          {UI.RESOURCES.REFRESH}
        </Button>
      </div>
    );
  }

  const paginatedResources = resources.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const showPagination = resources.length > pageSize;

  const statusTag = (value: string) => {
    const isOk = /active|ready|running|available/i.test(value);
    const baseStyle: React.CSSProperties = {
      borderRadius: 999,
      padding: '2px 10px',
      fontWeight: 700,
      margin: 0,
    };
    if (isOk) {
      return (
        <Tag
          style={{
            ...baseStyle,
            border: `1px solid ${DEFAULT_COLORS.SUCCESS}`,
            color: DEFAULT_COLORS.SUCCESS,
            background: 'rgba(32,201,151,0.08)',
          }}
        >
          {value}
        </Tag>
      );
    }
    return (
      <Tag
        style={{
          ...baseStyle,
          border: '1px solid #e5e7eb',
          color: '#374151',
          background: '#F9FAFB',
        }}
      >
        {value}
      </Tag>
    );
  };

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

  const headerNode = (resource: (typeof resources)[number]) => (
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
          <AppstoreOutlined />
        </span>
        <span style={{ fontWeight: 700, color: '#0B1F33' }}>{resource.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {kindPill(resource.type)}
        {statusTag(resource.status)}
        {/* Last Sync intentionally hidden in header; shown only in expanded details */}
      </div>
    </div>
  );

  const detailNode = (resource: (typeof resources)[number]) => (
    <div style={{ paddingTop: 4 }}>
      <Row
        left={<Label icon={<ClockCircleOutlined />} text={UI.RESOURCES.LABELS.LAST_SYNC} />}
        right={renderTime(resource.lastSync)}
        withDivider={false}
      />
      <Row
        left={<Label icon={<FileOutlined />} text={UI.RESOURCES.LABELS.KIND} />}
        right={<span>{kindPill(resource.type)}</span>}
        withDivider={false}
      />
      <Row
        left={<Label icon={<SyncOutlined />} text={UI.RESOURCES.LABELS.STATUS} />}
        right={statusTag(resource.status)}
        withDivider={false}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(resource.name)}
            size="small"
            type="default"
          />
          <Button
            icon={<SyncOutlined />}
            onClick={() => handleSync(resource.name)}
            size="small"
            type="primary"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(resource.name)}
            size="small"
            danger
          />
        </Space>
      </div>
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {paginatedResources.map((resource, index) => (
          <Collapse
            key={index}
            items={[{ key: 'panel', label: headerNode(resource), children: detailNode(resource) }]}
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
            total={resources.length}
            onChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
});

export default Resources;
