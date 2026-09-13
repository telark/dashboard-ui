import React from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { HOME_DASHBOARD_LAYOUT as L, HOME_DASHBOARD_STYLES as S } from '../../constants/dashboard';

interface BigValueProps {
  value: React.ReactNode;
  caption?: string;
}

const BigValue: React.FC<BigValueProps> = ({ value, caption }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', gap: L.BIG_VALUE_CAPTION_GAP_PX }}>
    <div
      style={{
        fontSize: L.BIG_VALUE_FONT_SIZE_PX,
        fontWeight: 700,
        color: DEFAULT_COLORS.TEXT_PRIMARY,
        lineHeight: 1.1,
      }}
    >
      {value}
    </div>
    {caption ? <div style={S.MUTED_TEXT}>{caption}</div> : null}
  </div>
);

export default BigValue;
