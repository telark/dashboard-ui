import React from 'react';
import { Empty, Typography } from 'antd';
import { EMPTY_CLASS, Icons } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';

const ProtectionPlansIcon = Icons.ProtectionPlans;

// Same presentation as the plans empty page, which renders in the same slot.
const NoProtectionPlansState: React.FC = () => (
  <Empty
    className={EMPTY_CLASS.PAGE}
    image={<ProtectionPlansIcon size={32} />}
    description={
      <>
        <Typography.Title level={3}>{PPC.LABELS.NO_MATCH.TITLE}</Typography.Title>
        <Typography.Text>{PPC.LABELS.NO_MATCH.DESCRIPTION}</Typography.Text>
      </>
    }
  />
);

export default NoProtectionPlansState;
