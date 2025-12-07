import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SlideOutPanel } from '../../../../components/display/panels/slide-out';
import { Icons } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import GroupFormFields from '../components/display/shared/GroupFormFields';
import { useGroupNameValidator, useGroupFormState, useGroupFormSelectOptions } from '../hooks';
import { useGroupMutations } from '../hooks';
import type { Group, GroupFormData } from '../models';

interface EditGroupPanelProps {
  open: boolean;
  onClose: () => void;
  editingGroup: Group | null;
  form: ReturnType<typeof import('antd').Form.useForm<GroupFormData>>[0];
}

const GroupIcon = Icons.Group;

const EditGroupPanel: React.FC<EditGroupPanelProps> = ({ open, onClose, editingGroup, form }) => {
  const groups = useSelector((state: RootState) => state.groups.groups);
  const { handleUpdate, submitting } = useGroupMutations();
  const { categoryOptions } = useGroupFormSelectOptions();
  const { nameValidator, normalizeName } = useGroupNameValidator({
    groups,
    isEditMode: true,
    currentName: editingGroup?.name,
  });
  const { handleValuesChange, handleFieldsChange, hasFormErrors, hasChanges } = useGroupFormState({
    form,
    isEditMode: true,
    initialValues: editingGroup
      ? {
          name: editingGroup.name,
          description: editingGroup.description,
          categoryID: editingGroup.categoryID,
          assignedUsersIDs: editingGroup.assignedUsersIDs || [],
        }
      : null,
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!editingGroup) return;
    await handleUpdate(editingGroup.id, values as GroupFormData);
    form.resetFields();
    onClose();
  };

  if (!editingGroup) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title="Edit Group"
      formContent={
        <GroupFormFields
          nameValidator={nameValidator}
          normalizeName={normalizeName}
          categoryOptions={categoryOptions}
        />
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText={GC.LABELS.UPDATE_BUTTON}
      submitButtonIcon={<GroupIcon size={16} />}
      loading={submitting}
      disabled={hasFormErrors || !hasChanges}
      form={form}
      initialValues={{
        name: editingGroup.name,
        description: editingGroup.description,
        categoryID: editingGroup.categoryID,
        assignedUsersIDs: editingGroup.assignedUsersIDs || [],
      }}
      onValuesChange={handleValuesChange}
      onFieldsChange={handleFieldsChange}
    />
  );
};

export default EditGroupPanel;
