import React, { useMemo } from 'react';
import { Card } from 'antd';
import { COMPONENT_STYLES } from '../../../../../constants/layout/ui';
import { createRoleViewConfig } from '../../config';
import DetailsView from '../../../../../components/display/views/DetailsView';
import ScopesPermissions from '../../components/display/view/ScopesPermissions';
import { convertScopesFromAPI } from '../../utils';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { ROLES_CONSTANTS as RC } from '../../constants';
import type { Role } from '../../models';

interface ViewRolePanelProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  onEdit?: () => void;
}

const ViewRolePanel: React.FC<ViewRolePanelProps> = ({
  open,
  onClose,
  role,
  onEdit,
}) => {
  const config = useMemo(
    () => (role ? createRoleViewConfig(role) : { fields: [] }),
    [role],
  );
  const scopesRecord = useMemo(
    () => (role ? convertScopesFromAPI(role.scopesAndPermissions ?? []) : {}),
    [role],
  );

  if (!role) return null;

  return (
    <AnimationWrapper
      open={open}
      onClose={onClose}
      title={RC.LABELS.PANELS.VIEW.TITLE}
      width={560}
      toolbarActions={{ onEdit }}
    >
      <div style={{ overflow: 'auto', flex: 1 }}>
        <DetailsView config={config} />
        <Card
          style={{ ...COMPONENT_STYLES.VIEW_DETAILS.card, marginTop: 24 }}
          styles={{ body: COMPONENT_STYLES.VIEW_DETAILS.cardBody }}
        >
          <ScopesPermissions scopes={scopesRecord} />
        </Card>
      </div>
    </AnimationWrapper>
  );
};

export default ViewRolePanel;
