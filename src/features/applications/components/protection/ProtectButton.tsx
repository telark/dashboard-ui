import React from 'react';
import { Button, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, DEFAULT_COLORS } from '../../../../constants';
import type { CreatePlanRouteState } from '../../../../interfaces/shared';
import { ACTION_PERMISSIONS, usePermission } from '../../../auth/hooks';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../../plans/protection/constants/protectionPlans';
import type { Application } from '../../models';
import { APPLICATION_CARD } from '../../constants';

const { create } = ACTION_PERMISSIONS.protectionPlans;

const LINK_STYLE: React.CSSProperties = { height: 'auto', padding: 0, fontSize: 'inherit' };
const DISABLED_STYLE: React.CSSProperties = {
  ...LINK_STYLE,
  color: DEFAULT_COLORS.TEXT_DISABLED,
  cursor: 'not-allowed',
};

// Opens Protection plans with the create panel prefilled for this app. Without create access it
// is aria-disabled rather than disabled, so it keeps focus and hover, and both show the reason.
const ProtectButton: React.FC<{ application: Application }> = ({ application }) => {
  const navigate = useNavigate();
  const canCreate = usePermission(create.scope, create.level, create.deny);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canCreate) return;
    const state: CreatePlanRouteState = {
      createPlan: {
        application: {
          name: application.name,
          title: application.displayName || application.name,
        },
      },
    };
    navigate(APP_ROUTES.PROTECTION_PLANS, { state });
  };

  return (
    <Tooltip
      title={canCreate ? undefined : PPC.LABELS.PERMISSION_DENIED.CREATE}
      trigger={['hover', 'focus']}
    >
      <Button
        type="link"
        aria-disabled={!canCreate}
        onClick={handleClick}
        // Cards open their app on Enter: this one is the button's own.
        onKeyDown={(e) => e.stopPropagation()}
        style={canCreate ? LINK_STYLE : DISABLED_STYLE}
      >
        {APPLICATION_CARD.COVERAGE.PROTECT}
      </Button>
    </Tooltip>
  );
};

export default ProtectButton;
