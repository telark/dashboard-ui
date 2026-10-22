import React from 'react';
import { DEFAULT_COLORS, SPACING, FONT_WEIGHT } from '../../../../constants';
import { HOME_DASHBOARD_LAYOUT as L, HOME_DASHBOARD_STYLES as S } from '../../constants/dashboard';
import type { BreakdownItem } from '../../models';
import StatusDot from './StatusDot';

const CountBreakdown: React.FC<{ items: BreakdownItem[] }> = ({ items }) => (
  <div
    style={{ display: 'flex', flexWrap: 'wrap', columnGap: L.BREAKDOWN_GAP_PX, rowGap: SPACING.XS }}
  >
    {items.map((item) => (
      <span
        key={item.label}
        style={{ ...S.MUTED_TEXT, display: 'inline-flex', alignItems: 'center', gap: SPACING.S6 }}
      >
        {/* A zero keeps its place but not its color, so only what is there draws the eye. */}
        <StatusDot color={item.count > 0 ? item.color : DEFAULT_COLORS.ICON_SECONDARY} />
        <span
          style={
            item.count > 0
              ? { color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: FONT_WEIGHT.SEMIBOLD }
              : undefined
          }
        >
          {item.count}
        </span>
        {item.label}
      </span>
    ))}
  </div>
);

export default CountBreakdown;
