import React from 'react';
import { Collapse } from 'antd';
import BaseModal from '../../../../../../../components/display/shared/modal/BaseModal';
import ViewDetails from '../../../../../../../components/display/shared/views/ViewDetails';
import type { AppWorkload, Container } from '../../../../../models';
import type { InstanceTableRow } from '../../../../../models/instances';
import { ContainerOutlined } from '@ant-design/icons';
import { INSTANCES_CONSTANTS as IPC } from '../../../../../constants/instances';
import {
  createInstanceViewConfig,
  createContainerViewConfig,
} from '../../../../../config/instanceViewConfig';

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
  const instanceConfig = createInstanceViewConfig(instance);
  const containerCollapseItems = instanceContainers.map((container: Container, index: number) => {
    const containerConfig = createContainerViewConfig(container, index);

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
      children: <ViewDetails config={containerConfig} />,
    };
  });

  // Add containers section to instance fields
  if (containerCollapseItems.length > 0) {
    instanceConfig.fields.push({
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

  const viewConfig = instanceConfig;

  return (
    <BaseModal open={open} onCancel={onCancel} width={600}>
      <div style={{ paddingTop: 24 }}>
        <ViewDetails config={viewConfig} />
      </div>
    </BaseModal>
  );
};

export default InstanceDetailsModal;
