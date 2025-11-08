import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, ICONS } from '../../constants';
import { STATIC_ROLES } from '../../data/roles';
import Header from '../../components/display/shared/sections/Header';
import RolesTable from '../../components/display/roles/list/Table';
import { PageContainer } from '../../components/shared';

const RoleIcon = ICONS.ROLE;

const RolesList: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(STATIC_ROLES);
  const handleView = (record: any) => navigate(`${APP_ROUTES.ROLES}/${record.id}/view`);

  return (
    <PageContainer>
      <Header
        subtitle="Manage existing roles"
        primaryText="Add Role"
        onPrimary={() => navigate(APP_ROUTES.ROLE_CREATE)}
        breadcrumbs={[{ label: 'Roles' }]}
        icon={<RoleIcon />}
      />

      <RolesTable
        roles={roles as any}
        onRolesChange={setRoles as any}
        onView={handleView as any}
        onEdit={(record) => navigate(`${APP_ROUTES.ROLES}/${record.id}/edit`)}
      />
    </PageContainer>
  );
};

export default RolesList;
