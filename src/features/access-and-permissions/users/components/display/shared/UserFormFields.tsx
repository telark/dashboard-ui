import React from 'react';
import type { Rule } from 'antd/es/form';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { sanitizeUsername } from '../../../utils';
import { INPUT_LIMITS, SPACING } from '../../../../../../constants';

interface UserFormFieldsProps {
  usernameRules?: Rule[];
  emailRules?: Rule[];
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ usernameRules = [], emailRules = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.NONE }}>
      <LabeledInput
        name="username"
        label={UC.LABELS.FORM.FIELDS.USERNAME_LABEL}
        maxLength={INPUT_LIMITS.USERNAME.MAX}
        required
        placeholder={UC.LABELS.FORM.FIELDS.USERNAME_PLACEHOLDER}
        marginBottom={16}
        rules={usernameRules}
        normalize={sanitizeUsername}
        validateTrigger="onChange"
      />
      <LabeledInput
        name="email"
        label={UC.LABELS.FORM.FIELDS.EMAIL_LABEL}
        maxLength={INPUT_LIMITS.EMAIL.MAX}
        required
        placeholder={UC.LABELS.FORM.FIELDS.EMAIL_PLACEHOLDER}
        marginBottom={0}
        rules={emailRules}
        validateTrigger="onChange"
      />
    </div>
  );
};

export default UserFormFields;
