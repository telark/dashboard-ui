import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES } from '../../constants';
import { STATIC_ROLES } from '../../data/roles';
import RolesHeader from '../../components/display/roles/RolesHeader';
import RolesTable from '../../components/display/roles/RolesTable';

const RolesList: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(STATIC_ROLES);
  const handleView = (record: any) => message.info(`View role: ${record?.name}`);

  return (
    <div
      style={{
        padding: '48px 24px 24px',
        marginTop: '60px',
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: 'calc(100vh - 60px)',
      }}
      className="app-root"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <RolesHeader
          subtitle="Manage existing roles"
          primaryText="Add Role"
          onPrimary={() => navigate(APP_ROUTES.ROLE_CREATE)}
          breadcrumbs={[{ label: 'Roles' }]}
        />

        <RolesTable roles={roles as any} onRolesChange={setRoles as any} onView={handleView as any} />
      </div>
    </div>
  );
};

export default RolesList;


