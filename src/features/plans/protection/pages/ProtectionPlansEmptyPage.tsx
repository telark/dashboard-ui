import React, { memo } from 'react';
import { Empty, Typography } from 'antd';
import { DOCS_LINKS, EMPTY_CLASS, Icons } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const ProtectionPlansIcon = Icons.ProtectionPlans;

const ProtectionPlansEmptyPage: React.FC = memo(() => (
  <Empty
    className={EMPTY_CLASS.PAGE}
    image={<ProtectionPlansIcon size={32} />}
    description={
      <>
        <Typography.Title level={2}>{PPC.LABELS.EMPTY.TITLE}</Typography.Title>
        <Typography.Text>{PPC.LABELS.EMPTY.DESCRIPTION}</Typography.Text>
      </>
    }
  >
    <Typography.Link
      href={DOCS_LINKS.AUDIT_AND_ENFORCE.HREF}
      target="_blank"
      rel="noopener noreferrer"
    >
      {DOCS_LINKS.AUDIT_AND_ENFORCE.LABEL}
    </Typography.Link>
  </Empty>
));

ProtectionPlansEmptyPage.displayName = 'ProtectionPlansEmptyPage';

export default ProtectionPlansEmptyPage;
