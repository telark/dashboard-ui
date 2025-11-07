import React, { useMemo, useState } from 'react';
import { Form, message } from 'antd';
import { DEFAULT_COLORS, APP_ROUTES, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import RoleForm, { type RoleFormValues } from '../../components/display/roles/shared/RoleForm';
import type { RoleScopePermission } from '../../interfaces/roles';

const RoleIcon = ICONS.ROLE;

const CreateRole: React.FC = () => {
  const [form] = Form.useForm<RoleFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const initialScopes = useMemo(() => ({}) as Record<string, RoleScopePermission[]>, []);

  const handleFinish = async (values: RoleFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      message.success(`Role "${values.name}" created`);
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

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
        <Header
          subtitle="Create a new role"
          breadcrumbs={[{ label: 'Roles', to: APP_ROUTES.ROLES }, { label: 'Create Role' }]}
          icon={<RoleIcon />}
        />

        <RoleForm
          form={form}
          initialValues={{ name: '', scopes: initialScopes }}
          onSubmit={handleFinish}
          buttonText="Create Role"
          submitting={submitting}
        />
      </div>
    </div>
  );
};

export default CreateRole;
