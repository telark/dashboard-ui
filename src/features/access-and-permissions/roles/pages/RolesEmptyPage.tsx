import React, { memo } from 'react';
import { Button, Empty, Tooltip, Typography } from 'antd';
import { ROLES_CONSTANTS as RC } from '../constants';
import {
  EMPTY_ACTION_DISABLED_STYLE,
  EMPTY_ACTION_STYLE,
  EMPTY_CLASS,
  Icons,
} from '../../../../constants';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { PageContainer } from '../../../../components/shared';

const RoleIcon = Icons.Role;

interface RolesEmptyPageProps {
  onCreateRoleClick: () => void;
  canCreate: boolean;
}

// In the page frame, so the page keeps its h1. No toolbar, so Create stays here, disabled with
// the list toolbar's reason for a viewer who can't create.
const RolesEmptyPage: React.FC<RolesEmptyPageProps> = memo(({ onCreateRoleClick, canCreate }) => (
  <PageContainer
    title={RC.LABELS.HEADER_TITLE}
    subtitle={RC.LABELS.HEADER_SUBTITLE}
    gap={LIST_PAGE.CONTENT_GAP_PX}
  >
    <Empty
      className={EMPTY_CLASS.PAGE}
      image={<RoleIcon size={32} />}
      description={
        <>
          <Typography.Title level={2}>{RC.LABELS.NO_ROLES_TITLE}</Typography.Title>
          <Typography.Text>{RC.LABELS.NO_ROLES_DESCRIPTION}</Typography.Text>
        </>
      }
    >
      <Tooltip title={canCreate ? undefined : RC.LABELS.ACTIONS.CREATE_DISABLED_TOOLTIP}>
        <Button
          type="primary"
          icon={<RoleIcon size={16} />}
          onClick={onCreateRoleClick}
          disabled={!canCreate}
          style={canCreate ? EMPTY_ACTION_STYLE : EMPTY_ACTION_DISABLED_STYLE}
        >
          {RC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL}
        </Button>
      </Tooltip>
    </Empty>
  </PageContainer>
));

RolesEmptyPage.displayName = 'RolesEmptyPage';

export default RolesEmptyPage;
