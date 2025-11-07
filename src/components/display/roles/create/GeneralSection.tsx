import React from 'react';
import Section from '../shared/Section';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import LabeledInput from '../../shared/inputs/LabeledInput';

const RolesGeneralSection: React.FC = () => {
  return (
    <Section
      title={RPC.GENERAL.TITLE}
      subtitle={RPC.GENERAL.SUBTITLE}
      content={
        <LabeledInput
          name="name"
          label="Role Name"
          required
          placeholder="e.g. Platform Admin"
          marginBottom={6}
        />
      }
    />
  );
};

export default RolesGeneralSection;
