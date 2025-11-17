import React from 'react';
import { APP_ROUTES, Icons } from '../../constants';
import { ROLES_PAGE_CONSTANTS as RC } from '../../constants/pages/roles';
import Header from '../../components/display/shared/sections/Header';
import RoleForm, { type RoleFormValues } from '../../components/display/roles/shared/RoleForm';
import { STATIC_ROLES } from '../../data/roles';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useEditPage } from '../../hooks/layout';
import type { Role } from '../../interfaces/resources/roles';

const RoleIcon = Icons.ROLE;

const EditRole: React.FC = () => {
  const {
    item: role,
    form,
    submitting,
    handleFinish,
    notFound,
  } = useEditPage<Role, RoleFormValues>({
    data: STATIC_ROLES,
    findById: (id, data) => data.find((r) => r.id === id),
    getFormValues: (item) => ({
      name: item.name,
      scopes: item.scopes,
    }),
    onUpdate: async () => {
      await new Promise((r) => setTimeout(r, 400));
    },
    successMessage: RC.LABELS.MESSAGES.UPDATED,
    viewRoute: (id) => `${APP_ROUTES.ROLES}/${id}/view`,
  });

  if (notFound || !role) {
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
        initialValues={{ name: role.name, scopes: role.scopes }}
        onSubmit={handleFinish}
        buttonText={RC.LABELS.UPDATE_BUTTON}
        submitting={submitting}
        wrapper={AnimatedPageWrapper}
      />
    </PageContainer>
  );
};

export default EditRole;
