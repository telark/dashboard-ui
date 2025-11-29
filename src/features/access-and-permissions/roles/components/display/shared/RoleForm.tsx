import React, { useMemo, useState } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import { PrimaryButton } from '../../../../../../components/display/buttons';
import { BUTTON_TEXTS, Icons } from '../../../../../../constants';
import { COMPONENT_STYLES } from '../../../../../../constants/layout/ui';
import RolesGeneralSection from '../create/GeneralSection';
import RolesScopePermissionsSection from '../create/ScopesAndPermissionsSection';
import AssignmentSection from './AssignmentSection';
import type { RoleScopePermission } from '../../../constants';
import type { Role } from '../../../models';

const RoleIcon = Icons.Role;

export interface RoleFormValues {
  name: string;
  type?: string;
  status?: string;
  scopes: Record<string, RoleScopePermission[]>;
  assignedTo?: string[];
}

interface RoleFormProps {
  form: FormInstance<RoleFormValues>;
  initialValues: RoleFormValues;
  onSubmit: (values: RoleFormValues) => void;
  buttonText: string;
  submitting?: boolean;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  roles: Role[];
  isEditMode?: boolean;
  currentName?: string;
}

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
  const [hasFormErrors, setHasFormErrors] = useState(false);
  const [hasChanges, setHasChanges] = useState(!isEditMode);

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
        onValuesChange={() => {
          const fieldsError = form.getFieldsError();
          const hasErrors = fieldsError.some((field) => field.errors.length > 0);
          setHasFormErrors(hasErrors);

          if (isEditMode) {
            const currentValues = form.getFieldsValue();
            const changed =
              currentValues.name !== initialValues.name ||
              currentValues.type !== initialValues.type ||
              currentValues.status !== initialValues.status ||
              JSON.stringify(currentValues.scopes) !== JSON.stringify(initialValues.scopes) ||
              JSON.stringify(currentValues.assignedTo || []) !==
                JSON.stringify(initialValues.assignedTo || []);
            setHasChanges(changed);
          }
        }}
      >
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
              <RolesGeneralSection
                roles={roles}
                isEditMode={isEditMode}
                currentName={currentName}
              />
              <AssignmentSection />
            </div>
            <div style={{ flex: 1 }}>
              <RolesScopePermissionsSection />
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
      </Form>
    </div>
  );

  return Wrapper ? <Wrapper>{formContent}</Wrapper> : formContent;
};

export default RoleForm;
