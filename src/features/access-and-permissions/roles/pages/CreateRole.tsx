import React, { useMemo } from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import RoleForm, { type RoleFormValues } from '../components/display/shared/RoleForm';
import { PageContainer } from '../../../../components/shared';
import type { RoleScopePermission } from '../constants';
import { useRoleActions } from '../hooks';
import { convertFormValuesToRoleFormData } from '../utils/converters';

const RoleIcon = Icons.Role;

const CreateRole: React.FC = () => {
  const [form] = Form.useForm<RoleFormValues>();
  const { handleCreate, submitting } = useRoleActions();

  const initialScopes = useMemo(() => {
    const scopes: Record<string, RoleScopePermission[]> = {};
    RC.SCOPE.DEFAULT_AREAS.forEach((area) => {
      scopes[area.key] = [];
    });
    return scopes;
  }, []);

  const handleFinish = async (values: RoleFormValues) => {
    const roleData = convertFormValuesToRoleFormData(values);
    await handleCreate(roleData);
    form.resetFields();
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
        initialValues={{
          name: '',
          type: RC.VALUES.ROLE_TYPE_CUSTOM,
          status: RC.STATUS.ACTIVE,
          scopes: initialScopes,
        }}
        onSubmit={handleFinish}
        buttonText={RC.LABELS.CREATE_BUTTON_TEXT}
        submitting={submitting}
      />
    </PageContainer>
  );
};

export default CreateRole;
