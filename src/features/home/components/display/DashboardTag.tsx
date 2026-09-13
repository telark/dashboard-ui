import React from 'react';
import RowTag from '../../../../components/display/table/RowTag';
import { HOME_DASHBOARD_LAYOUT as L, HOME_TAG_TONE_COLORS } from '../../constants/dashboard';
import type { DashboardTagData } from '../../models';

const DashboardTag: React.FC<DashboardTagData> = ({ text, tone }) => (
  <RowTag
    text={text}
    fontSize={L.TAG_FONT_SIZE_PX}
    capitalize={false}
    {...HOME_TAG_TONE_COLORS[tone]}
  />
);

export default DashboardTag;
