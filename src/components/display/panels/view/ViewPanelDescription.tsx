import React, { useState } from 'react';
import {
  DEFAULT_COLORS,
  FONT_WEIGHT,
  SLIDE_OUT,
  UNSTYLED_BUTTON,
  VIEW,
} from '../../../../constants';

const { DESCRIPTION_PREVIEW_CHARS, SHOW_MORE, SHOW_LESS } = VIEW;

const SHOW_MORE_STYLE: React.CSSProperties = {
  ...UNSTYLED_BUTTON,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
  fontWeight: FONT_WEIGHT.MEDIUM,
};

// Array.from counts by character, so the cut never splits an emoji.
const ViewPanelDescription: React.FC<{ text: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const chars = Array.from(text);
  if (chars.length <= DESCRIPTION_PREVIEW_CHARS) return text;
  return (
    <>
      {expanded ? text : `${chars.slice(0, DESCRIPTION_PREVIEW_CHARS).join('').trimEnd()}…`}{' '}
      <button
        type="button"
        aria-expanded={expanded}
        className={SLIDE_OUT.HEADER_BUTTON_CLASS}
        style={SHOW_MORE_STYLE}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? SHOW_LESS : SHOW_MORE}
      </button>
    </>
  );
};

export default ViewPanelDescription;
