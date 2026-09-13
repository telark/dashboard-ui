import React, { memo } from 'react';
import type { BreakdownItem } from '../../models';
import DashboardBox, { type DashboardBoxProps } from '../box/DashboardBox';
import BigValue from '../display/BigValue';
import CountBreakdown from '../display/CountBreakdown';

interface SummaryBoxProps extends Omit<DashboardBoxProps, 'children'> {
  value: React.ReactNode;
  caption?: string;
  breakdown?: BreakdownItem[];
  children?: React.ReactNode;
}

const SummaryBox: React.FC<SummaryBoxProps> = memo(
  ({ value, caption, breakdown, children, ...boxProps }) => (
    <DashboardBox {...boxProps}>
      <BigValue value={value} caption={caption} />
      {breakdown ? <CountBreakdown items={breakdown} /> : null}
      {children}
    </DashboardBox>
  ),
);

SummaryBox.displayName = 'SummaryBox';

export default SummaryBox;
