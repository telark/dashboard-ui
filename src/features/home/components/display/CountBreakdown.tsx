import React from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { HOME_DASHBOARD_LAYOUT as L, HOME_DASHBOARD_STYLES as S } from '../../constants/dashboard';
import type { BreakdownItem } from '../../models';
import StatusDot from './StatusDot';

const CountBreakdown: React.FC<{ items: BreakdownItem[] }> = ({ items }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: L.BREAKDOWN_GAP_PX, rowGap: 4 }}>
    {items.map((item) => (
      <span
        key={item.label}
        style={{ ...S.MUTED_TEXT, display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <StatusDot color={item.color} />
        <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY, fontWeight: 600 }}>{item.count}</span>
        {item.label}
      </span>
    ))}
  </div>
);

export default CountBreakdown;
