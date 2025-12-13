import React from 'react';
import { GROUPS_CONSTANTS as GC } from '../constants';
import EmptyState from '../../../../components/display/views/EmptyState';
import { Icons } from '../../../../constants';
import { CreateGroupPanel } from '../panels';
import type { FormInstance } from 'antd';

const GroupIcon = Icons.Group;

interface GroupsEmptyPageProps {
  createPanelOpen: boolean;
  onCloseCreatePanel: () => void;
  onCreateGroupClick: () => void;
  createForm: FormInstance;
}

const GroupsEmptyPage: React.FC<GroupsEmptyPageProps> = ({
  createPanelOpen,
  onCloseCreatePanel,
  onCreateGroupClick,
  createForm,
}) => {
  return (
    <>
      <EmptyState
        title={GC.LABELS.MESSAGES.NO_GROUPS_TITLE}
        description={GC.LABELS.MESSAGES.NO_GROUPS_DESCRIPTION}
        buttonText={GC.LABELS.FORM.BUTTON_TEXT}
        buttonIcon={<GroupIcon size={16} />}
        onButtonClick={onCreateGroupClick}
        icon={<GroupIcon size={32} />}
      />
      {createPanelOpen && (
        <CreateGroupPanel open={createPanelOpen} onClose={onCloseCreatePanel} form={createForm} />
      )}
    </>
  );
};

export default GroupsEmptyPage;
