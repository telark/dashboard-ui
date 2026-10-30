import React, { memo, useMemo } from 'react';
import { Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, DEFAULT_COLORS, DOCS_LINKS, Icons, SPACING } from '../../../../constants';
import { FancySpinner } from '../../../../components/animation';
import { Step, StepList } from '../../../../components/display/steps';
import { Toolbar } from '../../../../components/display/toolbar';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import type { CreatePlanRouteState } from '../../../../interfaces/shared';
import { ACTION_PERMISSIONS, usePermission } from '../../../auth/hooks';
import { useDiscoveryStatus } from '../../../applications';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../../plans/protection/constants/protectionPlans';
import {
  HOME_BOX_ICONS,
  HOME_DASHBOARD_LAYOUT as L,
  HOME_DASHBOARD_STYLES as S,
  HOME_DASHBOARD_TEXTS as T,
} from '../../constants/dashboard';
import DashboardBox from '../box/DashboardBox';

const { create } = ACTION_PERMISSIONS.protectionPlans;
const G = T.GET_STARTED;
const OPEN_CREATE_PANEL: CreatePlanRouteState = { createPlan: {} };

const helperStyle: React.CSSProperties = {
  ...S.MUTED_TEXT,
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.S6,
};

interface GetStartedBoxProps {
  applicationCount: number;
  // Discovered, excluded namespaces included: the Applications page's empty state counts these.
  discoveredCount: number;
  onDiscoveryCycleComplete: () => void;
}

// Leads Home until a first plan exists: the steps come from data the page already loads.
const GetStartedBox: React.FC<GetStartedBoxProps> = memo(
  ({ applicationCount, discoveredCount, onDiscoveryCycleComplete }) => {
    const navigate = useNavigate();
    const canCreate = usePermission(create.scope, create.level, create.deny);
    const scanning = useDiscoveryStatus(onDiscoveryCycleComplete)?.inProgress ?? false;

    let discovery: string = G.DISCOVER.NONE;
    if (scanning) discovery = G.DISCOVER.SCANNING(applicationCount);
    else if (applicationCount > 0) discovery = G.DISCOVER.FOUND(applicationCount);
    else if (discoveredCount > 0) discovery = G.DISCOVER.ALL_EXCLUDED(discoveredCount);
    const showLabelsHint = !scanning && applicationCount === 0 && discoveredCount === 0;
    // The Protection plans page's own create button, so both read and behave the same.
    const createPlan = useMemo<ToolbarConfig>(
      () => ({
        buttons: [
          {
            key: 'create-plan',
            label: PPC.LABELS.CREATE_BUTTON,
            icon: <Icons.ProtectionPlans size={14} />,
            variant: 'primary',
            onClick: () => navigate(APP_ROUTES.PROTECTION_PLANS, { state: OPEN_CREATE_PANEL }),
            disabled: !canCreate,
            tooltip: canCreate ? undefined : PPC.LABELS.PERMISSION_DENIED.CREATE,
          },
        ],
      }),
      [canCreate, navigate],
    );

    return (
      <DashboardBox title={G.TITLE} icon={HOME_BOX_ICONS.GET_STARTED}>
        <StepList>
          <Step number={1} title={G.DISCOVER.TITLE} done={applicationCount > 0}>
            <span style={helperStyle}>
              {scanning ? (
                <FancySpinner size={L.STEP_SPINNER_SIZE_PX} color={DEFAULT_COLORS.WARNING} />
              ) : null}
              {discovery}
              {showLabelsHint ? (
                <Tooltip title={G.DISCOVER.LABELS_HINT}>
                  <InfoCircleOutlined tabIndex={0} aria-label={G.DISCOVER.LABELS_HINT} />
                </Tooltip>
              ) : null}
            </span>
            <Typography.Link
              href={DOCS_LINKS.DISCOVERY.HREF}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: L.TEXT_FONT_SIZE_PX }}
            >
              {DOCS_LINKS.DISCOVERY.LABEL}
            </Typography.Link>
          </Step>
          <Step number={2} title={G.CREATE_PLAN.TITLE}>
            <span style={S.MUTED_TEXT}>{G.CREATE_PLAN.HELPER}</span>
            <Toolbar config={createPlan} />
          </Step>
          <Step number={3} title={G.WATCH.TITLE} last>
            <span style={S.MUTED_TEXT}>{G.WATCH.HELPER}</span>
          </Step>
        </StepList>
      </DashboardBox>
    );
  },
);

GetStartedBox.displayName = 'GetStartedBox';

export default GetStartedBox;
