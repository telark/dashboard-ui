import React from 'react';
import { SlideOutPanel } from '../../../../components/display/panels/slide-out';
import { Icons } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import GroupFormFields from '../components/display/shared/GroupFormFields';
import { useGroupNameValidator, useGroupFormState, useGroupFormSelectOptions } from '../hooks';
import { useFetchGroups, useGroupMutations } from '../hooks';
import type { GroupFormData } from '../models';

interface CreateGroupPanelProps {
  open: boolean;
  onClose: () => void;
  form: ReturnType<typeof import('antd').Form.useForm<GroupFormData>>[0];
}

const GroupIcon = Icons.Group;

const CreateGroupPanel: React.FC<CreateGroupPanelProps> = ({ open, onClose, form }) => {
  const { groups } = useFetchGroups();
  const { handleCreate, submitting } = useGroupMutations();
  const { categoryOptions, defaultCategoryId } = useGroupFormSelectOptions();
  const { nameValidator, normalizeName } = useGroupNameValidator({
    groups,
    isEditMode: false,
  });
  const { handleValuesChange, handleFieldsChange, hasFormErrors } = useGroupFormState({
    form,
    isEditMode: false,
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    await handleCreate(values as GroupFormData);
    form.resetFields();
    onClose();
  };

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={GC.LABELS.FORM.TITLE}
      formContent={
        <GroupFormFields
          nameValidator={nameValidator}
          normalizeName={normalizeName}
          categoryOptions={categoryOptions}
        />
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText={GC.LABELS.FORM.BUTTON_TEXT}
      submitButtonIcon={<GroupIcon size={16} />}
      loading={submitting}
      disabled={hasFormErrors}
      initialValues={{
        name: '',
        description: '',
        categoryID: defaultCategoryId,
        assignedUsersIDs: [],
      }}
      onValuesChange={handleValuesChange}
      onFieldsChange={handleFieldsChange}
    />
  );
};

export default CreateGroupPanel;
