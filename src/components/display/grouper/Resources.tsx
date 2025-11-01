import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { AiOutlineApi } from 'react-icons/ai';
import { Button, Pagination, Space, Checkbox } from 'antd';
import { ResourcesInterface } from '../../../interfaces/shared';
import TimeAgo from '../../time/TimeAgo';
import { DEFAULT_COLORS, BUTTON_CONFIGS } from '../../../constants';
import { UI } from '../../../constants/ui';
import { ParseGoTimeDate } from '../../../utils/shared/time';

const Resources: React.FC<ResourcesInterface> = React.memo(function Resources({ name, resources }) {
  const navigate = useNavigate();
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Clear selection when changing pages
    setSelectedResources(new Set());
  };

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const paginatedResources = resources.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize,
        );
        setSelectedResources(new Set(paginatedResources.map((r) => r.name)));
      } else {
        setSelectedResources(new Set());
      }
    },
    [resources, currentPage, pageSize],
  );

  const handleSelectResource = useCallback((resourceName: string, checked: boolean) => {
    setSelectedResources((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(resourceName);
      } else {
        next.delete(resourceName);
      }
      return next;
    });
  }, []);

  const paginatedResources = useMemo(
    () => resources.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [resources, currentPage, pageSize],
  );

  const allPageResourcesSelected = useMemo(
    () =>
      paginatedResources.length > 0 &&
      paginatedResources.every((r) => selectedResources.has(r.name)),
    [paginatedResources, selectedResources],
  );

  const somePageResourcesSelected = useMemo(
    () => paginatedResources.some((r) => selectedResources.has(r.name)),
    [paginatedResources, selectedResources],
  );

  const selectedCount = selectedResources.size;
  const hasSelection = selectedCount > 0;

  const handleView = useCallback(
    (resourceName?: string) => {
      if (resourceName) {
        navigate(`/groupers/${name}/details/${resourceName}`);
      } else if (selectedCount === 1) {
        const firstSelected = Array.from(selectedResources)[0];
        navigate(`/groupers/${name}/details/${firstSelected}`);
      }
    },
    [navigate, name, selectedResources, selectedCount],
  );

  const handleSync = useCallback(
    (resourceName?: string) => {
      const targets = resourceName ? [resourceName] : Array.from(selectedResources);
      // TODO: implement sync for multiple resources
      console.log('Sync resources:', targets);
    },
    [selectedResources],
  );

  const handleDelete = useCallback(
    (resourceName?: string) => {
      const targets = resourceName ? [resourceName] : Array.from(selectedResources);
      // TODO: implement delete for multiple resources
      console.log('Delete resources:', targets);
    },
    [selectedResources],
  );

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

  const statusTag = (value: string) => {
    const isActive = /active|ready|running|available/i.test(value);
    const statusColor = isActive ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DEFAULT;

    return (
      <Button
        type="default"
        style={{
          color: statusColor,
          borderColor: statusColor,
          borderRadius: BUTTON_CONFIGS.STATUS_BUTTON.BORDER_RADIUS,
          padding: BUTTON_CONFIGS.STATUS_BUTTON.PADDING,
          fontSize: BUTTON_CONFIGS.STATUS_BUTTON.FONT_SIZE,
          height: BUTTON_CONFIGS.STATUS_BUTTON.HEIGHT,
          lineHeight: BUTTON_CONFIGS.STATUS_BUTTON.LINE_HEIGHT,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: BUTTON_CONFIGS.STATUS_BUTTON.GAP,
        }}
      >
        <span style={{ display: 'inline-block' }}>{value}</span>
      </Button>
    );
  };

  const typeTag = (type: string) => (
    <Button
      type="default"
      style={{
        color: '#111827',
        borderColor: '#e5e7eb',
        borderRadius: BUTTON_CONFIGS.STATUS_BUTTON.BORDER_RADIUS,
        padding: BUTTON_CONFIGS.STATUS_BUTTON.PADDING,
        fontSize: BUTTON_CONFIGS.STATUS_BUTTON.FONT_SIZE,
        height: BUTTON_CONFIGS.STATUS_BUTTON.HEIGHT,
        lineHeight: BUTTON_CONFIGS.STATUS_BUTTON.LINE_HEIGHT,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: BUTTON_CONFIGS.STATUS_BUTTON.GAP,
        background: '#F9FAFB',
      }}
    >
      <span style={{ display: 'inline-block' }}>{type}</span>
    </Button>
  );

  const showPagination = resources.length > pageSize;

  return (
    <>
      {/* Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: '1px solid #eef2f6',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Checkbox
            indeterminate={somePageResourcesSelected && !allPageResourcesSelected}
            checked={allPageResourcesSelected}
            onChange={(e) => handleSelectAll(e.target.checked)}
          >
            {hasSelection && (
              <span style={{ color: '#5B6B7C', fontSize: 14 }}>{selectedCount} selected</span>
            )}
          </Checkbox>
        </div>

        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView()}
            disabled={!hasSelection || selectedCount > 1}
            size="small"
          >
            View
          </Button>
          <Button
            icon={<SyncOutlined />}
            onClick={() => handleSync()}
            disabled={!hasSelection}
            size="small"
            type="primary"
          >
            Sync
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete()}
            disabled={!hasSelection}
            size="small"
            danger
          >
            Delete
          </Button>
        </Space>
      </div>

      {/* Resources List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {paginatedResources.map((resource) => {
          const isSelected = selectedResources.has(resource.name);
          const isBridge = (resource as { isBridge?: boolean }).isBridge || false;
          return (
            <div
              key={resource.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                border: '1px solid #eef2f6',
                borderRadius: 12,
                background: isSelected ? 'rgba(32,201,151,0.04)' : '#fff',
                transition: 'all 0.2s',
                gap: 16,
              }}
            >
              <Checkbox
                checked={isSelected}
                onChange={(e) => handleSelectResource(resource.name, e.target.checked)}
              />

              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(32,201,151,0.12)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: DEFAULT_COLORS.SUCCESS,
                  flexShrink: 0,
                }}
              >
                {isBridge ? (
                  <AiOutlineApi style={{ fontSize: 16 }} />
                ) : (
                  <AppstoreOutlined style={{ fontSize: 16 }} />
                )}
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    color: '#0B1F33',
                    fontSize: 14,
                    minWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {resource.name}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      color: '#5B6B7C',
                      fontSize: 12,
                      minWidth: 120,
                    }}
                  >
                    <SyncOutlined/>
                    <TimeAgo date={ParseGoTimeDate(resource.lastSync)} />
                  </div>

                  {typeTag(resource.type)}

                  {statusTag(resource.status)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showPagination && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
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

Resources.displayName = 'Resources';

export default Resources;
