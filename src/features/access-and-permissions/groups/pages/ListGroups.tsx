import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, Icons } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import Header from '../../../../components/display/sections/Header';
import GroupsTable from '../components/display/list/Table';
import FormModal from '../../../../components/display/modal/FormModal';
import { STATIC_GROUPS } from '../data';
import { PageContainer } from '../../../../components/shared';
import { useListPage } from '../../../../hooks/layout';
import type { Group } from '../models';

const GroupIcon = Icons.Group;

const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    items: groups,
    setItems: setGroups,
    isCreateModalOpen,
    setIsCreateModalOpen,
    handleCreate,
  } = useListPage<Group>({
    initialData: STATIC_GROUPS,
    onCreate: async (groupData) => {
      await new Promise((r) => setTimeout(r, 400));
      return {
        id: `grp-${Date.now()}`,
        name: groupData.name,
        description: groupData.description,
        category: groupData.category,
        createdAt: new Date().toISOString(),
      } as Group;
    },
    successMessage: GC.LABELS.MESSAGES.CREATED,
  });

  return (
    <PageContainer>
      <Header
        subtitle={GC.LABELS.HEADER_SUBTITLE}
        primaryText={GC.LABELS.FORM.BUTTON_TEXT}
        primaryIcon={<GroupIcon size={16} />}
        onPrimary={() => setIsCreateModalOpen(true)}
        breadcrumbs={[{ label: GC.LABELS.BREADCRUMBS.GROUPS }]}
        icon={<GroupIcon />}
      />

      <FormModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreate}
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
    </PageContainer>
  );
};

export default GroupsList;
