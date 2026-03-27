import React from 'react';
import { Empty } from 'antd';
import { DEFAULT_COLORS, Icons } from '../../../../../constants';
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
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
      }}
    >
      <Empty
        image={<AppIcon size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED }} />}
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
              {APPLICATION_DETAILS_CONSTANTS.MESSAGES.EMPTY}
            </h2>
          </div>
        }
      />
    </div>
  );
};

export default ApplicationsDetailsEmpty;

