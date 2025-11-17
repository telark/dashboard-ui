import React from 'react';
import { APP_ROUTES, Icons } from '../../constants';
import { ROLES_PAGE_CONSTANTS as RC } from '../../constants/pages/roles';
import Header from '../../components/display/shared/sections/Header';
import { STATIC_ROLES } from '../../data/roles';
import ViewDetails from '../../components/display/shared/views/ViewDetails';
import ScopesPermissions from '../../components/display/roles/view/ScopesPermissions';
import { createRoleViewConfig } from '../../config/roleViewConfig';
import { Card } from 'antd';
import { COMPONENT_STYLES } from '../../constants/layout/ui';
import AnimatedPageWrapper from '../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../components/shared';
import { useViewPage } from '../../hooks/layout';
import type { Role } from '../../interfaces/resources/roles';

const RoleIcon = Icons.ROLE;

const ViewRole: React.FC = () => {
  const {
    item: role,
    config,
    notFound,
  } = useViewPage<Role>({
    data: STATIC_ROLES,
    findById: (id, data) => data.find((r) => r.id === id),
    createConfig: createRoleViewConfig,
  });

  if (notFound || !role) {
    return <NotFound message={RC.LABELS.NOT_FOUND} />;
  }

  const breadcrumbs = [
    { label: RC.LABELS.BREADCRUMBS.ROLES, to: APP_ROUTES.ROLES },
    { label: role.name },
  ];

  return (
    <PageContainer>
      <Header subtitle={RC.LABELS.VIEW_SUBTITLE} breadcrumbs={breadcrumbs} icon={<RoleIcon />} />

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
    </PageContainer>
  );
};

export default ViewRole;
