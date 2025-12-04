import React, { useMemo, memo } from 'react';
import { Form, Input } from 'antd';
import Section from '../../../../../../../components/display/sections/Section';
import LabeledInput from '../../../../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../../../../components/display/inputs/LabeledSelect';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';
import { createNameValidator, sanitizeName } from '../../../../../../shared';
import { DEFAULT_NAME_VALIDATION_CONFIG } from '../../../../../../shared/constants';
import type { Role, RolesGeneralSectionProps } from '../../../../models';
import { useRoleCategories } from '../../../../hooks';

const RolesGeneralSection: React.FC<RolesGeneralSectionProps> = memo(
  ({ roles, isEditMode = false, currentName }) => {
    const { categoryOptions } = useRoleCategories();

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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <Form.Item
              name="name"
              label={RPC.GENERAL.NAME_LABEL}
              required
              normalize={normalizeName}
              rules={[
                { required: true, message: `Please enter ${RPC.GENERAL.NAME_LABEL.toLowerCase()}` },
                { validator: nameValidator },
              ]}
              style={{ marginBottom: 12 }}
              className="form-item-compact"
              validateTrigger="onChange"
            >
              <Input placeholder={RPC.GENERAL.NAME_PLACEHOLDER} allowClear />
            </Form.Item>
            <LabeledInput
              name="description"
              label={RPC.GENERAL.DESCRIPTION_LABEL}
              required
              placeholder={RPC.GENERAL.DESCRIPTION_PLACEHOLDER}
              marginBottom={12}
            />
            <LabeledSelect
              name="categoryID"
              label={RPC.GENERAL.CATEGORY_LABEL}
              placeholder={RPC.GENERAL.CATEGORY_PLACEHOLDER}
              required
              options={categoryOptions}
              marginBottom={0}
            />
          </div>
        }
      />
    );
  },
);

RolesGeneralSection.displayName = 'RolesGeneralSection';

export default RolesGeneralSection;
