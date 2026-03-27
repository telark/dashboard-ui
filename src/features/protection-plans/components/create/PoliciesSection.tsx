import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';

const { POLICIES_TITLE, POLICIES_DESCRIPTION, PLACEHOLDER_POLICIES } = PPC.CREATE_PAGE.SECTIONS;

const PoliciesSection: React.FC = memo(() => (
  <SectionCard title={POLICIES_TITLE} description={POLICIES_DESCRIPTION}>
    <div style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>{PLACEHOLDER_POLICIES}</div>
  </SectionCard>
));

PoliciesSection.displayName = 'PoliciesSection';

export default PoliciesSection;
