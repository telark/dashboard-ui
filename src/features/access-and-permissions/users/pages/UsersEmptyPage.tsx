import React, { memo } from 'react';
import { Button, Empty, Tooltip, Typography } from 'antd';
import { USERS_CONSTANTS as UC } from '../constants';
import {
  EMPTY_ACTION_DISABLED_STYLE,
  EMPTY_ACTION_STYLE,
  EMPTY_CLASS,
  Icons,
} from '../../../../constants';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { PageContainer } from '../../../../components/shared';

const UserIcon = Icons.User;
const M = UC.LABELS.MESSAGES;

interface UsersEmptyPageProps {
  onCreateUserClick: () => void;
  canCreate: boolean;
}

// In the page frame, so the page keeps its h1. No toolbar, so Create stays here, disabled with
// the list toolbar's reason for a viewer who can't create.
const UsersEmptyPage: React.FC<UsersEmptyPageProps> = memo(({ onCreateUserClick, canCreate }) => (
  <PageContainer
    title={UC.LABELS.HEADER_TITLE}
    subtitle={UC.LABELS.HEADER_SUBTITLE}
    gap={LIST_PAGE.CONTENT_GAP_PX}
  >
    <Empty
      className={EMPTY_CLASS.PAGE}
      image={<UserIcon size={32} />}
      description={
        <>
          <Typography.Title level={2}>
            {canCreate ? M.NO_USERS_TITLE : M.ONLY_SELF_TITLE}
          </Typography.Title>
          <Typography.Text>
            {canCreate ? M.NO_USERS_DESCRIPTION : M.ONLY_SELF_DESCRIPTION}
          </Typography.Text>
        </>
      }
    >
      <Tooltip title={canCreate ? undefined : UC.LABELS.TOOLBAR.CREATE.DISABLED_TOOLTIP}>
        <Button
          type="primary"
          icon={<UserIcon size={16} />}
          onClick={onCreateUserClick}
          disabled={!canCreate}
          style={canCreate ? EMPTY_ACTION_STYLE : EMPTY_ACTION_DISABLED_STYLE}
        >
          {UC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL}
        </Button>
      </Tooltip>
    </Empty>
  </PageContainer>
));

UsersEmptyPage.displayName = 'UsersEmptyPage';

export default UsersEmptyPage;
