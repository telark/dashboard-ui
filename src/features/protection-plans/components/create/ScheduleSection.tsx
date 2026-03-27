import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';

const { SCHEDULE_TITLE, SCHEDULE_DESCRIPTION, PLACEHOLDER_SCHEDULE } = PPC.CREATE_PAGE.SECTIONS;

const ScheduleSection: React.FC = memo(() => (
  <SectionCard title={SCHEDULE_TITLE} description={SCHEDULE_DESCRIPTION}>
    <div style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_MUTED }}>{PLACEHOLDER_SCHEDULE}</div>
  </SectionCard>
));

ScheduleSection.displayName = 'ScheduleSection';

export default ScheduleSection;
