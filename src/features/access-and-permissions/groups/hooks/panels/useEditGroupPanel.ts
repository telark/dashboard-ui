import { useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { FormInstance } from 'antd';
import { RootState } from '../../../../../store';
import {
  useGroupNameValidator,
  useGroupFormState,
  useGroupFormSelectOptions,
  useGroupMutations,
} from '../';
import { normalizeGroupFormData } from '../../utils';
import type { GroupPanelProps, GroupFormData } from '../../models';

interface UseEditGroupPanelOptions {
  open: boolean;
  editingGroup: GroupPanelProps['editingGroup'];
  form: FormInstance<GroupFormData>;
  onClose: () => void;
}

interface UseEditGroupPanelReturn {
  initialValues: GroupFormData | null;
  nameValidator: ReturnType<typeof useGroupNameValidator>['nameValidator'];
  normalizeName: ReturnType<typeof useGroupNameValidator>['normalizeName'];
  categoryOptions: ReturnType<typeof useGroupFormSelectOptions>['categoryOptions'];
  handleValuesChange: () => void;
  handleFieldsChange: () => void;
  hasFormErrors: boolean;
  hasChanges: boolean;
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export const useEditGroupPanel = ({
  open,
  editingGroup,
  form,
  onClose,
}: UseEditGroupPanelOptions): UseEditGroupPanelReturn => {
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

  return {
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
  };
};
