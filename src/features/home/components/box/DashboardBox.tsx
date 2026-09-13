import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { HOME_DASHBOARD_LAYOUT as L, HOME_DASHBOARD_STYLES as S } from '../../constants/dashboard';
import type { BoxState } from '../../models';
import BoxBody from './BoxBody';
import ViewAllLink from './ViewAllLink';

export interface DashboardBoxProps extends BoxState {
  title: string;
  count?: number;
  viewAllTo?: string;
  children: React.ReactNode;
}

// Fills its grid cell; the body clips so every box keeps the row's height.
const DashboardBox: React.FC<DashboardBoxProps> = memo(
  ({ title, count, viewAllTo, loading, failed, children }) => (
    <section
      style={{
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: L.BOX_HEADER_GAP_PX,
        padding: L.BOX_PADDING_PX,
        borderRadius: L.BOX_RADIUS_PX,
        background: DEFAULT_COLORS.SURFACE_ELEVATED,
        border: `1px solid ${DEFAULT_COLORS.BORDER_ELEVATED}`,
        minWidth: 0,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: L.ROW_GAP_PX,
        }}
      >
        <h3
          style={{
            ...S.ELLIPSIS,
            margin: 0,
            fontSize: L.BOX_TITLE_FONT_SIZE_PX,
            fontWeight: 600,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {title}
          {count ? (
            <span style={{ ...S.MUTED_TEXT, marginLeft: L.ROW_GAP_PX }}>{count}</span>
          ) : null}
        </h3>
        {viewAllTo ? <ViewAllLink to={viewAllTo} /> : null}
      </header>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: L.SECTION_GAP_PX,
        }}
      >
        <BoxBody loading={loading} failed={failed}>
          {children}
        </BoxBody>
      </div>
    </section>
  ),
);

DashboardBox.displayName = 'DashboardBox';

export default DashboardBox;
