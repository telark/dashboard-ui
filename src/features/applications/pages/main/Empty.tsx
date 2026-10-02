import React, { memo, useMemo } from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import EmptyState from '../../../../components/display/views/EmptyState';
import { Icons } from '../../../../constants';
import { APPLICATIONS_CONSTANTS } from '../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../constants/pages/connectivity';

const ApplicationIcon = Icons.Application;

interface EmptyProps {
  onRefresh: () => void;
}

const ApplicationsMainEmpty: React.FC<EmptyProps> = memo(({ onRefresh }) => {
  const icon = useMemo(() => <ApplicationIcon size={32} />, []);
  const buttonIcon = useMemo(() => <ReloadOutlined />, []);

  return (
    <EmptyState
      icon={icon}
      title={APPLICATIONS_CONSTANTS.MESSAGES.NO_APPLICATIONS_TITLE}
      description={APPLICATIONS_CONSTANTS.MESSAGES.NO_APPLICATIONS_DESCRIPTION}
      primaryAction={{
        label: CONNECTIVITY_CONSTANTS.MESSAGES.REFRESH,
        icon: buttonIcon,
        onClick: onRefresh,
      }}
    />
  );
});

ApplicationsMainEmpty.displayName = 'ApplicationsMainEmpty';

export default ApplicationsMainEmpty;
