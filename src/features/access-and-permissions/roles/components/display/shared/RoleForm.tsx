import React, { useMemo } from 'react';
import { Form } from 'antd';
import { PrimaryButton } from '../../../../../../components/display/buttons';
import { BUTTON_TEXTS, Icons } from '../../../../../../constants';
import { COMPONENT_STYLES } from '../../../../../../constants/layout/ui';
import {
  GeneralSection,
  ScopesAndPermissionsSection,
  ValiditySection,
  ProtectionSection,
  AssignmentSection,
} from '../sections';
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
    <div
      style={{
        ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
        padding: 16,
        width: '100%',
      }}
    >
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

            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 24,
                    alignItems: 'flex-start',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
                    <GeneralSection
                      roles={roles}
                      isEditMode={isEditMode}
                      currentName={currentName}
                      lockName={lockName}
                      lockCategory={lockCategory}
                      onManualChange={handleValuesChange}
                    />
                    <ValiditySection />
                    <ProtectionSection onManualChange={handleValuesChange} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <ScopesAndPermissionsSection
                      isLocked={preventScopeChanges}
                      onManualChange={handleValuesChange}
                      initialValues={initialValues}
                    />
                    <AssignmentSection onManualChange={handleValuesChange} />
                  </div>
                </div>
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
