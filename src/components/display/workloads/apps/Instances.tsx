import React, { useState, useMemo, useCallback } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DownOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Pagination, Tag, Collapse, Button } from 'antd';
import { AppWorkload } from '../../../../interfaces/workload';
import { DEFAULT_COLORS } from '../../../../constants';
import { COMPONENT_STYLES, COMPONENT_CONSTANTS } from '../../../../constants/ui';

interface WorkloadInstancesProps {
  workload: AppWorkload;
}

// Use styles from constants for better organization
const STYLES = COMPONENT_STYLES.WORKLOAD_INSTANCES;


const WorkloadInstances: React.FC<WorkloadInstancesProps> = ({ workload }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedContainers, setExpandedContainers] = useState<{ [key: string]: boolean }>({});
  const pageSize = 5;

  const handlePageChange = useCallback((page: number) => setCurrentPage(page), []);


  const getPullPolicyDescription = useCallback((policy?: string) => {
    if (!policy) return null;

    const policyMap = COMPONENT_CONSTANTS.WORKLOAD_INSTANCES.PULL_POLICY_MAP;
    return policyMap[policy as keyof typeof policyMap] || policy;
  }, []);

  // Memoize expensive data processing
  const { instances, containers } = useMemo(
    () => ({
      instances: workload.cacid?.usage?.resources?.usagePerInstance || [],
      containers: workload.cacid?.crates?.regular || [],
    }),
    [workload.cacid?.usage?.resources?.usagePerInstance, workload.cacid?.crates?.regular],
  );

  // Define resource types - using any for now to avoid TypeScript issues
  type ContainerInfo = any;

  type InstanceResource = {
    name: string;
    type: typeof COMPONENT_CONSTANTS.WORKLOAD_INSTANCES.INSTANCE_TYPE;
    status: string;
    lastSync?: string;
    cpu?: string;
    memory?: string;
    containers: ContainerInfo[];
  };

  // Memoize resources creation
  const resources: InstanceResource[] = useMemo(() => {
    const timestamp = workload.cacid?.usage?.timestamp;
    const totalCpu = workload.cacid?.usage?.resources?.totalCpu;
    const totalMemory = workload.cacid?.usage?.resources?.totalMemory;
    const workloadStatus = workload.cacid?.status || 'Unknown';

    const mappedResources = instances.map((instance, index) => ({
      name: instance.name || `Instance ${index + 1}`,
      type: COMPONENT_CONSTANTS.WORKLOAD_INSTANCES.INSTANCE_TYPE,
      status: workloadStatus, // Use workload status since instances don't have individual status
      lastSync: timestamp,
      cpu: instance.totalCpu,
      memory: instance.totalMemory,
      containers: containers,
    }));

    // If no instances, create a single instance with all containers
    if (mappedResources.length === 0 && containers.length > 0) {
      mappedResources.push({
        name: 'Main Instance',
        type: COMPONENT_CONSTANTS.WORKLOAD_INSTANCES.INSTANCE_TYPE,
        status: workloadStatus, // Use actual workload status
        lastSync: timestamp,
        cpu: totalCpu,
        memory: totalMemory,
        containers: containers,
      });
    }

    return mappedResources;
  }, [
    instances,
    containers,
    workload.cacid?.usage?.timestamp,
    workload.cacid?.usage?.resources?.totalCpu,
    workload.cacid?.usage?.resources?.totalMemory,
    workload.cacid?.status,
  ]);

  // Memoize pagination calculations
  const { paginatedResources, showPagination } = useMemo(
    () => ({
      paginatedResources: resources.slice((currentPage - 1) * pageSize, currentPage * pageSize),
      showPagination: resources.length > pageSize,
    }),
    [resources, currentPage, pageSize],
  );

  const statusTag = useCallback((value: string) => {
    const isOk = /active|ready|running|available/i.test(value);
    if (isOk) {
      return (
        <Tag
          style={{
            ...STYLES.statusTag,
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
          ...STYLES.statusTag,
          border: '1px solid #e5e7eb',
          color: '#374151',
          background: '#F9FAFB',
        }}
      >
        {value}
      </Tag>
    );
  }, []);

  const kindPill = useCallback((kind: string) => <span style={STYLES.kindPill}>{kind}</span>, []);

  const headerNode = useCallback(
    (resource: InstanceResource) => (
      <div style={STYLES.headerContainer}>
        <div style={STYLES.headerLeft}>
          <span style={STYLES.instanceIcon}>
            <AppstoreOutlined />
          </span>
          <span style={STYLES.textPrimary}>{resource.name}</span>
        </div>
        <div style={STYLES.flexCenterGap12}>
          {kindPill(resource.type)}
          {statusTag(resource.status)}
        </div>
      </div>
    ),
    [kindPill, statusTag],
  );

  const handleContainerToggle = useCallback((instanceKey: string) => {
    setExpandedContainers((prev) => ({
      ...prev,
      [instanceKey]: !prev[instanceKey],
    }));
  }, []);

  const detailNode = useCallback(
    (resource: InstanceResource) => {
      const instanceKey = resource.name;
      const isContainersExpanded = expandedContainers[instanceKey] || false;

      return (
        <div style={{ padding: '16px 0' }}>
          {/* Metrics Section */}
          <div style={STYLES.metricsSection}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                background: '#f8fafc',
              }}
            >
              <div style={STYLES.flexCenterGap12}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: DEFAULT_COLORS.SUCCESS,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                  }}
                >
                  <DashboardOutlined />
                </div>
                <div>
                  <div style={STYLES.textLabel}>Resource Metrics</div>
                  <div style={STYLES.textValue}>CPU & Memory Usage</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={STYLES.flexCenter}>
                  <div style={STYLES.statusDot} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>CPU:</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                    {resource.cpu || '0m'}
                  </span>
                </div>

                <div style={STYLES.flexCenter}>
                  <div style={STYLES.statusDot} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Memory:</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
                    {resource.memory || '0Mi'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Containers Section */}
          <div style={STYLES.containersSection}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                background: '#f8fafc',
                borderBottom: 'none',
              }}
            >
              <div style={STYLES.flexCenterGap12}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: DEFAULT_COLORS.SUCCESS,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 14,
                  }}
                >
                  <ContainerOutlined />
                </div>
                <div>
                  <div style={STYLES.textLabel}>Containers</div>
                  <div style={STYLES.textValue}>
                    {resource.containers.length} container
                    {resource.containers.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <Button
                type="text"
                icon={
                  <DownOutlined
                    style={{
                      transform: isContainersExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                }
                onClick={() => handleContainerToggle(instanceKey)}
                style={{
                  ...STYLES.toggleButton,
                  transform: isContainersExpanded ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isContainersExpanded
                    ? '0 4px 12px rgba(32, 201, 151, 0.3)'
                    : '0 2px 4px rgba(32, 201, 151, 0.1)',
                }}
              >
                {isContainersExpanded ? 'Hide Containers' : 'View Containers'}
              </Button>
            </div>

            {/* Expanded Containers */}
            <div
              style={{
                maxHeight: isContainersExpanded ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                opacity: isContainersExpanded ? 1 : 0,
              }}
            >
              <div
                style={{
                  padding: '12px',
                  background: '#f8fafc',
                  transform: isContainersExpanded ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div style={STYLES.flexColumn}>
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
                        overflow: 'hidden',
                      }}
                    >
                      {/* Left side - Container name with green dot */}
                      <div style={STYLES.flexCenter}>
                        <div style={STYLES.statusDot} />
                        <div>
                          <div style={STYLES.textValue}>{container.name}</div>
                          {container.ports && container.ports.length > 0 && (
                            <div style={{ ...STYLES.textSmall, marginTop: 2 }}>
                              {container.ports.length} port{container.ports.length !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right side - Image details */}
                      <div style={STYLES.flexWrap}>
                        <span style={STYLES.badge}>
                          Image: {container.image?.name || 'No image specified'}
                        </span>
                        {container.image?.tag && (
                          <span style={STYLES.badge}>Tag: {container.image.tag}</span>
                        )}
                        {container.image?.pullPolicy && (
                          <span style={STYLES.badgeBlue}>
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
    },
    [expandedContainers, handleContainerToggle, getPullPolicyDescription],
  );

  if (!resources || resources.length === 0) {
    return (
      <div style={STYLES.emptyState}>
        <div style={STYLES.emptyIcon}>
          <AppstoreOutlined />
        </div>
        <div style={{ ...STYLES.textPrimary, marginBottom: 6 }}>No Instances Found</div>
        <div style={{ ...STYLES.textSecondary, marginBottom: 16, maxWidth: 520, lineHeight: 1.6 }}>
          This workload doesn&apos;t have any instances or containers yet.
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {paginatedResources.map((resource, index) => (
          <Collapse
            key={index}
            items={[{ key: 'panel', label: headerNode(resource), children: detailNode(resource) }]}
            expandIconPosition="end"
            ghost
            style={STYLES.containerCard}
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
