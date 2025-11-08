import React from 'react';
import { APP_ROUTES, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import RoleForm, { type RoleFormValues } from '../../components/display/roles/shared/RoleForm';
import { STATIC_ROLES } from '../../data/roles';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useEditPage } from '../../hooks/useEditPage';
import type { Role } from '../../interfaces/roles';

const RoleIcon = ICONS.ROLE;

const EditRole: React.FC = () => {
  const { item: role, form, submitting, handleFinish, notFound } = useEditPage<
    Role,
    RoleFormValues
  >({
    data: STATIC_ROLES,
    findById: (id, data) => data.find((r) => r.id === id),
    getFormValues: (item) => ({
      name: item.name,
      scopes: item.scopes,
    }),
    onUpdate: async (id, values) => {
      await new Promise((r) => setTimeout(r, 400));
    },
    successMessage: (name) => `Role "${name}" updated`,
    viewRoute: (id) => `${APP_ROUTES.ROLES}/${id}/view`,
  });

  if (notFound || !role) {
    return <NotFound message="Role not found" />;
  }

  const breadcrumbs = [
    { label: 'Roles', to: APP_ROUTES.ROLES },
    { label: role.name },
    { label: 'Edit' },
  ];

  return (
    <PageContainer>
      <Header subtitle="Edit role details" breadcrumbs={breadcrumbs} icon={<RoleIcon />} />

      <RoleForm
        form={form}
        initialValues={{ name: role.name, scopes: role.scopes }}
        onSubmit={handleFinish}
        buttonText="Update Role"
        submitting={submitting}
        wrapper={AnimatedPageWrapper}
      />
    </PageContainer>
  );
};

export default EditRole;
