import React, { useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import { Icons } from '../../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import GroupFormFields from '../../components/display/shared/GroupFormFields';
import { useGroupNameValidator, useGroupFormState, useGroupFormSelectOptions } from '../../hooks';
import { useGroupMutations } from '../../hooks';
import { normalizeGroupFormData } from '../../utils';
import type { GroupPanelProps, GroupFormData } from '../../models';

const GroupIcon = Icons.Group;

const EditGroupPanel: React.FC<GroupPanelProps> = ({ open, onClose, editingGroup, form }) => {
  const groups = useSelector((state: RootState) => state.groups.groups);
  const { handleUpdate, submitting } = useGroupMutations();
  const { categoryOptions } = useGroupFormSelectOptions();
  const previousGroupIdRef = useRef<string | null>(null);
  const previousOpenRef = useRef(false);

  const initialValues = useMemo<GroupFormData | null>(() => {
    if (!editingGroup) return null;
    return {
      name: editingGroup.name,
      description: editingGroup.description,
      categoryID: editingGroup.categoryID,
      assignedUsersIDs: editingGroup.assignedUsersIDs || [],
    };
  }, [editingGroup]);

  const { nameValidator, normalizeName } = useGroupNameValidator({
    groups,
    isEditMode: true,
    currentName: editingGroup?.name,
  });

  const { handleValuesChange, handleFieldsChange, hasFormErrors, hasChanges } = useGroupFormState({
    form,
    isEditMode: true,
    initialValues,
  });

  useEffect(() => {
    const isOpening = open && !previousOpenRef.current;
    const groupChanged = editingGroup?.id !== previousGroupIdRef.current;

    if (open && initialValues && (isOpening || groupChanged)) {
      form.setFieldsValue(initialValues);
    }

    previousOpenRef.current = open;
    previousGroupIdRef.current = editingGroup?.id || null;
  }, [open, editingGroup?.id, initialValues, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!editingGroup) return;
    const formData = normalizeGroupFormData(values);
    await handleUpdate(editingGroup.id, formData);
    form.resetFields();
    onClose();
  };

  if (!editingGroup || !initialValues) return null;

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
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
      onFieldsChange={handleFieldsChange}
    />
  );
};

export default EditGroupPanel;
