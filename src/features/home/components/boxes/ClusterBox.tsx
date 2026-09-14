import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import {
  HOME_DASHBOARD_LAYOUT as L,
  HOME_DASHBOARD_STYLES as S,
  HOME_DASHBOARD_TEXTS as T,
} from '../../constants/dashboard';
import type { BoxState, ClusterVersionInfo } from '../../models';
import DashboardBox from '../box/DashboardBox';

const C = T.CLUSTER;

const Field: React.FC<{ label: string; value: string; grow?: boolean }> = ({
  label,
  value,
  grow,
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0,
      flex: grow ? 1 : 'none',
    }}
  >
    <span style={{ ...S.MUTED_TEXT, ...S.ELLIPSIS }}>{label}</span>
    <span
      style={{
        ...S.ELLIPSIS,
        fontSize: L.ROW_TITLE_FONT_SIZE_PX,
        fontWeight: 600,
        color: DEFAULT_COLORS.TEXT_PRIMARY,
      }}
    >
      {value}
    </span>
  </div>
);

interface ClusterBoxProps extends BoxState {
  cluster: ClusterVersionInfo;
}

const ClusterBox: React.FC<ClusterBoxProps> = memo(({ cluster, ...boxProps }) => (
  <DashboardBox title={C.TITLE} {...boxProps}>
    <div style={{ display: 'flex', gap: L.BREAKDOWN_GAP_PX }}>
      <Field label={C.VERSION_LABEL} value={cluster.version} />
      <Field label={C.DISTRIBUTION_LABEL} value={cluster.distribution} />
      <Field label={C.FULL_LABEL} value={cluster.full} grow />
    </div>
  </DashboardBox>
));

ClusterBox.displayName = 'ClusterBox';

export default ClusterBox;
