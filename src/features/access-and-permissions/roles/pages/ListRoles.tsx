import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import RolesTable from '../components/display/list/Table';
import { PageContainer } from '../../../../components/shared';
import { useRoles } from '../hooks';
import type { Role } from '../models';

const RoleIcon = Icons.Role;
const RolesList: React.FC = () => {
  const navigate = useNavigate();
  const { roles, loading } = useRoles();
  const handleView = (record: Role) => navigate(`${APP_ROUTES.ROLES}/${record.id}/view`);

  return (
    <PageContainer>
      <Header
        subtitle={RC.LABELS.HEADER_SUBTITLE}
        primaryText={RC.LABELS.CREATE_BUTTON}
        onPrimary={() => navigate(APP_ROUTES.ROLE_CREATE)}
        breadcrumbs={[{ label: RC.LABELS.BREADCRUMBS.ROLES }]}
        icon={<RoleIcon />}
      />

      <RolesTable
        roles={roles}
        onView={handleView}
        onEdit={(record) => navigate(`${APP_ROUTES.ROLES}/${record.id}/edit`)}
        loading={loading}
      />
    </PageContainer>
  );
};

export default RolesList;
