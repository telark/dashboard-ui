import React, { memo } from 'react';
import { LabeledInput } from '../../../../components/display/inputs';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../constants/protectionPlans';
import SectionCard from './SectionCard';

const { BASIC_INFO_TITLE, BASIC_INFO_DESCRIPTION } = PPC.CREATE_PAGE.SECTIONS;
const { NAME_LABEL, NAME_PLACEHOLDER, DESCRIPTION_LABEL, DESCRIPTION_PLACEHOLDER } =
  PPC.CREATE_PAGE.FORM;

const BasicInfoSection: React.FC = memo(() => (
  <SectionCard title={BASIC_INFO_TITLE} description={BASIC_INFO_DESCRIPTION}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <LabeledInput
        name="name"
        label={NAME_LABEL}
        placeholder={NAME_PLACEHOLDER}
        required
        marginBottom={12}
      />
      <LabeledInput
        name="description"
        label={DESCRIPTION_LABEL}
        placeholder={DESCRIPTION_PLACEHOLDER}
        marginBottom={0}
      />
    </div>
  </SectionCard>
));

BasicInfoSection.displayName = 'BasicInfoSection';

export default BasicInfoSection;
