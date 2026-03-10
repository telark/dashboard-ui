import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../../constants';
import { ThemeOptionCard, DensityOptionCard, FontSizeOptionCard } from './options';

const { CONTENT } = SETTINGS_CONSTANTS;

const AppearanceSectionContent: React.FC = memo(() => (
  <>
    <ThemeOptionCard />
    <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
      <DensityOptionCard />
    </div>
    <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
      <FontSizeOptionCard />
    </div>
  </>
));

AppearanceSectionContent.displayName = 'AppearanceSectionContent';

export default AppearanceSectionContent;
