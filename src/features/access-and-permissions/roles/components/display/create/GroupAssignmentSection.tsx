import React from 'react';
import Section from '../../../../../../components/display/shared/sections/Section';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import LabeledSelect from '../../../../../../components/display/shared/inputs/LabeledSelect';

const GroupAssignmentSection: React.FC = () => {
  return (
    <Section
      title="Group Assignment"
      subtitle="Select which group this role belongs to."
      content={
        <LabeledSelect
          name="group"
          label="Assigned to Group"
          required
          options={RPC.GENERAL.GROUP_OPTIONS as any}
          placeholder="Select a group"
          marginBottom={6}
        />
      }
    />
  );
};

export default GroupAssignmentSection;
