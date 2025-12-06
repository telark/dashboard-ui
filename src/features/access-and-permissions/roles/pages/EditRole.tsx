import React, { useEffect, useMemo } from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import RoleForm from '../components/display/shared/RoleForm';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../../../components/shared';
import { FancySpinner } from '../../../../components/animation';
import { useDelayedMount } from '../../../../hooks/layout';
import { useRoleDetails, useRoleActions, useRoles, useEditRoleSubmit } from '../hooks';
import type { RoleFormValues } from '../models';
import { convertRoleToFormValues } from '../utils';

const RoleIcon = Icons.Role;

const EditRole: React.FC = () => {
  const { id, role, loading, notFound } = useRoleDetails();
  const { handleUpdate, submitting } = useRoleActions();
  const { roles } = useRoles();
  const [form] = Form.useForm<RoleFormValues>();
  const isComponentLoaded = useDelayedMount();

  const initialValues = useMemo(() => {
    if (!role) return null;
    return convertRoleToFormValues(role);
  }, [role]);

  const { handleSubmit, isSubmitting } = useEditRoleSubmit({
    id: id || '',
    role: role!,
    initialValues: initialValues!,
    form,
    handleUpdate,
  });

  useEffect(() => {
    if (role && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [role, initialValues, form]);

  if (loading) {
    if (!isComponentLoaded) {
      return null;
    }
    return (
      <PageContainer>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 60px)',
            marginTop: '60px',
          }}
        >
          <FancySpinner showLabel={false} size={40} />
        </div>
      </PageContainer>
    );
  }

  if (notFound || !role || !id || !initialValues) {
    return <NotFound message={RC.LABELS.NOT_FOUND} />;
  }

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
        onSubmit={handleSubmit}
        buttonText={RC.LABELS.UPDATE_BUTTON}
        submitting={submitting || isSubmitting}
        wrapper={AnimatedPageWrapper}
        roles={roles}
        isEditMode={true}
        currentName={role.name}
      />
    </PageContainer>
  );
};

export default EditRole;
