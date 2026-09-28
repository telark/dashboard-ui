import React from 'react';
import { AiOutlineWarning } from 'react-icons/ai';
import {
  DEFAULT_COLORS,
  LIST_TOOLBAR,
  TOOLBAR_CONTROL,
  getQuickFilterPillColors,
} from '../../../constants';
import { CompactQuickFilter } from '../../../components/display/toolbar';
import { INSIGHTS_UI } from '../constants/texts';
import { INSIGHT_SEVERITY_LABELS, SEVERITY_COLORS } from '../constants/insights';
import type { InsightSeverity } from '../models';

export type SeverityPill = InsightSeverity | 'all';

const P = INSIGHTS_UI.PAGE;
const PILLS: SeverityPill[] = ['all', 'critical', 'warning', 'info'];

const accentOf = (pill: SeverityPill): string =>
  pill === 'all' ? DEFAULT_COLORS.TEXT_MUTED : SEVERITY_COLORS[pill];
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
  count === undefined ? INSIGHTS_UI.EMPTY_VALUE : String(count);

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
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: '100%' }}>
      {PILLS.map((pill) => {
        const isActive = active === pill;
        const accent = accentOf(pill);
        return (
          <button
            key={pill}
            type="button"
            onClick={() => onChange(pill)}
            style={{
              all: 'unset',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              height: TOOLBAR_CONTROL.HEIGHT,
              boxSizing: 'border-box',
              padding: TOOLBAR_CONTROL.PADDING,
              borderRadius: LIST_TOOLBAR.PILL_RADIUS_PX,
              ...getQuickFilterPillColors(accent, isActive),
              fontSize: 12,
              fontWeight: 700,
              lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
              userSelect: 'none',
            }}
          >
            <span>{labelOf(pill)}</span>
            <span style={{ opacity: 0.85 }}>· {countText(counts[pill])}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SeverityPills;
