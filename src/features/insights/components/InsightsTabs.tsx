import React, { useCallback } from 'react';
import { Segmented } from 'antd';
import { useSearchParams } from 'react-router-dom';
import {
  CLUSTER_INSIGHTS,
  INSIGHTS_TAB_CATEGORY,
  INSIGHTS_TAB_LABELS,
} from '../constants/insights';
import { INSIGHTS_UI } from '../constants/texts';
import type { InsightCategory, InsightsTab } from '../models';

const TAB_COUNT = INSIGHTS_UI.PAGE.TABS.COUNT;
const TABS: InsightsTab[] = ['incidents', 'recommendations'];

export const readInsightsTab = (searchParams: URLSearchParams): InsightsTab =>
  searchParams.get(CLUSTER_INSIGHTS.TAB_PARAM) === 'recommendations'
    ? 'recommendations'
    : 'incidents';

interface Props {
  // Open, not dismissed; undefined until the first read.
  counts?: Partial<Record<InsightCategory, number>>;
  // The counts read failed: show the tabs without counts rather than keep them hidden.
  countsFailed?: boolean;
}

// Switching keeps the app filter; an open insight belongs to the tab being left.
const InsightsTabs: React.FC<Props> = ({ counts, countsFailed }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const onChange = useCallback(
    (next: InsightsTab) =>
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.delete(CLUSTER_INSIGHTS.INSIGHT_PARAM);
        if (next === 'incidents') params.delete(CLUSTER_INSIGHTS.TAB_PARAM);
        else params.set(CLUSTER_INSIGHTS.TAB_PARAM, next);
        return params;
      }),
    [setSearchParams],
  );
  // Hidden, not absent, until the counts arrive: the labels then render once at their final
  // width and nothing below or beside them moves.
  const hidden = !counts && !countsFailed;
  return (
    <div style={{ visibility: hidden ? 'hidden' : undefined }} aria-hidden={hidden}>
      <Segmented<InsightsTab>
        value={readInsightsTab(searchParams)}
        onChange={onChange}
        options={TABS.map((tab) => {
          const label = INSIGHTS_TAB_LABELS[tab];
          if (!counts) return { value: tab, label };
          const count = String(counts[INSIGHTS_TAB_CATEGORY[tab]] ?? 0);
          return {
            value: tab,
            label: TAB_COUNT.replace('{label}', label).replace('{count}', count),
          };
        })}
      />
    </div>
  );
};

export default InsightsTabs;
