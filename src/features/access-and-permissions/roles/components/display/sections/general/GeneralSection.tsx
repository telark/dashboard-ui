import React, { memo } from 'react';
import { Form, Select, Tooltip } from 'antd';
import Section from '../../../../../../../components/display/sections/Section';
import { LabeledInput } from '../../../../../../../components/display/inputs';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';
import type { RolesGeneralSectionProps } from '../../../../models';
import { useRoleCategories, useNameValidation } from '../../../../hooks';
import { FieldChangeWatcher } from './FieldChangeWatcher';

const RolesGeneralSection: React.FC<RolesGeneralSectionProps> = memo(
  ({
    roles,
    isEditMode = false,
    currentName,
    lockName = false,
    lockCategory = false,
    onManualChange,
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <FieldChangeWatcher fieldName="name" onChange={onManualChange} />
            <LabeledInput
              name="name"
              label={RPC.GENERAL.NAME_LABEL}
              required
              normalize={normalizeName}
              rules={[{ validator: nameValidator }]}
              marginBottom={12}
              validateTrigger="onChange"
              tooltip={lockName ? RPC.GENERAL.LOCK_NAME_TOOLTIP : undefined}
              placeholder={RPC.GENERAL.NAME_PLACEHOLDER}
              disabled={lockName}
            />
            <LabeledInput
              name="description"
              label={RPC.GENERAL.DESCRIPTION_LABEL}
              required
              placeholder={RPC.GENERAL.DESCRIPTION_PLACEHOLDER}
              marginBottom={12}
            />
            <FieldChangeWatcher fieldName="categoryID" onChange={onManualChange} />
            <Form.Item
              label={categoryLabel}
              name="categoryID"
              rules={[
                {
                  required: true,
                  message: `Please select ${RPC.GENERAL.CATEGORY_LABEL.toLowerCase()}`,
                },
              ]}
              required
              style={{ marginBottom: 0 }}
              className="form-item-compact no-asterisk"
            >
              <Select
                placeholder={RPC.GENERAL.CATEGORY_PLACEHOLDER}
                options={categoryOptions}
                disabled={lockCategory}
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
