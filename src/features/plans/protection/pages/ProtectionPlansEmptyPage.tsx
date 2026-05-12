import React from 'react';
import { Empty, Button } from 'antd';
import { DEFAULT_COLORS, Icons } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

interface ProtectionPlansEmptyPageProps {
  onCreatePlanClick: () => void;
}

const ProtectionPlansEmptyPage: React.FC<ProtectionPlansEmptyPageProps> = ({
  onCreatePlanClick,
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
      }}
    >
      <Empty
        image={<Icons.ProtectionPlans size={64} style={{ color: DEFAULT_COLORS.ICON_MUTED }} />}
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
              {PPC.LABELS.EMPTY.TITLE}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: DEFAULT_COLORS.TEXT_MUTED,
              }}
            >
              {PPC.LABELS.EMPTY.DESCRIPTION}
            </p>
          </div>
        }
      >
        <Button type="primary" onClick={onCreatePlanClick}>
          {PPC.LABELS.EMPTY.BUTTON}
        </Button>
      </Empty>
    </div>
  );
};

export default ProtectionPlansEmptyPage;
