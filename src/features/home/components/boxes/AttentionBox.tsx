import React, { memo } from 'react';
import { APP_ROUTES, DEFAULT_COLORS, FONT_WEIGHT } from '../../../../constants';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import {
  INSIGHTS_UI,
  useAnalyzerEnabled,
  useAutoAnalyze,
  type ClusterInsightsPage,
} from '../../../insights';
import {
  HOME_BOX_ICONS,
  HOME_DASHBOARD_LAYOUT as L,
  HOME_DASHBOARD_STYLES as S,
  HOME_DASHBOARD_TEXTS as T,
} from '../../constants/dashboard';
import type { BoxState } from '../../models';
import { incidentRow } from '../../utils/rows';
import DashboardBox from '../box/DashboardBox';
import RowList from '../display/RowList';

const A = T.NEEDS_ATTENTION;

const headline = (page: ClusterInsightsPage): string => {
  const critical = page.counts.bySeverity.critical ?? 0;
  return critical > 0 ? A.CRITICAL_OPEN(critical) : A.OPEN(page.total);
};

// Its own component, so the runtime read behind useAnalyzerEnabled runs only with nothing open,
// which DashboardBox shows only to a viewer with Insights read.
const NothingOpen: React.FC<{ indexedAt?: string }> = ({ indexedAt }) => {
  const enabled = useAnalyzerEnabled();
  const autoAnalyze = useAutoAnalyze();
  if (enabled === false) {
    return <div style={S.MUTED_TEXT}>{INSIGHTS_UI.PAGE.ANALYZER_OFF_TITLE}</div>;
  }
  if (autoAnalyze === false) {
    return <div style={S.MUTED_TEXT}>{INSIGHTS_UI.PAGE.MANUAL_ANALYSIS_TITLE}</div>;
  }
  return (
    <div style={S.MUTED_TEXT}>
      {autoAnalyze ? A.ALL_CLEAR : A.NONE_OPEN}
      {indexedAt ? (
        <>
          {T.META_SEPARATOR}
          {A.CHECKED} <TimeAgo date={indexedAt} />
        </>
      ) : null}
    </div>
  );
};

interface AttentionBoxProps extends BoxState {
  page: ClusterInsightsPage | null;
}

// Open, untriaged Critical and Warning incidents. The headline takes the line a row would, so
// rows keep their meta on the title's line.
const AttentionBox: React.FC<AttentionBoxProps> = memo(({ page, ...state }) => (
  <DashboardBox
    title={A.TITLE}
    icon={HOME_BOX_ICONS.NEEDS_ATTENTION}
    viewAllTo={APP_ROUTES.INSIGHTS}
    {...state}
  >
    {page && page.total > 0 ? (
      <>
        <div
          style={{
            fontSize: L.ROW_TITLE_FONT_SIZE_PX,
            fontWeight: FONT_WEIGHT.SEMIBOLD,
            color: DEFAULT_COLORS.TEXT_PRIMARY,
          }}
        >
          {headline(page)}
        </div>
        <RowList rows={page.items.map(incidentRow)} emptyText="" inline />
      </>
    ) : (
      <NothingOpen indexedAt={page?.indexedAt} />
    )}
  </DashboardBox>
));

AttentionBox.displayName = 'AttentionBox';

export default AttentionBox;
