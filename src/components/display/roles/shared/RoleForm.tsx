import React from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import PrimaryButton from '../../../buttons/PrimaryButton';
import { BUTTON_TEXTS, ICONS } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import RolesGeneralSection from '../create/GeneralSection';
import RolesScopePermissionsSection from '../create/ScopesAndPermissionsSection';
import type { RoleScopePermission } from '../../../../interfaces/resources/roles';

const RoleIcon = ICONS.ROLE;

export interface RoleFormValues {
  name: string;
  scopes: Record<string, RoleScopePermission[]>;
}

interface RoleFormProps {
  form: FormInstance<RoleFormValues>;
  initialValues: RoleFormValues;
  onSubmit: (values: RoleFormValues) => void;
  buttonText: string;
  submitting?: boolean;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

const RoleForm: React.FC<RoleFormProps> = ({
  form,
  initialValues,
  onSubmit,
  buttonText,
  submitting = false,
  wrapper: Wrapper,
}) => {
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
              <RolesGeneralSection />
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
