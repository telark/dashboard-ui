import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES, ICONS } from '../../constants';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_ROLES } from '../../data/roles';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import ScopesPermissions from '../../components/display/roles/view/ScopesPermissions';
import { createRoleViewConfig } from '../../config/roleViewConfig';
import { Card } from 'antd';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';

const RoleIcon = ICONS.ROLE;

const ViewRole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const role = useMemo(() => {
    return STATIC_ROLES.find((r) => r.id === id);
  }, [id]);

  const config = useMemo(() => {
    if (!role) return null;
    return createRoleViewConfig(role);
  }, [role]);

  if (!role || !config) {
    return (
      <div
        style={{
          padding: '48px 24px 24px',
          marginTop: '60px',
          background: DEFAULT_COLORS.PAGE_BG,
          minHeight: 'calc(100vh - 60px)',
        }}
      >
        <div>Role not found</div>
      </div>
    );
  }

  const breadcrumbs = [{ label: 'Roles', to: APP_ROUTES.ROLES }, { label: role.name }];

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
        <Header
          subtitle="View role details"
          breadcrumbs={breadcrumbs}
          primaryText="Back to Roles"
          onPrimary={() => navigate(APP_ROUTES.ROLES)}
          icon={<RoleIcon />}
        />

        <AnimatedPageWrapper>
          <ViewDetails config={config} />

          <Card
            style={{
              ...COMPONENT_STYLES.VIEW_DETAILS.card,
            }}
            styles={{ body: COMPONENT_STYLES.VIEW_DETAILS.cardBody }}
          >
            <ScopesPermissions scopes={role.scopes} />
          </Card>
        </AnimatedPageWrapper>
      </div>
    </div>
  );
};

export default ViewRole;
