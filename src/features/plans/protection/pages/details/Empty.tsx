import React from 'react';
import { Empty } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';

const ProtectionPlanDetailsEmpty: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: DEFAULT_COLORS.PAGE_BG,
      }}
    >
      <Empty
        description={
          <div style={{ maxWidth: 420 }}>
            <h2
              style={{
                margin: 0,
                marginBottom: 8,
                fontSize: 20,
                fontWeight: 600,
                color: DEFAULT_COLORS.TEXT_PRIMARY,
              }}
            >
              {PPC.LABELS.DETAIL_PAGE.NOT_FOUND}
            </h2>
          </div>
        }
      />
    </div>
  );
};

export default ProtectionPlanDetailsEmpty;
