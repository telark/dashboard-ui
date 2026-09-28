import React from 'react';
import { DEFAULT_COLORS, getPillSurface } from '../../../../constants';
import { APPLICATION_SNAPSHOT_ROW } from '../../constants/sectionLayout';

const R = APPLICATION_SNAPSHOT_ROW;

const SnapshotMetaChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: R.CHIP_PADDING,
      borderRadius: R.CHIP_RADIUS_PX,
      ...getPillSurface(),
      color: DEFAULT_COLORS.PILL_TEXT,
      fontSize: R.CHIP_FONT_SIZE_PX,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
  >
    {children}
  </span>
);

export default SnapshotMetaChip;
