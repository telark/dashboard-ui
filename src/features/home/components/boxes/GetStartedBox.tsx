import React, { memo } from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, DEFAULT_COLORS, DOCS_LINKS } from '../../../../constants';
import { FancySpinner } from '../../../../components/animation';
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

const Step: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({
  number,
  title,
  children,
}) => (
  <li style={{ display: 'flex', alignItems: 'flex-start', gap: L.ROW_GAP_PX, minWidth: 0 }}>
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: L.STEP_NUMBER_SIZE_PX,
        height: L.STEP_NUMBER_SIZE_PX,
        borderRadius: '50%',
        background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
        color: DEFAULT_COLORS.TEXT_SECONDARY,
        fontSize: L.TEXT_FONT_SIZE_PX,
        fontWeight: 600,
      }}
    >
      {number}
    </span>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: L.SECTION_GAP_PX,
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontSize: L.ROW_TITLE_FONT_SIZE_PX,
          fontWeight: 600,
          color: DEFAULT_COLORS.TEXT_PRIMARY,
        }}
      >
        {title}
      </span>
      {children}
    </div>
  </li>
);

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

    return (
      <DashboardBox title={G.TITLE} icon={HOME_BOX_ICONS.GET_STARTED}>
        <ol
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(min(${L.BOX_MIN_WIDTH_PX}px, 100%), 1fr))`,
            gap: L.GRID_GAP_PX,
          }}
        >
          <Step number={1} title={G.DISCOVER.TITLE}>
            <span style={{ ...S.MUTED_TEXT, display: 'flex', alignItems: 'center', gap: 6 }}>
              {scanning ? (
                <FancySpinner size={L.STEP_SPINNER_SIZE_PX} color={DEFAULT_COLORS.WARNING} />
              ) : null}
              {discovery}
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
            <Button
              type="primary"
              disabled={!canCreate}
              onClick={() => navigate(APP_ROUTES.PROTECTION_PLANS, { state: OPEN_CREATE_PANEL })}
            >
              {G.CREATE_PLAN.BUTTON}
            </Button>
            {canCreate ? null : (
              <span style={S.MUTED_TEXT}>{PPC.LABELS.PERMISSION_DENIED.CREATE}</span>
            )}
          </Step>
          <Step number={3} title={G.WATCH.TITLE}>
            <span style={S.MUTED_TEXT}>{G.WATCH.HELPER}</span>
          </Step>
        </ol>
      </DashboardBox>
    );
  },
);

GetStartedBox.displayName = 'GetStartedBox';

export default GetStartedBox;
