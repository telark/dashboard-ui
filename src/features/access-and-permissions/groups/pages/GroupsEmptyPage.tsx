import React, { memo, useMemo } from 'react';
import { GROUPS_CONSTANTS as GC } from '../constants';
import EmptyState from '../../../../components/display/views/EmptyState';
import { Icons } from '../../../../constants';
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
  ({ createPanelOpen, onCloseCreatePanel, onCreateGroupClick, createForm }) => {
    const buttonIcon = useMemo(() => <GroupIcon size={16} />, []);
    const icon = useMemo(() => <GroupIcon size={32} />, []);

    return (
      <>
        <EmptyState
          title={GC.LABELS.MESSAGES.NO_GROUPS_TITLE}
          description={GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}
          icon={icon}
          primaryAction={
            onCreateGroupClick
              ? {
                  label: GC.LABELS.FORM.BUTTON_TEXT,
                  icon: buttonIcon,
                  onClick: onCreateGroupClick,
                }
              : undefined
          }
        />
        {createPanelOpen && (
          <CreateGroupPanel open={createPanelOpen} onClose={onCloseCreatePanel} form={createForm} />
        )}
      </>
    );
  },
);

GroupsEmptyPage.displayName = 'GroupsEmptyPage';

export default GroupsEmptyPage;
