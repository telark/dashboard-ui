import React, { memo } from 'react';
import { Button, Empty, Typography } from 'antd';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { EMPTY_ACTION_STYLE, EMPTY_CLASS, Icons } from '../../../../constants';
import { CreateGroupPanel } from '../panels';
import type { FormInstance } from 'antd';

const GroupIcon = Icons.Group;

interface GroupsEmptyPageProps {
  createPanelOpen: boolean;
  onCloseCreatePanel: () => void;
  onCreateGroupClick?: () => void;
  createForm: FormInstance;
}

const GroupsEmptyPage: React.FC<GroupsEmptyPageProps> = memo(
  ({ createPanelOpen, onCloseCreatePanel, onCreateGroupClick, createForm }) => (
    <>
      <Empty
        className={EMPTY_CLASS.PAGE}
        image={<GroupIcon size={32} />}
        description={
          <>
            <Typography.Title level={3}>{GC.LABELS.MESSAGES.NO_GROUPS_TITLE}</Typography.Title>
            <Typography.Text>{GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}</Typography.Text>
          </>
        }
      >
        {onCreateGroupClick ? (
          <Button
            type="primary"
            icon={<GroupIcon size={16} />}
            onClick={onCreateGroupClick}
            style={EMPTY_ACTION_STYLE}
          >
            {GC.LABELS.FORM.BUTTON_TEXT}
          </Button>
        ) : null}
      </Empty>
      {createPanelOpen && (
        <CreateGroupPanel open={createPanelOpen} onClose={onCloseCreatePanel} form={createForm} />
      )}
    </>
  ),
);

GroupsEmptyPage.displayName = 'GroupsEmptyPage';

export default GroupsEmptyPage;
