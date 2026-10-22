import React from 'react';
import { Empty } from 'antd';
import { DEFAULT_COLORS, Icons, SPACING, FONT_SIZE, FONT_WEIGHT } from '../../../../constants';
import { APPLICATION_DETAILS_CONSTANTS } from '../../constants';

const ApplicationsDetailsEmpty: React.FC = () => {
  const AppIcon = Icons.Application;
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
        image={<AppIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED }} />}
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
              {APPLICATION_DETAILS_CONSTANTS.MESSAGES.EMPTY}
            </h2>
          </div>
        }
      />
    </div>
  );
};

export default ApplicationsDetailsEmpty;
