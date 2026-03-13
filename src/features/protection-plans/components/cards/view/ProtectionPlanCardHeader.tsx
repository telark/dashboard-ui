import React, { memo } from 'react';
import { Button, Dropdown } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../../constants/protectionPlans';
import type { ProtectionPlan } from '../../../models';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';

interface ProtectionPlanCardHeaderProps {
  plan: ProtectionPlan;
}

const ProtectionPlanCardHeader: React.FC<ProtectionPlanCardHeaderProps> = memo(({ plan }) => {
  const lifecycleLabel = PPC.LABELS.LIFECYCLE_LABELS[plan.lifecycle];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: plan.description ? 12 : 16,
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {plan.name}
        </h3>
        {plan.description && (
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 400,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1.2,
              fontFamily: "'Roboto Condensed', sans-serif",
            }}
          >
            {plan.description}
          </p>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            background:
              plan.lifecycle === 'active' ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.TEXT_MUTED,
            color: '#ffffff',
          }}
        >
          {lifecycleLabel}
        </span>
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: 'view',
                label: PPC.LABELS.ACTIONS.VIEW,
                icon: <EyeOutlined />,
              },
              {
                key: 'edit',
                label: PPC.LABELS.ACTIONS.EDIT,
                icon: <EditOutlined />,
              },
              {
                key: 'duplicate',
                label: 'Duplicate plan',
                icon: <CopyOutlined />,
              },
              ...(plan.lifecycle === 'active'
                ? [
                    {
                      key: 'cancel',
                      label: 'Cancel plan',
                      icon: <StopOutlined />,
                    },
                  ]
                : []),
              ...(plan.lifecycle === 'scheduled'
                ? [
                    {
                      key: 'activate',
                      label: 'Activate plan',
                      icon: <PlayCircleOutlined />,
                    },
                  ]
                : []),
              {
                type: 'divider',
              },
              {
                key: 'delete',
                label: PPC.LABELS.ACTIONS.DELETE,
                icon: <DeleteOutlined />,
                danger: true,
              },
            ],
          }}
        >
          <Button
            type="text"
            shape="circle"
            icon={<MoreOutlined rotate={90} />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Dropdown>
      </div>
    </div>
  );
});

ProtectionPlanCardHeader.displayName = 'ProtectionPlanCardHeader';

export default ProtectionPlanCardHeader;
