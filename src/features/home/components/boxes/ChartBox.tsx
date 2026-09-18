import React, { memo } from 'react';
import { HOME_DASHBOARD_STYLES as S } from '../../constants/dashboard';
import DashboardBox, { type DashboardBoxProps } from '../box/DashboardBox';

interface ChartBoxProps extends DashboardBoxProps {
  isEmpty: boolean;
  emptyText: string;
}

// Charts measure their container, so the body gets all remaining height of the box.
// Explicit height: the plots wrapper uses `height: inherit` and falls back to 480px on `auto`.
const ChartBox: React.FC<ChartBoxProps> = memo(({ isEmpty, emptyText, children, ...boxProps }) => (
  <DashboardBox bodyOverflow="visible" {...boxProps}>
    {isEmpty ? (
      <div style={S.MUTED_TEXT}>{emptyText}</div>
    ) : (
      <div style={{ flex: 1, minHeight: 0, height: '100%' }}>{children}</div>
    )}
  </DashboardBox>
));

ChartBox.displayName = 'ChartBox';

export default ChartBox;
