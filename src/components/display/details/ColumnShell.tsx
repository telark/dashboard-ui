import React from 'react';
import { DEFAULT_COLORS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../../constants';

const COLUMN_TITLE_STYLE: React.CSSProperties = {
  fontSize: FONT_SIZE.SM,
  fontWeight: FONT_WEIGHT.BOLD,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  marginBottom: SPACING.SM,
};

// A summary column: its title, then its rows.
function ColumnShell(props: {
  title: string;
  // Shown on the title's line, at the opposite side.
  aside?: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  const { title, aside, children } = props;
  return (
    <div style={{ minWidth: 0 }}>
      {aside ? (
        <div
          style={{
            ...COLUMN_TITLE_STYLE,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            columnGap: SPACING.MD,
          }}
        >
          <span>{title}</span>
          {aside}
        </div>
      ) : (
        <div style={COLUMN_TITLE_STYLE}>{title}</div>
      )}
      <div>{children}</div>
    </div>
  );
}

export default ColumnShell;
