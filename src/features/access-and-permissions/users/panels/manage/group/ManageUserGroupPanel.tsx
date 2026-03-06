import React, { useState, useMemo } from 'react';
import { Form } from 'antd';
import { SlideOutPanel } from '../../../../../../components/display/panels/slide-out';
import { SearchInput } from '../../../../../../components/display/inputs';
import { Icons } from '../../../../../../constants';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { useManageUserGroupPanel } from '../../../hooks/panels/useManageUserGroupPanel';
import UserGroupSelectList from '../../../components/display/manage/group/UserGroupSelectList';
import { CapitalizeFirstLetter } from '../../../../../../utils/helpers/format';
import type { User } from '../../../models';

const GroupIcon = Icons.Group;

interface ManageUserGroupPanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const PANEL_WIDTH = 600;

const ManageUserGroupPanel: React.FC<ManageUserGroupPanelProps> = ({ open, onClose, user }) => {
  const [form] = Form.useForm();
  const currentSelectedGroups = (Form.useWatch('assignedGroupsIDs', form) as string[]) || [];
  const [searchTerm, setSearchTerm] = useState('');

  const { initialSelectedGroups, hasChanges, groups, groupsLoading, submitting, handleSubmit } =
    useManageUserGroupPanel({ open, user, form, onClose, currentSelectedGroups });

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;
    const lower = searchTerm.toLowerCase();
    return (groups || []).filter(
      (g) =>
        g.name.toLowerCase().includes(lower) ||
        (g.description && g.description.toLowerCase().includes(lower)),
    );
  }, [groups, searchTerm]);

  if (!user) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={UC.LABELS.PANELS.MANAGE_GROUP.TITLE}
      subtitle={UC.LABELS.PANELS.MANAGE_GROUP.SUBTITLE(
        CapitalizeFirstLetter(user.fullname || user.username),
      )}
      width={PANEL_WIDTH}
      formContent={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={UC.LABELS.PANELS.MANAGE_GROUP.SEARCH_PLACEHOLDER}
            minWidth={300}
          />
          <UserGroupSelectList groups={filteredGroups} loading={groupsLoading} allGroups={groups} />
        </div>
      }
      onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
      onCancel={onClose}
      submitButtonText={UC.LABELS.PANELS.MANAGE_GROUP.SUBMIT_BUTTON}
      submitButtonIcon={<GroupIcon size={16} />}
      loading={submitting}
      disabled={!hasChanges}
      form={form}
      initialValues={{ assignedGroupsIDs: initialSelectedGroups }}
    />
  );
};

export default ManageUserGroupPanel;
