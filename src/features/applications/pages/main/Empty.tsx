import React, { memo } from 'react';
import { Button, Empty, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { EMPTY_ACTION_STYLE, EMPTY_CLASS, Icons } from '../../../../constants';
import { APPLICATIONS_CONSTANTS } from '../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../constants/pages/connectivity';

const ApplicationIcon = Icons.Application;

interface EmptyProps {
  onRefresh: () => void;
}

const ApplicationsMainEmpty: React.FC<EmptyProps> = memo(({ onRefresh }) => (
  <Empty
    className={EMPTY_CLASS.PAGE}
    image={<ApplicationIcon size={32} />}
    description={
      <>
        <Typography.Title level={3}>
          {APPLICATIONS_CONSTANTS.MESSAGES.NO_APPLICATIONS_TITLE}
        </Typography.Title>
        <Typography.Text>
          {APPLICATIONS_CONSTANTS.MESSAGES.NO_APPLICATIONS_DESCRIPTION}
        </Typography.Text>
      </>
    }
  >
    <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh} style={EMPTY_ACTION_STYLE}>
      {CONNECTIVITY_CONSTANTS.MESSAGES.REFRESH}
    </Button>
  </Empty>
));

ApplicationsMainEmpty.displayName = 'ApplicationsMainEmpty';

export default ApplicationsMainEmpty;
