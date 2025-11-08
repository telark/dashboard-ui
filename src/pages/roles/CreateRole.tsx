import React, { useMemo, useState } from 'react';
import { Form, message } from 'antd';
import { APP_ROUTES, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import RoleForm, { type RoleFormValues } from '../../components/display/roles/shared/RoleForm';
import { PageContainer } from '../../components/shared';
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
    <PageContainer>
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
    </PageContainer>
  );
};

export default CreateRole;
