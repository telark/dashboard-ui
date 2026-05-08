import React, { memo, useCallback, useState } from 'react';
import { Button, Dropdown } from 'antd';
import { DeleteOutlined, MoreOutlined, StopOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { APPLICATION_SECTION_LAYOUT } from '../../../../../resources/applications/constants/sectionLayout';
import type { ProtectionPlan, PlanPhase } from '../../../models';
import {
  PROTECTION_PLANS_CONSTANTS as PPC,
  PHASE_DOT_COLOR,
} from '../../../constants/protectionPlans';
import TimeAgo from '../../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../../components/display/table/RowTag';
import type { AppDispatch, RootState } from '../../../../../../store';
import { cancelPlanThunk, deletePlanThunk } from '../../../store';
import { getCurrentUser } from '../../../../../auth/utils';
import { ActionConfirmModal } from '../../../../../../components/display/modal';

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
  const [deleting, setDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const users = useSelector((state: RootState) => state.users.users);
  const createdByLabel = users.find((u) => u.id === plan.createdBy)?.username ?? plan.createdBy;

  const phaseLabel = PPC.LABELS.PHASE_LABELS[plan.phase] ?? plan.phase;
  const dotColor = PHASE_DOT_COLOR[plan.phase] ?? PHASE_DOT_COLOR.draft;
  const canCancel = CANCELLABLE.includes(plan.phase);

  const namespaceTags = plan.scope.type === 'namespaces' ? (plan.scope.namespaces ?? []) : [];

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

  const handleDelete = useCallback(async () => {
    const userId = getCurrentUser()?.id;
    if (!userId) return;
    setDeleting(true);
    try {
      await dispatch(deletePlanThunk({ userId, planId: plan.id })).unwrap();
      setDeleteModalOpen(false);
    } finally {
      setDeleting(false);
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
    { type: 'divider' as const },
    {
      key: 'delete',
      label: PPC.LABELS.ACTIONS.DELETE,
      icon: <DeleteOutlined />,
      danger: true,
      disabled: deleting,
    },
  ];

  return (
    <div
      style={{
        position: 'relative',
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
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          {namespaceTags.map((ns) => (
            <RowTag
              key={ns}
              text={ns}
              background={DEFAULT_COLORS.CHIP_CUSTOM_BG}
              color={DEFAULT_COLORS.TEXT_MUTED}
              fontSize={11}
            />
          ))}
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
                  if (key === 'delete') setDeleteModalOpen(true);
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
        <MetricMini value={plan.scope.type} label="Scope" />
        {plan.mode && <MetricMini value={plan.mode} label={PPC.LABELS.MODE_ENFORCEMENT_LABEL} />}
        {plan.severity && <MetricMini value={plan.severity} label={PPC.LABELS.SEVERITY_LABEL} />}
        <MetricMini value={createdByLabel} label="Created by" />
        <MetricMini
          value={plan.createdAt ? <TimeAgo date={plan.createdAt} /> : '—'}
          label="Created"
        />
        <MetricMini
          value={plan.lastUpdatedAt ? <TimeAgo date={plan.lastUpdatedAt} /> : '—'}
          label="Last updated"
        />
      </div>
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <ActionConfirmModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title={PPC.LABELS.ACTIONS.DELETE_MODAL_TITLE}
          action="delete"
          resourceName={plan.name}
          resourceType="protection plan"
          confirmText={PPC.LABELS.ACTIONS.DELETE_MODAL_OK}
          loading={deleting}
          getContainer={() => document.body}
        />
      </div>
    </div>
  );
});

ProtectionPlanCard.displayName = 'ProtectionPlanCard';

export default ProtectionPlanCard;
