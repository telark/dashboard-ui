import React, { useMemo, useState } from 'react';
import { Button, Form, message } from 'antd';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import { COMPONENT_STYLES } from '../../constants/ui';
import RolesHeader from '../../components/display/roles/shared/Header';
import { useNavigate } from 'react-router-dom';
import RolesGeneralSection from '../../components/display/roles/create/GeneralSection';
import RolesScopePermissionsSection from '../../components/display/roles/create/ScopesAndPermissionsSection';

type RoleScopeLevel = 'View' | 'Edit' | 'Delete';

interface CreateRoleFormValues {
  name: string;
  group: string;
  scopes: Record<string, RoleScopeLevel[]>; // area -> levels
}

const CreateRole: React.FC = () => {
  const [form] = Form.useForm<CreateRoleFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const initialScopes = useMemo(() => ({} as Record<string, RoleScopeLevel[]>), []);

  const handleFinish = async (values: CreateRoleFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      message.success(`Role "${values.name}" created`);
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: '48px 24px 24px',
        marginTop: '60px',
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: 'calc(100vh - 60px)',
      }}
      className="app-root"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <RolesHeader
          subtitle="Create a new role"
          breadcrumbs={[{ label: 'Roles', to: APP_ROUTES.ROLES }, { label: 'Create Role' }]}
        />

        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<CreateRoleFormValues>
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            initialValues={{ group: 'default', scopes: initialScopes }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 16, alignItems: 'start' }}>
              <RolesGeneralSection form={form} />
              <RolesScopePermissionsSection form={form} />
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Save Role
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;


