import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import StatusTag from '../../tags/StatusTag';
import { ResourceTagProps } from '../../../interfaces/grouper';

const ResourceTag: React.FC<ResourceTagProps> = React.memo(({ type = 'type', value }) => {
  if (type === 'status') {
    const isActive = /active|ready|running|available/i.test(value);
    const statusColor = isActive ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DEFAULT;

    return <StatusTag label={value} color={statusColor} />;
  }

  return <StatusTag label={value} color={DEFAULT_COLORS.SUCCESS} />;
});

ResourceTag.displayName = 'ResourceTag';
export default ResourceTag;
