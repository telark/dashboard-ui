import React, { memo } from 'react';
import { DEFAULT_COLORS, SPACING } from '../../../../constants';
import {
  HOME_BOX_ICONS,
  HOME_DASHBOARD_STYLES as S,
  HOME_DASHBOARD_TEXTS as T,
} from '../../constants/dashboard';
import type { BoxState, ClusterVersionInfo } from '../../models';
import SummaryBox from './SummaryBox';

const C = T.CLUSTER;

interface ClusterBoxProps extends BoxState {
  cluster: ClusterVersionInfo;
}

const ClusterBox: React.FC<ClusterBoxProps> = memo(({ cluster, ...boxProps }) => (
  <SummaryBox
    title={C.TITLE}
    icon={HOME_BOX_ICONS.CLUSTER}
    value={cluster.version}
    caption={cluster.distribution}
    {...boxProps}
  >
    <div style={{ ...S.MUTED_TEXT, display: 'flex', gap: SPACING.S6, minWidth: 0 }}>
      <span style={{ flexShrink: 0 }}>{C.FULL_LABEL}</span>
      <span title={cluster.full} style={{ ...S.ELLIPSIS, color: DEFAULT_COLORS.TEXT_SECONDARY }}>
        {cluster.full}
      </span>
    </div>
  </SummaryBox>
));

ClusterBox.displayName = 'ClusterBox';

export default ClusterBox;
