import React, { useMemo, useState, useEffect } from 'react';
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
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const deepEqual = (obj1: unknown, obj2: unknown): boolean => {
    // Handle primitive values and same reference
    if (obj1 === obj2) return true;

    // Handle null/undefined
    if (obj1 == null || obj2 == null) {
      return obj1 === obj2;
    }

    // Handle different types
    if (typeof obj1 !== typeof obj2) return false;
    if (typeof obj1 !== 'object') return false;

    // Handle arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => deepEqual(item, obj2[index]));
    }

    // One is array, other is not
    if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

    // Handle objects
    const keys1 = Object.keys(obj1 as Record<string, unknown>);
    const keys2 = Object.keys(obj2 as Record<string, unknown>);

    if (keys1.length !== keys2.length) return false;

    return keys1.every((key) => {
      const val1 = (obj1 as Record<string, unknown>)[key];
      const val2 = (obj2 as Record<string, unknown>)[key];
      return deepEqual(val1, val2);
    });
  };

  const checkFormState = () => {
    if (!isEditMode || !initialValues) return;

    const fieldsError = form.getFieldsError();
    const hasErrors = fieldsError.some((field) => field.errors.length > 0);
    setHasFormErrors(hasErrors);

    const currentValues = form.getFieldsValue();
    
    // Ensure we have values before comparing (form must be initialized)
    if (!currentValues.name || !isInitialized) {
      // If form is not initialized yet, assume no changes
      if (isInitialized) {
        setHasChanges(false);
      }
      return;
    }

    // Normalize values for comparison (handle undefined arrays and ensure consistent structure)
    // Only compare the fields that are actually in the form
    const normalizedCurrent: RoleFormValues = {
      name: currentValues.name || '',
      type: currentValues.type || initialValues.type || 'custom',
      status: currentValues.status || initialValues.status || 'Active',
      scopes: currentValues.scopes || {},
      assignedTo: Array.isArray(currentValues.assignedTo) ? currentValues.assignedTo : [],
    };
    
    const normalizedInitial: RoleFormValues = {
      name: initialValues.name || '',
      type: initialValues.type || 'custom',
      status: initialValues.status || 'Active',
      scopes: initialValues.scopes || {},
      assignedTo: Array.isArray(initialValues.assignedTo) ? initialValues.assignedTo : [],
    };
    
    const changed = !deepEqual(normalizedCurrent, normalizedInitial);
    setHasChanges(changed);
  };

  const handleValuesChange = () => {
    // Trigger validation to ensure async validators complete
    form
      .validateFields()
      .then(() => {
        checkFormState();
      })
      .catch(() => {
        checkFormState();
      });
  };

  const handleFieldsChange = () => {
    // onFieldsChange fires when field status changes (including validation)
    checkFormState();
  };

  // Check form state after form is initialized with values
  useEffect(() => {
    if (isEditMode && initialValues) {
      // Wait for form to be initialized, then check state
      const timer = setTimeout(() => {
        const currentValues = form.getFieldsValue();
        // Check if form has been populated (has at least name field)
        if (currentValues.name) {
          setIsInitialized(true);
          checkFormState();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, initialValues, form]);

  // Also check when form values are set via setFieldsValue
  useEffect(() => {
    if (isEditMode && isInitialized) {
      checkFormState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

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
