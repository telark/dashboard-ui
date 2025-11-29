import React from 'react';
import Section from '../../../../../../components/display/sections/Section';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';

const RolesGeneralSection: React.FC = () => {
  return (
    <Section
      title={RPC.GENERAL.TITLE}
      subtitle={RPC.GENERAL.SUBTITLE}
      content={
        <LabeledInput
          name="name"
          label={RPC.GENERAL.NAME_LABEL}
          required
          placeholder={RPC.GENERAL.NAME_PLACEHOLDER}
          marginBottom={6}
        />
      }
    />
  );
};

export default RolesGeneralSection;
