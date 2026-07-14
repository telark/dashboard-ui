import React from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import { APPLICATION_SNAPSHOT_ROW } from '../../constants/sectionLayout';

const R = APPLICATION_SNAPSHOT_ROW;

/**
 * Chip for the light-surfaced snapshot and rollback panels. The dark
 * RUNTIME_VALUE_ROW_TAG used on the details page would be a heavy blob here.
 */
const SnapshotMetaChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: R.CHIP_PADDING,
      borderRadius: R.CHIP_RADIUS_PX,
      background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
      color: DEFAULT_COLORS.CHIP_ON_SURFACE_TEXT,
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
