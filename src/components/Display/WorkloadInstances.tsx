import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  SyncOutlined,
  ContainerOutlined,
  DownOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Pagination, Tag, Collapse, Button, Space } from 'antd';
import { Workload } from '../../interfaces/workload';
import TimeAgo from '../time/TimeAgo';
import { DEFAULT_COLORS } from '../../constants';

interface WorkloadInstancesProps {
  workload: Workload;
}

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

const WorkloadInstances: React.FC<WorkloadInstancesProps> = ({ workload }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedMetrics, setExpandedMetrics] = useState(false);
  const [expandedContainers, setExpandedContainers] = useState(false);
  const pageSize = 5;

  const handlePageChange = (page: number) => setCurrentPage(page);


  const renderTime = (date?: string) => {
    if (!date) return <span style={{ color: '#9CA3AF' }}>—</span>;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return <span style={{ color: '#9CA3AF' }}>—</span>;
    return <TimeAgo date={date} />;
  };

  // Create instances data from workload
  const instances = workload.cacid?.usage?.resources?.usagePerInstance || [];
  const containers = workload.cacid?.crates?.regular || [];

  // Define resource types - using any for now to avoid TypeScript issues
  type ContainerInfo = any;

  type InstanceResource = {
    name: string;
    type: 'Instance';
    status: string;
    lastSync?: string;
    cpu?: string;
    memory?: string;
    containers: ContainerInfo[];
  };

  // Create instances with their containers
  const resources: InstanceResource[] = instances.map((instance, index) => ({
    name: instance.name || `Instance ${index + 1}`,
    type: 'Instance',
    status: 'Running',
    lastSync: workload.cacid?.usage?.timestamp,
    cpu: instance.totalCpu,
    memory: instance.totalMemory,
    containers: containers, // Use the full containers data instead of instance.containers
  }));

  // If no instances, create a single instance with all containers
  if (resources.length === 0 && containers.length > 0) {
    resources.push({
      name: 'Main Instance',
      type: 'Instance',
      status: 'Running',
      lastSync: workload.cacid?.usage?.timestamp,
      cpu: workload.cacid?.usage?.resources?.totalCpu,
      memory: workload.cacid?.usage?.resources?.totalMemory,
      containers: containers,
    });
  }

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
          No Instances Found
        </div>
        <div style={{ color: '#5B6B7C', marginBottom: 16, maxWidth: 520, lineHeight: 1.6 }}>
          This workload doesn't have any instances or containers yet.
        </div>
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

  const headerNode = (resource: InstanceResource) => (
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
      </div>
    </div>
  );

  const detailNode = (resource: InstanceResource) => {
    return (
      <div style={{ paddingTop: 4 }}>
        {/* Basic Info Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              background: DEFAULT_COLORS.SUCCESS,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14
            }}>
              <ClockCircleOutlined />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Last Sync
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                {renderTime(resource.lastSync)}
              </div>
            </div>
          </div>
        </div>

        {/* Status Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              background: DEFAULT_COLORS.SUCCESS,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14
            }}>
              <SyncOutlined />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Status
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                {statusTag(resource.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Expandable Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              background: DEFAULT_COLORS.SUCCESS,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14
            }}>
              <DashboardOutlined />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Resource Metrics
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                CPU & Memory Usage
              </div>
            </div>
          </div>
          <Button 
            type="text" 
            icon={<DownOutlined style={{ transform: expandedMetrics ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
            onClick={() => setExpandedMetrics(!expandedMetrics)}
            style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: DEFAULT_COLORS.SUCCESS,
              color: 'white',
              fontWeight: 600
            }}
          >
            View Metrics
          </Button>
        </div>

        {/* Expanded Metrics */}
        {expandedMetrics && (
          <div style={{ 
            marginTop: 8, 
            padding: '12px 16px', 
            background: '#f8f9fa', 
            borderRadius: 8,
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ 
                padding: 12,
                background: 'white',
                borderRadius: 6,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: DEFAULT_COLORS.SUCCESS
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>CPU Usage</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                  {resource.cpu || '0m'}
                </div>
              </div>
              
              <div style={{ 
                padding: 12,
                background: 'white',
                borderRadius: 6,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: DEFAULT_COLORS.SUCCESS
                  }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Memory Usage</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
                  {resource.memory || '0Mi'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Containers Expandable Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '12px 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '8px', 
              background: DEFAULT_COLORS.SUCCESS,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14
            }}>
              <ContainerOutlined />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Containers
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>
                {resource.containers.length} container{resource.containers.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <Button 
            type="text" 
            icon={<DownOutlined style={{ transform: expandedContainers ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
            onClick={() => setExpandedContainers(!expandedContainers)}
            style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: DEFAULT_COLORS.SUCCESS,
              color: 'white',
              fontWeight: 600
            }}
          >
            View Containers
          </Button>
        </div>

        {/* Expanded Containers */}
        {expandedContainers && (
          <div style={{ 
            marginTop: 8, 
            padding: '12px 16px', 
            background: '#f8f9fa', 
            borderRadius: 8,
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {resource.containers.map((container, index) => (
                <div key={index} style={{ 
                  padding: 12,
                  background: 'white',
                  borderRadius: 6,
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      background: DEFAULT_COLORS.SUCCESS
                    }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{container.name}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                    {container.image?.name ? `${container.image.name}:${container.image.tag || 'latest'}` : 'No image specified'}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    {container.order !== undefined && (
                      <span style={{ 
                        fontSize: 11, 
                        padding: '2px 6px', 
                        background: '#f3f4f6', 
                        borderRadius: 4, 
                        color: '#6b7280',
                        fontWeight: 600
                      }}>
                        Order: {container.order}
                      </span>
                    )}
                    {container.subType && (
                      <span style={{ 
                        fontSize: 11, 
                        padding: '2px 6px', 
                        background: '#f3f4f6', 
                        borderRadius: 4, 
                        color: '#6b7280',
                        fontWeight: 600
                      }}>
                        {container.subType}
                      </span>
                    )}
                    {container.image?.pullPolicy && (
                      <span style={{ 
                        fontSize: 11, 
                        padding: '2px 6px', 
                        background: '#f3f4f6', 
                        borderRadius: 4, 
                        color: '#6b7280',
                        fontWeight: 600
                      }}>
                        {container.image.pullPolicy}
                      </span>
                    )}
                  </div>
                  {container.ports && container.ports.length > 0 && (
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {container.ports.length} port{container.ports.length !== 1 ? 's' : ''} configured
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

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
};

export default WorkloadInstances;
