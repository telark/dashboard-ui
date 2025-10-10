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
  const [expandedContainers, setExpandedContainers] = useState<{ [key: string]: boolean }>({});
  const pageSize = 5;

  const handlePageChange = (page: number) => setCurrentPage(page);


  const renderTime = (date?: string) => {
    if (!date) return <span style={{ color: '#9CA3AF' }}>—</span>;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return <span style={{ color: '#9CA3AF' }}>—</span>;
    return <TimeAgo date={date} />;
  };

  const getPullPolicyDescription = (policy?: string) => {
    if (!policy) return null;
    
    const policyMap: { [key: string]: string } = {
      'Always': 'Always pull',
      'IfNotPresent': 'Pull if needed',
      'Never': 'Local only'
    };
    
    return policyMap[policy] || policy;
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
    const instanceKey = resource.name;
    const isContainersExpanded = expandedContainers[instanceKey] || false;
    
    return (
      <div style={{ padding: '16px 0' }}>

        {/* Metrics Section */}
        <div style={{ 
          background: 'white',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          marginBottom: 16,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: '#f8fafc'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: '10px', 
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
                <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Resource Metrics
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
                  CPU & Memory Usage
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8
              }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: DEFAULT_COLORS.SUCCESS
                }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>CPU:</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  {resource.cpu || '0m'}
                </span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8
              }}>
                <div style={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  background: DEFAULT_COLORS.SUCCESS
                }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Memory:</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                  {resource.memory || '0Mi'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Containers Section */}
        <div style={{ 
          background: 'white',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '8px 16px',
            background: '#f8fafc',
            borderBottom: isContainersExpanded ? '1px solid #e2e8f0' : 'none'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 36, 
                height: 36, 
                borderRadius: '10px', 
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
                <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Containers
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
                  {resource.containers.length} container{resource.containers.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <Button 
              type="text" 
              icon={<DownOutlined style={{ 
                transform: isContainersExpanded ? 'rotate(180deg)' : 'rotate(0deg)', 
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
              }} />}
              onClick={() => setExpandedContainers(prev => ({ ...prev, [instanceKey]: !isContainersExpanded }))}
              style={{ 
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                background: DEFAULT_COLORS.SUCCESS,
                color: 'white',
                fontWeight: 600,
                padding: '8px 16px',
                height: 'auto',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isContainersExpanded ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isContainersExpanded ? '0 4px 12px rgba(32, 201, 151, 0.3)' : '0 2px 4px rgba(32, 201, 151, 0.1)'
              }}
            >
              {isContainersExpanded ? 'Hide Containers' : 'View Containers'}
            </Button>
          </div>

          {/* Expanded Containers */}
          <div style={{ 
            maxHeight: isContainersExpanded ? '500px' : '0',
            overflow: 'hidden',
            transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
            opacity: isContainersExpanded ? 1 : 0
          }}>
            <div style={{ 
              padding: '12px',
              background: '#f8fafc',
              transform: isContainersExpanded ? 'translateY(0)' : 'translateY(-10px)',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {resource.containers.map((container, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: 'white',
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      transform: isContainersExpanded ? 'translateY(0)' : 'translateY(-20px)',
                      opacity: isContainersExpanded ? 1 : 0,
                      transition: `transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s, opacity 0.3s ease ${index * 0.1}s`,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Left side - Container name with green dot */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        background: DEFAULT_COLORS.SUCCESS
                      }} />
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
                          {container.name}
                        </div>
                        {container.ports && container.ports.length > 0 && (
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                            {container.ports.length} port{container.ports.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Image details */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={{ 
                        fontSize: 11, 
                        color: '#64748b',
                        background: '#f1f5f9',
                        padding: '2px 6px',
                        borderRadius: 4
                      }}>
                        Image: {container.image?.name || 'No image specified'}
                      </span>
                      {container.image?.tag && (
                        <span style={{ 
                          fontSize: 11, 
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: 4
                        }}>
                          Tag: {container.image.tag}
                        </span>
                      )}
                      {container.image?.pullPolicy && (
                        <span style={{ 
                          fontSize: 10, 
                          padding: '2px 6px', 
                          background: '#f0f9ff', 
                          borderRadius: 4, 
                          color: '#0369a1',
                          fontWeight: 500,
                          border: '1px solid #bae6fd'
                        }}>
                          {getPullPolicyDescription(container.image.pullPolicy)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
