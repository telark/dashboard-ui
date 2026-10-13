import React from 'react';
import { Form, Tooltip } from 'antd';
import {
  GeneralSection,
  ScopesAndPermissionsSection,
  ValiditySection,
  ProtectionSection,
} from '../sections';
import RoleProtectionView from '../view/RoleProtectionView';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import type { RoleFormValues, RoleFormProps } from '../../../models';

// One tree in both modes: swapping the wrappers on expand remounted every section.
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
  wrapper: Wrapper,
  roles,
  isEditMode = false,
  currentName,
  expanded = false,
  protectionReadOnly = false,
}) => {
  const formContent = (
    <div style={{ width: '100%' }}>
      <Form<RoleFormValues>
        layout="vertical"
        form={form}
        onFinish={onSubmit}
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
                  display: 'flex',
                  flexDirection: expanded ? 'row' : 'column',
                  gap: expanded ? 24 : 18,
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

  return Wrapper ? <Wrapper>{formContent}</Wrapper> : formContent;
};

export default RoleForm;
