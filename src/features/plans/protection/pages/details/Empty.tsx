import React from 'react';
import { Empty } from 'antd';
import { DEFAULT_COLORS, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../../../../constants';
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
                margin: SPACING.NONE,
                marginBottom: SPACING.SM,
                fontSize: FONT_SIZE.XXL,
                fontWeight: FONT_WEIGHT.SEMIBOLD,
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
