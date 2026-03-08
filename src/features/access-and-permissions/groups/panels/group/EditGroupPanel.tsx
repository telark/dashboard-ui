import React from 'react';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import GroupFormFields from '../../components/display/shared/GroupFormFields';
import { useEditGroupPanel } from '../../hooks';
import type { GroupPanelProps } from '../../models';

const GroupIcon = Icons.Group;

const EditGroupPanel: React.FC<GroupPanelProps> = ({ open, onClose, editingGroup, form }) => {
  const {
    initialValues,
    nameValidator,
    normalizeName,
    categoryOptions,
    handleValuesChange,
    handleFieldsChange,
    hasFormErrors,
    hasChanges,
    submitting,
    handleSubmit,
  } = useEditGroupPanel({
    open,
    editingGroup,
    form,
    onClose,
  });

  if (!editingGroup || !initialValues) return null;

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={GC.LABELS.PANELS.EDIT.TITLE}
      formContent={
        <GroupFormFields
          nameValidator={nameValidator}
          normalizeName={normalizeName}
          categoryOptions={categoryOptions}
        />
      }
      onSubmit={handleSubmit as (values: Record<string, unknown>) => Promise<void>}
      onCancel={onClose}
      submitButtonText={GC.LABELS.UPDATE_BUTTON}
      submitButtonIcon={<GroupIcon size={16} />}
      loading={submitting}
      disabled={hasFormErrors || !hasChanges}
      form={form}
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
      onFieldsChange={handleFieldsChange}
    />
  );
};

export default EditGroupPanel;
