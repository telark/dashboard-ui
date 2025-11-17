import React, { useMemo, useState } from 'react';
import { Form, message } from 'antd';
import { APP_ROUTES, Icons } from '../../constants';
import { ROLES_PAGE_CONSTANTS as RC } from '../../constants/pages/roles';
import Header from '../../components/display/shared/sections/Header';
import RoleForm, { type RoleFormValues } from '../../components/display/roles/shared/RoleForm';
import { PageContainer } from '../../components/shared';
import type { RoleScopePermission } from '../../interfaces/resources/roles';

const RoleIcon = Icons.ROLE;

const CreateRole: React.FC = () => {
  const [form] = Form.useForm<RoleFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const initialScopes = useMemo(() => ({}) as Record<string, RoleScopePermission[]>, []);

  const handleFinish = async (values: RoleFormValues) => {
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      message.success(RC.LABELS.MESSAGES.CREATED(values.name));
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header
        subtitle={RC.LABELS.CREATE_SUBTITLE}
        breadcrumbs={[
          { label: RC.LABELS.BREADCRUMBS.ROLES, to: APP_ROUTES.ROLES },
          { label: RC.LABELS.BREADCRUMBS.CREATE },
        ]}
        icon={<RoleIcon />}
      />

      <RoleForm
        form={form}
        initialValues={{ name: '', scopes: initialScopes }}
        onSubmit={handleFinish}
        buttonText={RC.LABELS.CREATE_BUTTON_TEXT}
        submitting={submitting}
      />
    </PageContainer>
  );
};

export default CreateRole;
