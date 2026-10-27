import React, { memo } from 'react';
import type { BreakdownItem } from '../../models';
import DashboardBox, { type DashboardBoxProps } from '../box/DashboardBox';
import BigValue from '../display/BigValue';
import CountBreakdown from '../display/CountBreakdown';

interface SummaryBoxProps extends Omit<DashboardBoxProps, 'children'> {
  value: React.ReactNode;
  breakdown?: BreakdownItem[];
  // Snapshot storage reads as value, then its bar, so the value stays under the title.
  valueBelowTitle?: boolean;
  children?: React.ReactNode;
}

const SummaryBox: React.FC<SummaryBoxProps> = memo(
  ({ value, caption, breakdown, valueBelowTitle, children, ...boxProps }) => (
    <DashboardBox
      {...boxProps}
      value={valueBelowTitle ? undefined : value}
      caption={valueBelowTitle ? undefined : caption}
    >
      {valueBelowTitle ? <BigValue value={value} caption={caption} /> : null}
      {breakdown ? <CountBreakdown items={breakdown} /> : null}
      {children}
    </DashboardBox>
  ),
);

SummaryBox.displayName = 'SummaryBox';

export default SummaryBox;
