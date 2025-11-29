import React from 'react';
import { APP_ROUTES, Icons } from '../../../../constants';
import { ROLES_CONSTANTS as RC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import DetailsView from '../../../../components/display/views/DetailsView';
import ScopesPermissions from '../components/display/view/ScopesPermissions';
import { createRoleViewConfig } from '../config';
import { Card } from 'antd';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../../../components/shared';
import { useRoleDetails } from '../hooks';
import { convertScopesFromAPI } from '../utils';

const RoleIcon = Icons.Role;

const ViewRole: React.FC = () => {
  const { role, loading, notFound } = useRoleDetails();

  if (loading) {
    return <PageContainer>Loading...</PageContainer>;
  }

  if (notFound || !role) {
    return <NotFound message={RC.LABELS.NOT_FOUND} />;
  }

  const config = createRoleViewConfig(role);
  const breadcrumbs = [
    { label: RC.LABELS.BREADCRUMBS.ROLES, to: APP_ROUTES.ROLES },
    { label: role.name },
  ];

  const scopesRecord = convertScopesFromAPI(role.scopesAndPermissions || []);

  return (
    <PageContainer>
      <Header subtitle={RC.LABELS.VIEW_SUBTITLE} breadcrumbs={breadcrumbs} icon={<RoleIcon />} />

      <AnimatedPageWrapper>
        <DetailsView config={config} />

        <Card
          style={{
            ...COMPONENT_STYLES.VIEW_DETAILS.card,
          }}
          styles={{ body: COMPONENT_STYLES.VIEW_DETAILS.cardBody }}
        >
          <ScopesPermissions scopes={scopesRecord} />
        </Card>
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default ViewRole;
