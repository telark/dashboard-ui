import React, { useLayoutEffect, useRef, useState } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  ROW_ACTION_CLASS,
  UNSTYLED_BUTTON,
  SPACING,
  FONT_SIZE,
} from '../../../../../constants';
import { APPLICATIONS_UI } from '../../../constants';
import {
  APPLICATION_CHANGE_LINE_PALETTE,
  APPLICATION_CHANGE_LIST,
} from '../../../constants/sectionLayout';
import type { ApplicationChange } from '../../../models/application';
import ChangeLine from './ChangeLine';

const CL = APPLICATIONS_UI.SECTIONS.CHANGE_LOG;
const VISIBLE = APPLICATION_CHANGE_LIST.VISIBLE_ROWS;

// Collapsed: the first three changes, one line each. The toggle shows the rest and the full
// values, and appears whenever either is hidden.
const ChangeList: React.FC<{ changes: ApplicationChange[]; keyPrefix: string }> = ({
  changes,
  keyPrefix,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);
  const hiddenCount = Math.max(0, changes.length - VISIBLE);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || expanded) return undefined;
    const check = () =>
      setTruncated([...list.children].some((line) => line.scrollWidth > line.clientWidth));
    check();
    const observer = new ResizeObserver(check);
    observer.observe(list);
    return () => observer.disconnect();
  }, [changes, expanded]);

  const shown = expanded ? changes : changes.slice(0, VISIBLE);
  const label = expanded
    ? CL.SHOW_LESS
    : hiddenCount > 0
      ? `${hiddenCount} ${CL.MORE_CHANGES}`
      : CL.SHOW_FULL_VALUES;

  return (
    <div>
      <div ref={listRef}>
        {shown.map((change, idx) => (
          <ChangeLine
            key={`${keyPrefix}:${idx}`}
            change={change}
            first={idx === 0}
            palette={APPLICATION_CHANGE_LINE_PALETTE.CARD}
            clamped={!expanded}
          />
        ))}
      </div>
      {expanded || hiddenCount > 0 || truncated ? (
        <button
          type="button"
          className={ROW_ACTION_CLASS}
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            ...UNSTYLED_BUTTON,
            display: 'inline-flex',
            alignItems: 'center',
            gap: SPACING.S6,
            marginTop: SPACING.XS,
            fontSize: FONT_SIZE.SM,
            color: DEFAULT_COLORS.TEXT_MUTED,
          }}
        >
          {expanded ? <UpOutlined /> : <DownOutlined />}
          {label}
        </button>
      ) : null}
    </div>
  );
};

export default ChangeList;
