import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import GroupFormFields from '../../components/display/shared/GroupFormFields';
import { useGroupNameValidator, useGroupFormState, useGroupFormSelectOptions } from '../../hooks';
import { useGroupMutations } from '../../hooks';
import { normalizeGroupFormData } from '../../utils';
import type { GroupPanelProps } from '../../models';

const GroupIcon = Icons.Group;

const CreateGroupPanel: React.FC<GroupPanelProps> = ({ open, onClose, form }) => {
  const groups = useSelector((state: RootState) => state.groups.groups);
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
    const formData = normalizeGroupFormData(values);
    await handleCreate(formData);
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
      form={form}
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
