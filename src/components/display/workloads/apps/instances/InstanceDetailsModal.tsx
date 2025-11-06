import React from 'react';
import { Collapse } from 'antd';
import BaseModal from '../../../shared/modal/BaseModal';
import ViewDetails, { type ViewDetailField } from '../../../shared/views/ViewDetails';
import type { AppWorkload, Container } from '../../../../../interfaces/workload';
import type { InstanceTableRow } from '../../../../../interfaces/instances';
import { ContainerOutlined } from '@ant-design/icons';
import {
  AiOutlineCheckCircle,
  AiOutlineDashboard,
  AiOutlineFileImage,
  AiOutlineTag,
  AiOutlineSetting,
  AiFillTag,
} from 'react-icons/ai';
import RowTag from '../../../shared/table/RowTag';
import { INSTANCES_PAGE_CONSTANTS as IPC } from '../../../../../constants/pages/instances';

interface InstanceDetailsModalProps {
  open: boolean;
  onCancel: () => void;
  instance: InstanceTableRow | null;
  workload: AppWorkload;
}

const InstanceDetailsModal: React.FC<InstanceDetailsModalProps> = ({
  open,
  onCancel,
  instance,
  workload,
}) => {
  if (!instance) return null;

  // Get the full container data from the workload
  const containers = workload.cacid?.crates?.regular || [];
  const containerNames = instance.containerNames?.split(', ').filter(Boolean) || [];
  const instanceContainers = containers.filter((c: Container) => containerNames.includes(c.name));

  const getStatusColor = (status: string) => {
    const isActive = /active|ready|running|available/i.test(status);
    return {
      background: isActive ? IPC.COLORS.STATUS_ACTIVE_BG : IPC.COLORS.STATUS_INACTIVE_BG,
      color: isActive ? IPC.COLORS.STATUS_ACTIVE_TEXT : IPC.COLORS.STATUS_INACTIVE_TEXT,
    };
  };

  // Create view config with instance details and all containers
  const allFields: ViewDetailField[] = [
    {
      key: 'instance-name',
      label: 'Instance Name',
      value: instance.instanceName,
      icon: <AiFillTag />,
    },
    {
      key: 'instance-status',
      label: 'Status',
      value: (
        <RowTag
          text={instance.status}
          background={getStatusColor(instance.status).background}
          color={getStatusColor(instance.status).color}
          fontSize={IPC.SIZES.CHIP_FONT}
        />
      ),
      type: 'custom',
      icon: <AiOutlineCheckCircle />,
    },
    {
      key: 'instance-cpu',
      label: 'CPU',
      value: instance.cpu,
      icon: <AiOutlineDashboard />,
    },
    {
      key: 'instance-memory',
      label: 'Memory',
      value: instance.memory,
      icon: <AiOutlineDashboard />,
    },
  ];

  // Create container collapse items
  const containerCollapseItems = instanceContainers.map((container: Container, index: number) => {
    const containerFields: ViewDetailField[] = [
      {
        key: `container-${index}-name`,
        label: 'Name',
        value: container.name,
        icon: <AiFillTag />,
      },
      {
        key: `container-${index}-subType`,
        label: 'Sub Type',
        value: container.subType || 'N/A',
        icon: <AiOutlineTag />,
      },
      {
        key: `container-${index}-image-name`,
        label: 'Image Name',
        value: container.image?.name || 'N/A',
        icon: <AiOutlineFileImage />,
      },
      {
        key: `container-${index}-image-tag`,
        label: 'Image Tag',
        value: container.image?.tag || 'N/A',
        icon: <AiOutlineTag />,
      },
      {
        key: `container-${index}-image-pullPolicy`,
        label: 'Pull Policy',
        value: container.image?.pullPolicy || 'N/A',
        icon: <AiOutlineSetting />,
      },
      {
        key: `container-${index}-image-isCurrent`,
        label: 'Is Current',
        value: (
          <RowTag
            text={container.image?.isCurrent ? 'Yes' : 'No'}
            background={
              container.image?.isCurrent
                ? IPC.COLORS.STATUS_ACTIVE_BG
                : IPC.COLORS.STATUS_INACTIVE_BG
            }
            color={
              container.image?.isCurrent
                ? IPC.COLORS.STATUS_ACTIVE_TEXT
                : IPC.COLORS.STATUS_INACTIVE_TEXT
            }
            fontSize={IPC.SIZES.CHIP_FONT}
          />
        ),
        type: 'custom',
        icon: <AiOutlineCheckCircle />,
      },
      {
        key: `container-${index}-ports`,
        label: 'Ports',
        value:
          container.ports && container.ports.length > 0 ? container.ports.join(', ') : 'No ports',
      },
    ];

    return {
      key: `container-${index}`,
      label: (
        <span
          style={{
            fontWeight: 700,
            color: IPC.COLORS.TEXT_PRIMARY,
            display: 'block',
            textAlign: 'left',
          }}
        >
          {container.name}
        </span>
      ),
      children: (
        <ViewDetails
          config={{
            fields: containerFields,
            cardStyle: {
              background: 'transparent',
              boxShadow: 'none',
              border: 'none',
              padding: 0,
            },
          }}
        />
      ),
    };
  });

  // Add containers section
  if (containerCollapseItems.length > 0) {
    allFields.push({
      key: 'containers-section',
      label: 'Containers',
      value: (
        <div className="instance-containers-collapse-wrapper" style={{ marginTop: 4 }}>
          <Collapse
            items={containerCollapseItems}
            expandIconPosition="end"
            ghost
            style={{ background: 'transparent' }}
            className="instance-containers-collapse"
          />
        </div>
      ),
      icon: <ContainerOutlined />,
      type: 'composed',
    });
  }

  const viewConfig = {
    fields: allFields,
    cardStyle: {
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
    },
  };

  return (
    <BaseModal open={open} onCancel={onCancel} width={600}>
      <div style={{ paddingTop: 24 }}>
        <ViewDetails config={viewConfig} />
      </div>
    </BaseModal>
  );
};

export default InstanceDetailsModal;
