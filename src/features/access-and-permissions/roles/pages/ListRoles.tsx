import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import { STATIC_ROLES } from '../data';
import Header from '../../../../components/display/shared/sections/Header';
import RolesTable from '../components/display/list/Table';
import { PageContainer } from '../../../../components/shared';

const RoleIcon = Icons.Role;

const RolesList: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(STATIC_ROLES);
  const handleView = (record: any) => navigate(`${APP_ROUTES.ROLES}/${record.id}/view`);

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
        roles={roles as any}
        onRolesChange={setRoles as any}
        onView={handleView as any}
        onEdit={(record) => navigate(`${APP_ROUTES.ROLES}/${record.id}/edit`)}
      />
    </PageContainer>
  );
};

export default RolesList;
