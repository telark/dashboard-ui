import React, { useMemo } from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import RoleForm from '../components/display/shared/RoleForm';
import { PageContainer } from '../../../../components/shared';
import type { RoleFormValues, ScopeFormValue } from '../models';
import { useRoleActions, useRoles, useRoleCategories } from '../hooks';
import { convertFormValuesToRoleFormData } from '../utils';

const RoleIcon = Icons.Role;

const CreateRole: React.FC = () => {
  const [form] = Form.useForm<RoleFormValues>();
  const { handleCreate, submitting } = useRoleActions();
  const { roles } = useRoles();
  const { defaultCategoryId } = useRoleCategories();

  const initialScopes = useMemo(() => {
    const scopes: Record<string, ScopeFormValue> = {};
    RC.SCOPE.DEFAULT_AREAS.forEach((area) => {
      scopes[area.key] = {
        level: RC.PERMISSION_LEVEL.READ_ONLY,
        // Rules will be initialized by the form when user selects them
      };
    });
    return scopes;
  }, []);

  const handleFinish = async (values: RoleFormValues) => {
    const roleData = convertFormValuesToRoleFormData(values, 'custom', 'Active');
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
          description: '',
          categoryID: defaultCategoryId,
          type: RC.VALUES.ROLE_TYPE_CUSTOM,
          status: RC.STATUS.ACTIVE,
          scopes: initialScopes,
          validity: {
            type: RC.VALIDITY_TYPES.PERMANENT,
            autoRevoke: true,
          },
          protection: {
            preventDeletion: false,
            preventModification: false,
            preventScopeChanges: false,
            lockName: false,
            lockCategory: false,
            softDelete: false,
          },
          assignedTo: [],
        }}
        onSubmit={handleFinish}
        buttonText={RC.LABELS.CREATE_BUTTON_TEXT}
        submitting={submitting}
        roles={roles}
        isEditMode={false}
      />
    </PageContainer>
  );
};

export default CreateRole;
