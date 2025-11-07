import React from 'react';
import Section from '../shared/Section';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import LabeledSelect from '../../shared/inputs/LabeledSelect';

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
