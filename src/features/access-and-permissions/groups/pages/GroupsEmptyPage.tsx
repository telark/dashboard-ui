import React, { memo } from 'react';
import { Button, Empty, Tooltip, Typography } from 'antd';
import { GROUPS_CONSTANTS as GC } from '../constants';
import {
  EMPTY_ACTION_DISABLED_STYLE,
  EMPTY_ACTION_STYLE,
  EMPTY_CLASS,
  Icons,
} from '../../../../constants';
import { LIST_PAGE } from '../../../../constants/shared/pages';
import { PageContainer } from '../../../../components/shared';
import { CreateGroupPanel } from '../panels';
import type { FormInstance } from 'antd';

const GroupIcon = Icons.Group;

interface GroupsEmptyPageProps {
  createPanelOpen: boolean;
  onCloseCreatePanel: () => void;
  onCreateGroupClick: () => void;
  canCreate: boolean;
  createForm: FormInstance;
}

// In the page frame, so the page keeps its h1. No toolbar, so Create stays here, disabled with
// the list toolbar's reason for a viewer who can't create.
const GroupsEmptyPage: React.FC<GroupsEmptyPageProps> = memo(
  ({ createPanelOpen, onCloseCreatePanel, onCreateGroupClick, canCreate, createForm }) => (
    <>
      <PageContainer
        title={GC.LABELS.HEADER_TITLE}
        subtitle={GC.LABELS.HEADER_SUBTITLE}
        gap={LIST_PAGE.CONTENT_GAP_PX}
      >
        <Empty
          className={EMPTY_CLASS.PAGE}
          image={<GroupIcon size={32} />}
          description={
            <>
              <Typography.Title level={2}>{GC.LABELS.MESSAGES.NO_GROUPS_TITLE}</Typography.Title>
              <Typography.Text>{GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}</Typography.Text>
            </>
          }
        >
          <Tooltip title={canCreate ? undefined : GC.LABELS.ACTIONS.CREATE_DISABLED_TOOLTIP}>
            <Button
              type="primary"
              icon={<GroupIcon size={16} />}
              onClick={onCreateGroupClick}
              disabled={!canCreate}
              style={canCreate ? EMPTY_ACTION_STYLE : EMPTY_ACTION_DISABLED_STYLE}
            >
              {GC.LABELS.FORM.BUTTON_TEXT}
            </Button>
          </Tooltip>
        </Empty>
      </PageContainer>
      {createPanelOpen && (
        <CreateGroupPanel open={createPanelOpen} onClose={onCloseCreatePanel} form={createForm} />
      )}
    </>
  ),
);

GroupsEmptyPage.displayName = 'GroupsEmptyPage';

export default GroupsEmptyPage;
