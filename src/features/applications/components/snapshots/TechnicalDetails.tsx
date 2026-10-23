import React, { useState } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  MONOSPACE_CLASS,
  SLIDE_OUT,
  SPACING,
  FONT_WEIGHT,
} from '../../../../constants';
import { APPLICATIONS_UI } from '../../constants/texts';
import { APPLICATION_SNAPSHOT_ROW } from '../../constants/sectionLayout';

const R = APPLICATION_SNAPSHOT_ROW;
const UI = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

// Raw engine or API text on a light panel: long, and only useful when digging in.
const TechnicalDetails: React.FC<{ detail: string }> = ({ detail }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ display: 'grid', rowGap: SPACING.XS, minWidth: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={SLIDE_OUT.HEADER_BUTTON_CLASS}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: SPACING.XS,
          justifySelf: 'start',
          fontSize: R.META_FONT_SIZE_PX,
          fontWeight: FONT_WEIGHT.SEMIBOLD,
          color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
        }}
      >
        {open ? <DownOutlined /> : <RightOutlined />}
        <span>{open ? UI.HIDE_DETAILS : UI.TECHNICAL_DETAILS}</span>
      </button>
      {open ? (
        <div
          className={MONOSPACE_CLASS}
          style={{
            padding: R.ERROR_PADDING,
            borderRadius: R.ERROR_RADIUS_PX,
            background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
            fontSize: R.ERROR_FONT_SIZE_PX,
            textAlign: 'left',
            maxHeight: R.ERROR_MAX_HEIGHT_PX,
            overflow: 'auto',
            overflowWrap: 'anywhere',
          }}
        >
          {detail}
        </div>
      ) : null}
    </div>
  );
};

export default TechnicalDetails;
