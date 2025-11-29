import React from 'react';
import { Form } from 'antd';
import { APP_ROUTES, Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import RoleForm, { type RoleFormValues } from '../components/display/shared/RoleForm';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../../../components/shared';
import { useRoleDetails, useRoleActions } from '../hooks';
import { convertRoleToFormValues, convertFormValuesToRoleFormData } from '../utils/converters';

const RoleIcon = Icons.Role;

const EditRole: React.FC = () => {
  const { id, role, loading, notFound } = useRoleDetails();
  const { handleUpdate, submitting } = useRoleActions();
  const [form] = Form.useForm<RoleFormValues>();

  if (loading) {
    return <PageContainer>Loading...</PageContainer>;
  }

  if (notFound || !role || !id) {
    return <NotFound message={RC.LABELS.NOT_FOUND} />;
  }

  const initialValues = convertRoleToFormValues(role);

  const handleFinish = async (values: RoleFormValues) => {
    const roleData = convertFormValuesToRoleFormData(values, role.type, role.status);
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
      />
    </PageContainer>
  );
};

export default EditRole;
