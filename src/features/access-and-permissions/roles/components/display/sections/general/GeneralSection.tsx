import React, { memo } from 'react';
import Section from '../../../../../../../components/display/sections/Section';
import { LabeledInput, LabeledSelect } from '../../../../../../../components/display/inputs';
import { ROLES_CONSTANTS as RPC } from '../../../../constants';
import type { RolesGeneralSectionProps } from '../../../../models';
import { useRoleCategories } from '../../../../hooks';
import { useNameValidation } from '../../../../hooks/useNameValidation';
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
              validateTrigger={['onBlur', 'onSubmit']}
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
            <LabeledSelect
              name="categoryID"
              label={RPC.GENERAL.CATEGORY_LABEL}
              placeholder={RPC.GENERAL.CATEGORY_PLACEHOLDER}
              required
              options={categoryOptions}
              marginBottom={0}
              disabled={lockCategory}
              tooltip={lockCategory ? RPC.GENERAL.LOCK_CATEGORY_TOOLTIP : undefined}
            />
          </div>
        }
      />
    );
  },
);

RolesGeneralSection.displayName = 'RolesGeneralSection';

export default RolesGeneralSection;
