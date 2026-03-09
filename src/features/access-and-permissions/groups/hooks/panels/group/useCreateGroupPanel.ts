import { useSelector } from 'react-redux';
import type { FormInstance } from 'antd';
import { RootState } from '../../../../../../store';
import {
  useGroupNameValidator,
  useGroupFormState,
  useGroupFormSelectOptions,
  useGroupMutations,
} from '../../';
import { normalizeGroupFormData } from '../../../utils';
import type { GroupFormData } from '../../../models';

interface UseCreateGroupPanelOptions {
  form: FormInstance<GroupFormData>;
  onClose: () => void;
}

interface UseCreateGroupPanelReturn {
  nameValidator: ReturnType<typeof useGroupNameValidator>['nameValidator'];
  normalizeName: ReturnType<typeof useGroupNameValidator>['normalizeName'];
  categoryOptions: ReturnType<typeof useGroupFormSelectOptions>['categoryOptions'];
  defaultCategoryId: ReturnType<typeof useGroupFormSelectOptions>['defaultCategoryId'];
  handleValuesChange: () => void;
  handleFieldsChange: () => void;
  hasFormErrors: boolean;
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export const useCreateGroupPanel = ({
  form,
  onClose,
}: UseCreateGroupPanelOptions): UseCreateGroupPanelReturn => {
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

  return {
    nameValidator,
    normalizeName,
    categoryOptions,
    defaultCategoryId,
    handleValuesChange,
    handleFieldsChange,
    hasFormErrors,
    submitting,
    handleSubmit,
  };
};
