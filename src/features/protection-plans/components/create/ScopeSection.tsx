import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';

const { SCOPE_TITLE, SCOPE_DESCRIPTION, PLACEHOLDER_SCOPE } = PPC.CREATE_PAGE.SECTIONS;

const ScopeSection: React.FC = memo(() => (
  <SectionCard title={SCOPE_TITLE} description={SCOPE_DESCRIPTION}>
    <div style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>{PLACEHOLDER_SCOPE}</div>
  </SectionCard>
));

ScopeSection.displayName = 'ScopeSection';

export default ScopeSection;
