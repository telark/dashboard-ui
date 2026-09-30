import React, { useMemo } from 'react';
import { Form, Tooltip } from 'antd';
import { PrimaryButton } from '../../../../../../components/display/buttons';
import { BUTTON_TEXTS, Icons } from '../../../../../../constants';
import {
  GeneralSection,
  ScopesAndPermissionsSection,
  ValiditySection,
  ProtectionSection,
} from '../sections';
import RoleProtectionView from '../view/RoleProtectionView';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import { useRoleFormState } from '../../../hooks';
import type { RoleFormValues, RoleFormProps } from '../../../models';

const RoleIcon = Icons.Role;

const RoleForm: React.FC<RoleFormProps> = ({
  form,
  initialValues,
  onSubmit,
  buttonText,
  submitting = false,
  wrapper: Wrapper,
  roles,
  isEditMode = false,
  currentName,
  hideSubmitButton = false,
  expanded = false,
  protectionReadOnly = false,
}) => {
  const { hasFormErrors, hasChanges, handleValuesChange, handleFieldsChange } = useRoleFormState({
    form,
    isEditMode,
    initialValues,
  });

  const isButtonDisabled = useMemo(() => {
    if (submitting) return true;
    if (isEditMode) return !hasChanges || hasFormErrors;
    return hasFormErrors;
  }, [submitting, isEditMode, hasChanges, hasFormErrors]);

  const formContent = (
    <div style={{ width: '100%' }}>
      <Form<RoleFormValues>
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
        onFieldsChange={handleFieldsChange}
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
                  onManualChange={handleValuesChange}
                />
                <ValiditySection disabled={modificationLocked} />
                {protectionReadOnly ? (
                  <Tooltip title={RC.PROTECTION.READ_ONLY_TOOLTIP}>
                    <div>
                      <RoleProtectionView role={initialValues} />
                    </div>
                  </Tooltip>
                ) : (
                  <ProtectionSection onManualChange={handleValuesChange} />
                )}
              </>
            );
            const rightColumn = (
              <ScopesAndPermissionsSection
                isLocked={preventScopeChanges || modificationLocked}
                onManualChange={handleValuesChange}
                initialValues={initialValues}
              />
            );

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: expanded ? 'row' : 'column',
                  gap: 24,
                  width: '100%',
                  alignItems: expanded ? 'flex-start' : undefined,
                }}
              >
                {expanded ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 18,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {leftColumn}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 18,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {rightColumn}
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
                    {leftColumn}
                    {rightColumn}
                  </div>
                )}
                {!hideSubmitButton && (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                      <PrimaryButton
                        action={buttonText}
                        loading={submitting}
                        loadingLabel={BUTTON_TEXTS.LOADING}
                        onClick={() => form.submit()}
                        icon={<RoleIcon size={16} />}
                        disabled={isButtonDisabled}
                      />
                    </Form.Item>
                  </div>
                )}
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
