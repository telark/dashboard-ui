import React from 'react';
import { Form, Tooltip } from 'antd';
import {
  GeneralSection,
  ScopesAndPermissionsSection,
  ValiditySection,
  ProtectionSection,
} from '../sections';
import RoleProtectionView from '../view/RoleProtectionView';
import { ROLES_CONSTANTS as RC, ROLES_ERROR_MESSAGES } from '../../../constants';
import type { RoleFormValues, RoleFormProps } from '../../../models';
import { SPACING } from '../../../../../../constants';
import logger from '../../../../../../logging';

// One tree in both modes: swapping the wrappers on expand remounted every section.
// Off scale, kept exact: gap 18 (LG to XL).
const COLUMN: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  flex: 1,
  minWidth: 0,
};

const RoleForm: React.FC<RoleFormProps> = ({
  form,
  initialValues,
  onSubmit,
  roles,
  isEditMode = false,
  currentName,
  expanded = false,
  protectionReadOnly = false,
}) => {
  // onSubmit has shown the refusal and skipped closing the panel, so the rejection ends here.
  const handleFinish = (values: RoleFormValues) => {
    onSubmit(values).catch((error: unknown) => {
      logger.error(ROLES_ERROR_MESSAGES.FORM_SUBMIT_FAILED, error);
    });
  };

  const formContent = (
    <div style={{ width: '100%' }}>
      <Form<RoleFormValues>
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        initialValues={initialValues}
      >
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currValues) => {
            if (!isEditMode) return false;
            const prevProtection = prevValues?.protection;
            const currProtection = currValues?.protection;
            return (
              prevProtection?.preventModification !== currProtection?.preventModification ||
              prevProtection?.preventScopeChanges !== currProtection?.preventScopeChanges ||
              prevProtection?.lockName !== currProtection?.lockName ||
              prevProtection?.lockCategory !== currProtection?.lockCategory
            );
          }}
        >
          {({ getFieldValue }) => {
            const preventScopeChanges = isEditMode
              ? getFieldValue(['protection', 'preventScopeChanges']) || false
              : false;
            const lockName = isEditMode
              ? getFieldValue(['protection', 'lockName']) || false
              : false;
            const lockCategory = isEditMode
              ? getFieldValue(['protection', 'lockCategory']) || false
              : false;
            // A stored preventModification leaves only protection editable until the form lifts it.
            const modificationLocked =
              isEditMode &&
              Boolean(initialValues.protection?.preventModification) &&
              Boolean(getFieldValue(['protection', 'preventModification']));

            const leftColumn = (
              <>
                <GeneralSection
                  roles={roles}
                  isEditMode={isEditMode}
                  currentName={currentName}
                  lockName={lockName}
                  lockCategory={lockCategory}
                  disabled={modificationLocked}
                />
                <ValiditySection disabled={modificationLocked} />
                {protectionReadOnly ? (
                  <Tooltip title={RC.PROTECTION.READ_ONLY_TOOLTIP}>
                    <div>
                      <RoleProtectionView role={initialValues} />
                    </div>
                  </Tooltip>
                ) : (
                  <ProtectionSection />
                )}
              </>
            );
            const rightColumn = (
              <ScopesAndPermissionsSection
                isLocked={preventScopeChanges || modificationLocked}
                initialValues={initialValues}
              />
            );

            return (
              <div
                style={{
                  // Off scale, kept exact: gap 18 (LG to XL).
                  display: 'flex',
                  flexDirection: expanded ? 'row' : 'column',
                  gap: expanded ? SPACING.XXL : 18,
                  width: '100%',
                  alignItems: expanded ? 'flex-start' : undefined,
                }}
              >
                <div style={COLUMN}>{leftColumn}</div>
                <div style={COLUMN}>{rightColumn}</div>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    </div>
  );

  return formContent;
};

export default RoleForm;
