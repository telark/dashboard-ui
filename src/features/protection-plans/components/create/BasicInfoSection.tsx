import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';

const { BASIC_INFO_TITLE, BASIC_INFO_DESCRIPTION, PLACEHOLDER_BASIC } = PPC.CREATE_PAGE.SECTIONS;

const BasicInfoSection: React.FC = memo(() => (
  <SectionCard title={BASIC_INFO_TITLE} description={BASIC_INFO_DESCRIPTION}>
    <div style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>{PLACEHOLDER_BASIC}</div>
  </SectionCard>
));

BasicInfoSection.displayName = 'BasicInfoSection';

export default BasicInfoSection;
