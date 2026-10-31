import { useMemo, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import type { FormInstance } from 'antd';
import { RootState } from '../../../../../../store';
import {
  useGroupNameValidator,
  useGroupFormState,
  useGroupFormSelectOptions,
  useGroupMutations,
} from '../../';
import type { GroupPanelProps, GroupFormData } from '../../../models';
import { textChanged } from '../../../../../shared';

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
      categoryRef: editingGroup.categoryRef,
      userRefs: editingGroup.userRefs ?? [],
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
    // Membership is edited in Manage Members only; resending it here would revert concurrent changes.
    const { name, categoryRef } = values as Partial<GroupFormData>;
    const description = (values.description as string | undefined)?.trim();
    await handleUpdate(editingGroup.id, {
      name: textChanged(editingGroup.name, name) ? name : undefined,
      description: textChanged(editingGroup.description, description) ? description : undefined,
      categoryRef: textChanged(editingGroup.categoryRef, categoryRef) ? categoryRef : undefined,
    });
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
