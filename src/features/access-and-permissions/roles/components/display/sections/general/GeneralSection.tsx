import React, { memo } from 'react';
import { Form, Select, Tooltip } from 'antd';
import Section from '../../../../../../../components/display/sections/Section';
import { LabeledInput } from '../../../../../../../components/display/inputs';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';
import type { RolesGeneralSectionProps } from '../../../../models';
import { useRoleCategories, useNameValidation } from '../../../../hooks';
import { INPUT_LIMITS, SPACING } from '../../../../../../../constants';

const RolesGeneralSection: React.FC<RolesGeneralSectionProps> = memo(
  ({
    roles,
    isEditMode = false,
    currentName,
    lockName = false,
    lockCategory = false,
    disabled = false,
  }) => {
    const { categoryOptions } = useRoleCategories();
    const { nameValidator, normalizeName } = useNameValidation({ roles, isEditMode, currentName });

    const categoryLabel = lockCategory ? (
      <Tooltip title={RPC.GENERAL.LOCK_CATEGORY_TOOLTIP}>
        <span>{RPC.GENERAL.CATEGORY_LABEL}</span>
      </Tooltip>
    ) : (
      RPC.GENERAL.CATEGORY_LABEL
    );

    return (
      <Section
        title={RPC.GENERAL.TITLE}
        subtitle={RPC.GENERAL.SUBTITLE}
        content={
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.NONE }}>
            <LabeledInput
              name="name"
              label={RPC.GENERAL.NAME_LABEL}
              maxLength={INPUT_LIMITS.ROLE_NAME.MAX}
              required
              normalize={normalizeName}
              rules={[{ validator: nameValidator }]}
              marginBottom={12}
              validateTrigger="onChange"
              tooltip={lockName ? RPC.GENERAL.LOCK_NAME_TOOLTIP : undefined}
              placeholder={RPC.GENERAL.NAME_PLACEHOLDER}
              disabled={lockName || disabled}
            />
            <LabeledInput
              name="description"
              label={RPC.GENERAL.DESCRIPTION_LABEL}
              maxLength={INPUT_LIMITS.ROLE_DESCRIPTION.MAX}
              required
              placeholder={RPC.GENERAL.DESCRIPTION_PLACEHOLDER}
              marginBottom={12}
              disabled={disabled}
            />
            <Form.Item
              label={categoryLabel}
              name="categoryRef"
              rules={[
                {
                  required: true,
                  message: `Please select ${RPC.GENERAL.CATEGORY_LABEL.toLowerCase()}`,
                },
              ]}
              required
              style={{ marginBottom: SPACING.NONE }}
              className="form-item-compact no-asterisk"
            >
              <Select
                notFoundContent={RPC.GENERAL.CATEGORY_EMPTY}
                placeholder={RPC.GENERAL.CATEGORY_PLACEHOLDER}
                options={categoryOptions}
                disabled={lockCategory || disabled}
              />
            </Form.Item>
          </div>
        }
      />
    );
  },
);

RolesGeneralSection.displayName = 'RolesGeneralSection';

export default RolesGeneralSection;
