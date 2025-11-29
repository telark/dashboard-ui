import React, { useMemo } from 'react';
import { Form, Input } from 'antd';
import Section from '../../../../../../components/display/sections/Section';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import { createNameValidator, sanitizeName } from '../../../../../shared';
import { DEFAULT_NAME_VALIDATION_CONFIG } from '../../../../../shared/constants';
import type { Role } from '../../../models';

interface RolesGeneralSectionProps {
  roles: Role[];
  isEditMode?: boolean;
  currentName?: string;
}

const RolesGeneralSection: React.FC<RolesGeneralSectionProps> = ({
  roles,
  isEditMode = false,
  currentName,
}) => {
  const validationConfig = useMemo(
    () => ({
      ...DEFAULT_NAME_VALIDATION_CONFIG,
      minLength: RPC.GENERAL.NAME_VALIDATION.MIN_LENGTH,
      maxLength: RPC.GENERAL.NAME_VALIDATION.MAX_LENGTH,
      duplicateErrorMessage: RPC.GENERAL.NAME_VALIDATION.DUPLICATE_ERROR,
      invalidCharsErrorMessage: RPC.GENERAL.NAME_VALIDATION.INVALID_CHARS_ERROR,
      lengthErrorMessage: RPC.GENERAL.NAME_VALIDATION.LENGTH_ERROR,
    }),
    [],
  );

  const nameValidator = useMemo(
    () =>
      createNameValidator(
        roles,
        (role: Role) => role.name,
        validationConfig,
        isEditMode,
        currentName,
      ),
    [roles, validationConfig, isEditMode, currentName],
  );

  const normalizeName = useMemo(
    () => (value: string) => sanitizeName(value, validationConfig),
    [validationConfig],
  );

  return (
    <Section
      title={RPC.GENERAL.TITLE}
      subtitle={RPC.GENERAL.SUBTITLE}
      content={
        <Form.Item
          name="name"
          label={RPC.GENERAL.NAME_LABEL}
          required
          normalize={normalizeName}
          rules={[
            { required: true, message: `Please enter ${RPC.GENERAL.NAME_LABEL.toLowerCase()}` },
            { validator: nameValidator },
          ]}
          style={{ marginBottom: 6 }}
          className="form-item-compact"
          validateTrigger="onChange"
        >
          <Input placeholder={RPC.GENERAL.NAME_PLACEHOLDER} allowClear />
        </Form.Item>
      }
    />
  );
};

export default RolesGeneralSection;
