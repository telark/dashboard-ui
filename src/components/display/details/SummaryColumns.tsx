import React from 'react';
import { DEFAULT_COLORS, SUMMARY_LAYOUT } from '../../../constants';
import { useElementWidth } from '../../../hooks/layout/useElementWidth';
import ColumnShell from './ColumnShell';
import KeyValueGrid, { type KeyValueGridRow } from './KeyValueGrid';

const L = SUMMARY_LAYOUT;

export const SummaryBlock: React.FC<{
  title: string;
  rows: KeyValueGridRow[];
  stacked: boolean;
}> = ({ title, rows, stacked }) => (
  <ColumnShell title={title}>
    {/* Narrower than a label beside its value: each label goes above its value instead. */}
    <KeyValueGrid compact={!stacked} plainLabels rows={rows} />
  </ColumnShell>
);

// A column after the first in its row starts with a divider, centered in the column gap.
const SummaryColumn: React.FC<{ divided: boolean; children: React.ReactNode }> = ({
  divided,
  children,
}) => (
  <div
    style={{
      minWidth: 0,
      display: 'grid',
      alignContent: 'start',
      rowGap: L.ROW_GAP_PX,
      ...(divided && {
        borderLeft: `1px solid ${DEFAULT_COLORS.BORDER_DEFAULT}`,
        paddingLeft: L.COLUMN_GAP_PX / 2,
      }),
    }}
  >
    {children}
  </div>
);

// Read from the card's measured width, since the sidebar changes it without the viewport.
const summaryColumns = (width: number): number => {
  const span = (columns: number) =>
    columns * L.BLOCK_MIN_WIDTH_PX + (columns - 1) * L.COLUMN_GAP_PX;
  if (width >= span(3)) return 3;
  if (width >= span(2)) return 2;
  return 1;
};

// A summary card's keyed columns in reading order, three, two or one across. `stacked` tells them
// the card is too narrow for a label beside its value.
const SummaryColumns: React.FC<{ renderColumns: (stacked: boolean) => React.ReactElement[] }> = ({
  renderColumns,
}) => {
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const stacked = width > 0 && width < L.BLOCK_MIN_WIDTH_PX;
  const columns = summaryColumns(width);
  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        columnGap: L.COLUMN_GAP_PX / 2,
        rowGap: L.ROW_GAP_PX,
      }}
    >
      {renderColumns(stacked).map((column, index) => (
        <SummaryColumn key={column.key} divided={index % columns !== 0}>
          {column}
        </SummaryColumn>
      ))}
    </div>
  );
};

export default SummaryColumns;
