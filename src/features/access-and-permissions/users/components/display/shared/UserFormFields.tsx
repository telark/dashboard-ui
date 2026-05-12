import React from 'react';
import LabeledInput from '../../../../../../components/display/inputs/LabeledInput';
import { USERS_CONSTANTS as UC } from '../../../constants';

interface UserFormFieldsProps {
  usernameRules?: any[];
  emailRules?: any[];
}

const UserFormFields: React.FC<UserFormFieldsProps> = ({ usernameRules = [], emailRules = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <LabeledInput
        name="username"
        label={UC.LABELS.FORM.FIELDS.USERNAME_LABEL}
        required
        placeholder={UC.LABELS.FORM.FIELDS.USERNAME_PLACEHOLDER}
        marginBottom={16}
        rules={usernameRules}
        validateTrigger="onChange"
      />
      <LabeledInput
        name="email"
        label={UC.LABELS.FORM.FIELDS.EMAIL_LABEL}
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
