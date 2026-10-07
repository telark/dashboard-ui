import React, { memo } from 'react';
import { Empty, Typography } from 'antd';
import { EMPTY_CLASS, Icons } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const ProtectionPlansIcon = Icons.ProtectionPlans;

const ProtectionPlansEmptyPage: React.FC = memo(() => (
  <Empty
    className={EMPTY_CLASS.PAGE}
    image={<ProtectionPlansIcon size={32} />}
    description={
      <>
        <Typography.Title level={3}>{PPC.LABELS.EMPTY.TITLE}</Typography.Title>
        <Typography.Text>{PPC.LABELS.EMPTY.DESCRIPTION}</Typography.Text>
      </>
    }
  />
));

ProtectionPlansEmptyPage.displayName = 'ProtectionPlansEmptyPage';

export default ProtectionPlansEmptyPage;
