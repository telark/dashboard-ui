import React, { useEffect, useMemo } from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import RoleForm from '../components/display/shared/RoleForm';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../../../components/shared';
import { useRoleDetails, useRoleActions, useRoles } from '../hooks';
import type { RoleFormValues } from '../models';
import { convertRoleToFormValues, convertFormValuesToRoleFormData } from '../utils';

const RoleIcon = Icons.Role;

const EditRole: React.FC = () => {
  const { id, role, loading, notFound } = useRoleDetails();
  const { handleUpdate, submitting } = useRoleActions();
  const { roles } = useRoles();
  const [form] = Form.useForm<RoleFormValues>();

  const initialValues = useMemo(() => {
    if (!role) return null;
    return convertRoleToFormValues(role);
  }, [role]);

  useEffect(() => {
    if (role && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [role, initialValues, form]);

  if (loading) {
    return <PageContainer>Loading...</PageContainer>;
  }

  if (notFound || !role || !id || !initialValues) {
    return <NotFound message={RC.LABELS.NOT_FOUND} />;
  }

  const handleFinish = async (values: RoleFormValues) => {
    const allFormValues = form.getFieldsValue(true) as RoleFormValues;
    const finalValues: RoleFormValues = {
      ...allFormValues,
      ...values,
    };

    const fullRoleData = convertFormValuesToRoleFormData(finalValues, role.type, role.status);

    // Create partial update payload, excluding fields that are locked by protection flags
    const roleData: Partial<typeof fullRoleData> = {};

    // Only include fields that are not locked
    if (!role.protection?.lockName) {
      roleData.name = fullRoleData.name;
    }
    if (fullRoleData.description !== undefined) {
      roleData.description = fullRoleData.description;
    }
    if (!role.protection?.lockCategory) {
      roleData.categoryID = fullRoleData.categoryID;
    }
    if (fullRoleData.type !== undefined) {
      roleData.type = fullRoleData.type;
    }
    if (fullRoleData.status !== undefined) {
      roleData.status = fullRoleData.status;
    }
    if (!role.protection?.preventScopeChanges) {
      roleData.scopesAndPermissions = fullRoleData.scopesAndPermissions;
    }
    if (fullRoleData.validity !== undefined) {
      roleData.validity = fullRoleData.validity;
    }
    if (fullRoleData.protection !== undefined) {
      roleData.protection = fullRoleData.protection;
    }
    if (fullRoleData.assignedTo !== undefined) {
      roleData.assignedTo = fullRoleData.assignedTo;
    }

    await handleUpdate(id, roleData);
  };

  const breadcrumbs = [
    { label: RC.LABELS.BREADCRUMBS.ROLES, to: APP_ROUTES.ROLES },
    { label: role.name },
    { label: RC.LABELS.BREADCRUMBS.EDIT },
  ];

  return (
    <PageContainer>
      <Header subtitle={RC.LABELS.EDIT_SUBTITLE} breadcrumbs={breadcrumbs} icon={<RoleIcon />} />

      <RoleForm
        form={form}
        initialValues={initialValues}
        onSubmit={handleFinish}
        buttonText={RC.LABELS.UPDATE_BUTTON}
        submitting={submitting}
        wrapper={AnimatedPageWrapper}
        roles={roles}
        isEditMode={true}
        currentName={role.name}
      />
    </PageContainer>
  );
};

export default EditRole;
