import React, { useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, APP_ROUTES, ICONS } from '../../constants';
import { GROUPS_CONSTANTS as GC } from '../../constants/pages/groups';
import Header from '../../components/display/shared/sections/Header';
import GroupsTable from '../../components/display/groups/list/Table';
import FormModal from '../../components/display/shared/modal/FormModal';
import { STATIC_GROUPS } from '../../data/groups';
import type { Group } from '../../interfaces/groups';

const GroupIcon = ICONS.GROUP;

const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(STATIC_GROUPS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateGroup = async (groupData: Record<string, any>) => {
    await new Promise((r) => setTimeout(r, 400));
    const newGroup: Group = {
      id: `grp-${Date.now()}`,
      name: groupData.name,
      description: groupData.description,
      category: groupData.category,
      createdAt: new Date().toISOString(),
    };
    message.success(`Group "${groupData.name}" created`);
    setGroups([...groups, newGroup]);
  };

  return (
    <div
      style={{
        padding: '48px 24px 24px',
        marginTop: '60px',
        background: DEFAULT_COLORS.PAGE_BG,
        minHeight: 'calc(100vh - 60px)',
      }}
      className="app-root"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Header
          subtitle={GC.LABELS.HEADER_SUBTITLE}
          primaryText={GC.LABELS.FORM.BUTTON_TEXT}
          primaryIcon={<GroupIcon size={16} />}
          onPrimary={() => setIsCreateModalOpen(true)}
          breadcrumbs={[{ label: 'Groups' }]}
          icon={<GroupIcon />}
        />

        <FormModal
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateGroup}
          title={GC.LABELS.FORM.TITLE}
          subtitle={GC.LABELS.FORM.SUBTITLE}
          sectionTitle={GC.LABELS.FORM.SECTION_TITLE}
          sectionSubtitle={GC.LABELS.FORM.SECTION_SUBTITLE}
          fields={GC.FORM.FIELDS}
          buttonText={GC.LABELS.FORM.BUTTON_TEXT}
          buttonIcon={<GroupIcon size={16} />}
          width={GC.SIZES.MODAL_WIDTH}
          initialValues={GC.FORM.INITIAL_VALUES}
        />

        <GroupsTable
          groups={groups}
          onView={(group) => navigate(`${APP_ROUTES.GROUPS}/${group.id}/view`)}
          onEdit={(group) => navigate(`${APP_ROUTES.GROUPS}/${group.id}/edit`)}
          onGroupsChange={setGroups}
        />
      </div>
    </div>
  );
};

export default GroupsList;
