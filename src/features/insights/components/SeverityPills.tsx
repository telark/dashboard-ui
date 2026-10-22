import React from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import { DEFAULT_COLORS, EMPTY_VALUE, STATUS_COLORS } from '../../../constants';
import { CompactQuickFilter, QuickFilterPills } from '../../../components/display/toolbar';
import { INSIGHTS_UI } from '../constants/texts';
import { INSIGHT_SEVERITY_LABELS } from '../constants/insights';
import type { InsightSeverity } from '../models';

export type SeverityPill = InsightSeverity | 'all';

const P = INSIGHTS_UI.PAGE;
const PILLS: SeverityPill[] = ['all', 'critical', 'warning', 'info'];

const accentOf = (pill: SeverityPill): string =>
  pill === 'all' ? DEFAULT_COLORS.TEXT_MUTED : STATUS_COLORS.INSIGHT_SEVERITY[pill];
const labelOf = (pill: SeverityPill): string =>
  pill === 'all' ? P.ALL : INSIGHT_SEVERITY_LABELS[pill];

interface Props {
  // null when the filter panel picked several severities: no pill matches.
  active: SeverityPill | null;
  counts: Record<SeverityPill, number | undefined>;
  compact: boolean;
  onChange: (next: SeverityPill) => void;
}

const countText = (count: number | undefined): string =>
  count === undefined ? EMPTY_VALUE : String(count);

const SeverityPills: React.FC<Props> = ({ active, counts, compact, onChange }) => {
  if (compact) {
    return (
      <CompactQuickFilter
        options={PILLS.map((pill) => ({
          key: pill,
          label: `${labelOf(pill)} · ${countText(counts[pill])}`,
          accent: accentOf(pill),
        }))}
        active={active ?? 'all'}
        title={P.SEVERITY_FILTER}
        icon={<AiOutlineWarning />}
        onChange={onChange}
      />
    );
  }
  return (
    <QuickFilterPills
      options={PILLS.map((pill) => ({
        key: pill,
        label: labelOf(pill),
        accent: accentOf(pill),
        count: countText(counts[pill]),
      }))}
      active={active}
      onChange={onChange}
    />
  );
};

export default SeverityPills;
