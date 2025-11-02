import React from 'react';
import Section from '../../../shared/Section';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import type { RolesGeneralSectionProps } from '../../../../interfaces/roles';
import LabeledInput from '../../../shared/LabeledInput';
import LabeledSelect from '../../../shared/LabeledSelect';

const RolesGeneralSection: React.FC<RolesGeneralSectionProps> = ({ form }) => {
  return (
    <Section
      title={RPC.GENERAL.TITLE}
      subtitle={RPC.GENERAL.SUBTITLE}
      content={
        <>
          <LabeledInput
            name="name"
            label="Role Name"
            required
            placeholder="e.g. Platform Admin"
            marginBottom={15}
          />
          <LabeledSelect
            name="group"
            label="Assigned to Group"
            required
            options={RPC.GENERAL.GROUP_OPTIONS as any}
            placeholder="Select a group"
            marginBottom={6}
          />
        </>
      }
    />
  );
};

export default RolesGeneralSection;


