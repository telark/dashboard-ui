import {
  AiOutlineCheckCircle,
  AiOutlineFileImage,
  AiOutlineTag,
  AiOutlineSetting,
  AiFillTag,
} from 'react-icons/ai';
import type { ViewDetailsConfig } from '../components/display/shared/views/ViewDetails';
import RowTag from '../components/display/shared/table/RowTag';
import { INSTANCES_PAGE_CONSTANTS as IPC } from '../constants/pages/instances';
import { ICONS } from '../constants';
import type { InstanceTableRow } from '../interfaces/resources/instances';
import type { Container } from '../interfaces/resources/workload';

const getStatusColor = (status: string) => {
  const isActive = /active|ready|running|available/i.test(status);
  return {
    background: isActive ? IPC.COLORS.STATUS_ACTIVE_BG : IPC.COLORS.STATUS_INACTIVE_BG,
    color: isActive ? IPC.COLORS.STATUS_ACTIVE_TEXT : IPC.COLORS.STATUS_INACTIVE_TEXT,
  };
};

export const createInstanceViewConfig = (instance: InstanceTableRow): ViewDetailsConfig => {
  const fields: ViewDetailsConfig['fields'] = [
    {
      key: 'instance-name',
      label: 'Instance Name',
      value: instance.instanceName,
      icon: <AiFillTag />,
      type: 'text',
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
      icon: <ICONS.CPU />,
      type: 'text',
    },
    {
      key: 'instance-memory',
      label: 'Memory',
      value: instance.memory,
      icon: <ICONS.MEMORY />,
      type: 'text',
    },
  ];

  return {
    fields,
    cardStyle: {
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
    },
  };
};

export const createContainerViewConfig = (
  container: Container,
  index: number,
): ViewDetailsConfig => {
  const fields: ViewDetailsConfig['fields'] = [
    {
      key: `container-${index}-name`,
      label: 'Name',
      value: container.name,
      icon: <AiFillTag />,
      type: 'text',
    },
    {
      key: `container-${index}-subType`,
      label: 'Sub Type',
      value: container.subType || 'N/A',
      icon: <AiOutlineTag />,
      type: 'text',
    },
    {
      key: `container-${index}-image-name`,
      label: 'Image Name',
      value: container.image?.name || 'N/A',
      icon: <AiOutlineFileImage />,
      type: 'text',
    },
    {
      key: `container-${index}-image-tag`,
      label: 'Image Tag',
      value: container.image?.tag || 'N/A',
      icon: <AiOutlineTag />,
      type: 'text',
    },
    {
      key: `container-${index}-image-pullPolicy`,
      label: 'Pull Policy',
      value: container.image?.pullPolicy || 'N/A',
      icon: <AiOutlineSetting />,
      type: 'text',
    },
    {
      key: `container-${index}-image-isCurrent`,
      label: 'Is Current',
      value: (
        <RowTag
          text={container.image?.isCurrent ? 'Yes' : 'No'}
          background={
            container.image?.isCurrent ? IPC.COLORS.STATUS_ACTIVE_BG : IPC.COLORS.STATUS_INACTIVE_BG
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
      type: 'text',
    },
  ];

  return {
    fields,
    cardStyle: {
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
      padding: 0,
    },
  };
};
