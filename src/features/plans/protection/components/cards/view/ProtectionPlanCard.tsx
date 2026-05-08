import React, { memo, useCallback, useState } from 'react';
import { Button, Dropdown } from 'antd';
import { MoreOutlined, StopOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../../../../resources/applications/constants/sectionLayout';
import type { ProtectionPlan, PlanPhase } from '../../../models';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PHASE_BADGE_CONFIG,
  PHASE_DOT_COLOR,
} from '../../../constants/protectionPlans';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../../components/display/table/RowTag';
import type { AppDispatch } from '../../../../../../store';
import { cancelPlanThunk } from '../../../store';
import { getCurrentUser } from '../../../../../auth/utils';

interface ProtectionPlanCardProps {
  plan: ProtectionPlan;
}

function MetricMini(props: { value: React.ReactNode; label: string }): React.ReactElement {
  return (
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
          lineHeight: 1.1,
        }}
      >
        {props.value}
      </div>
      <div style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, lineHeight: 1.1 }}>
        {props.label}
      </div>
    </div>
  );
}

const CANCELLABLE: PlanPhase[] = ['active', 'scheduled', 'failed'];

const ProtectionPlanCard: React.FC<ProtectionPlanCardProps> = memo(({ plan }) => {
  const dispatch: AppDispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const phaseLabel = PPC.LABELS.PHASE_LABELS[plan.phase] ?? plan.phase;
  const badgeColors = PHASE_BADGE_CONFIG[plan.phase] ?? PHASE_BADGE_CONFIG.draft;
  const dotColor = PHASE_DOT_COLOR[plan.phase] ?? PHASE_DOT_COLOR.draft;
  const canCancel = CANCELLABLE.includes(plan.phase);

  const scopeSummary =
    plan.scope.type === 'applications'
      ? plan.scope.applicationIds?.join(', ') || '—'
      : plan.scope.namespaces?.join(', ') || '—';

  const menuButtonStyle: React.CSSProperties = {
    color: menuOpen ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.ICON_SECONDARY,
    flexShrink: 0,
    width: 30,
    height: 30,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    background: menuOpen ? DEFAULT_COLORS.BACKGROUND_HOVER : 'transparent',
    transition: 'background 120ms ease, color 120ms ease',
  };

  const handleCancel = useCallback(async () => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setCancelling(true);
    try {
      await dispatch(cancelPlanThunk({ userId, planId: plan.id })).unwrap();
    } finally {
      setCancelling(false);
    }
  }, [dispatch, plan.id]);

  const menuItems = [
    ...(canCancel
      ? [
          {
            key: 'cancel',
            label: PPC.LABELS.ACTIONS.CANCEL,
            icon: <StopOutlined />,
            danger: true,
            disabled: cancelling,
          },
        ]
      : []),
  ];

  return (
    <div
      style={{
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRadius: APPLICATION_SECTION_LAYOUT.CARD_RADIUS,
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        padding: 16,
        boxSizing: 'border-box',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              rowGap: 6,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 17,
                fontWeight: 700,
                color: DEFAULT_COLORS.TEXT_PRIMARY,
                lineHeight: 1.25,
              }}
            >
              {plan.name}
            </h3>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: dotColor,
                  boxShadow: `0 0 0 3px ${DEFAULT_COLORS.CHIP_CUSTOM_BG}`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: DEFAULT_COLORS.TEXT_MUTED,
                  lineHeight: 1.2,
                  textTransform: 'capitalize',
                }}
              >
                {phaseLabel}
              </span>
            </span>
          </div>
          <p
            style={{
              margin: '1px 0 0',
              fontSize: 12,
              fontWeight: 500,
              color: DEFAULT_COLORS.TEXT_MUTED,
              lineHeight: 1.3,
              wordBreak: 'break-word',
            }}
          >
            {plan.description || plan.name}
          </p>
          {(plan.severity || plan.mode) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {plan.severity && (
                <RowTag
                  text={plan.severity}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                  fontSize={11}
                />
              )}
              {plan.mode && (
                <RowTag
                  text={plan.mode}
                  background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
                  color={DEFAULT_COLORS.CHIP_CUSTOM_TEXT}
                  fontSize={11}
                />
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: badgeColors.background,
              color: badgeColors.color,
              padding: '2px 10px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 11,
            }}
          >
            {phaseLabel}
          </span>
          <RowTag
            text={plan.scope.type}
            background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
            color={DEFAULT_COLORS.TEXT_MUTED}
            fontSize={11}
          />
          {menuItems.length > 0 && (
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              open={menuOpen}
              onOpenChange={setMenuOpen}
              menu={{
                items: menuItems,
                onClick: ({ key, domEvent }) => {
                  domEvent.stopPropagation();
                  if (key === 'cancel') void handleCancel();
                },
              }}
            >
              <Button
                type="text"
                shape="circle"
                icon={<MoreOutlined rotate={90} />}
                size="small"
                onClick={(e) => e.stopPropagation()}
                style={menuButtonStyle}
              />
            </Dropdown>
          )}
        </div>
      </div>

      {/* Metrics row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          paddingTop: 10,
          marginTop: 10,
          borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
          flexWrap: 'wrap',
        }}
      >
        <MetricMini value={plan.policies?.length ?? 0} label="Policies" />
        <MetricMini
          value={scopeSummary}
          label={plan.scope.type === 'applications' ? 'Applications' : 'Namespaces'}
        />
        <MetricMini value={plan.createdBy} label="Created by" />
        <MetricMini
          value={plan.createdAt ? <TimeAgo date={plan.createdAt} /> : '—'}
          label="Created"
        />
        <MetricMini
          value={plan.lastUpdatedAt ? <TimeAgo date={plan.lastUpdatedAt} /> : '—'}
          label="Last updated"
        />
      </div>
    </div>
  );
});

ProtectionPlanCard.displayName = 'ProtectionPlanCard';

export default ProtectionPlanCard;
