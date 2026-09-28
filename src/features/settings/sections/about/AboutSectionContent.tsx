import React, { memo } from 'react';
import { Typography } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import SettingsCard from '../../components/SettingsCard';
import LicensesCard from './components/LicensesCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import { ABOUT_SECTION_CONSTANTS } from './constants';

declare const __APP_VERSION__: string;

const { CONTENT } = SETTINGS_CONSTANTS;
const { LABELS, LINKS } = ABOUT_SECTION_CONSTANTS;

const AboutSectionContent: React.FC = memo(() => (
  <>
    <SettingsCard title={LABELS.VERSION_CARD_TITLE} description={LABELS.VERSION_CARD_DESCRIPTION}>
      {__APP_VERSION__}
    </SettingsCard>
    <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
      <SettingsCard title={LABELS.DOCS_CARD_TITLE} description={LABELS.DOCS_CARD_DESCRIPTION}>
        <Typography.Link
          href={LINKS.DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: DEFAULT_COLORS.SUCCESS, flexShrink: 0 }}
        >
          {LABELS.DOCS_LINK_TEXT}
        </Typography.Link>
      </SettingsCard>
    </div>
    <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
      <LicensesCard />
    </div>
  </>
));

AboutSectionContent.displayName = 'AboutSectionContent';

export default AboutSectionContent;
