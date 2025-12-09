import React from 'react';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import GroupFormFields from '../../components/display/shared/GroupFormFields';
import { useCreateGroupPanel } from '../../hooks';
import type { GroupPanelProps } from '../../models';

const GroupIcon = Icons.Group;

const CreateGroupPanel: React.FC<GroupPanelProps> = ({ open, onClose, form }) => {
  const {
    nameValidator,
    normalizeName,
    categoryOptions,
    defaultCategoryId,
    handleValuesChange,
    handleFieldsChange,
    hasFormErrors,
    submitting,
    handleSubmit,
  } = useCreateGroupPanel({
    form,
    onClose,
  });

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
      onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
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
