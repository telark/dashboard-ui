import React from 'react';
import { APPLICATION_CHANGE_CLASS, APPLICATIONS_UI } from '../../../constants';
import { APPLICATION_CHANGE_LINE_PALETTE } from '../../../constants/sectionLayout';
import type { ApplicationChange } from '../../../models/application';
import { hasText, rollbackText } from './utils';
import { FONT_WEIGHT, SPACING, FONT_SIZE, LINE_HEIGHT } from '../../../../../constants';

type ChangeLinePalette =
  (typeof APPLICATION_CHANGE_LINE_PALETTE)[keyof typeof APPLICATION_CHANGE_LINE_PALETTE];

const ChangeDiff: React.FC<{ change: ApplicationChange; palette: ChangeLinePalette }> = ({
  change: c,
  palette: p,
}) => {
  const hasOldValue = hasText(c.oldValue);
  const hasNewValue = hasText(c.newValue);
  return (
    <>
      <span style={{ color: p.muted }}>{c.changeType}</span>{' '}
      <span style={{ fontWeight: FONT_WEIGHT.BOLD }}>
        {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.FIELD_LABELS[c.field] ?? c.field}
      </span>
      {': '}
      {hasOldValue ? (
        <span className={p.valueClass} style={{ color: p.muted, textDecoration: 'line-through' }}>
          {String(c.oldValue)}
        </span>
      ) : null}
      {hasOldValue && hasNewValue ? (
        <span style={{ margin: `0 ${SPACING.S6}px`, color: p.muted }}>
          {APPLICATIONS_UI.SECTIONS.CHANGE_LOG.DIFF_ARROW}
        </span>
      ) : null}
      {hasNewValue ? (
        <span className={p.valueClass} style={{ fontWeight: FONT_WEIGHT.BOLD }}>
          {String(c.newValue)}
        </span>
      ) : !hasOldValue ? (
        <span style={{ color: p.text }}>{c.description}</span>
      ) : null}
    </>
  );
};

const ChangeLine: React.FC<{
  change: ApplicationChange;
  first: boolean;
  palette: ChangeLinePalette;
  /** One line, ellipsized: a collapsed History entry. */
  clamped?: boolean;
}> = ({ change, first, palette, clamped = false }) => {
  const preferDescription =
    change.changeType === APPLICATION_CHANGE_CLASS.ROLLBACK && Boolean(change.description);
  return (
    <div
      style={{
        fontSize: FONT_SIZE.SM,
        color: palette.text,
        lineHeight: LINE_HEIGHT.BASE,
        marginTop: first ? SPACING.NONE : SPACING.S6,
        maxWidth: palette.maxWidth,
        ...(clamped
          ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
          : { overflowWrap: palette.wrap }),
      }}
    >
      {preferDescription ? rollbackText(change) : <ChangeDiff change={change} palette={palette} />}
    </div>
  );
};

export default ChangeLine;
