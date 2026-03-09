import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { PanelFooter } from '../../../../../components/display/panels/shared';
import { updateCategory } from '../../../categories/clients';
import { fetchCategoriesByScopeThunk } from '../../../categories/store';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { ROLES_CONSTANTS as RC } from '../../constants';
import type { AppDispatch } from '../../../../../store';
import type { Category } from '../../../categories/models';

const PANEL_WIDTH = 440;

interface EditRoleCategoryPanelProps {
  open: boolean;
  onClose: () => void;
  editingCategory: Category | null;
}

interface FormValues {
  name: string;
}

const EditRoleCategoryPanel: React.FC<EditRoleCategoryPanelProps> = ({
  open,
  onClose,
  editingCategory,
}) => {
  const [form] = Form.useForm<FormValues>();
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);
  const existingNamesExcludingCurrent = useMemo(() => {
    const set = new Set((categories ?? []).map((c) => c.name.toLowerCase()));
    if (editingCategory?.name) {
      set.delete(editingCategory.name.toLowerCase());
    }
    return set;
  }, [categories, editingCategory?.name]);

  const nameValue = Form.useWatch('name', form);
  const trimmedName = nameValue?.trim() ?? '';
  const originalName = editingCategory?.name?.trim() ?? '';
  const hasChanges = trimmedName !== originalName;
  const nameExists = Boolean(
    trimmedName && existingNamesExcludingCurrent.has(trimmedName.toLowerCase()),
  );
  const isNameValid = Boolean(trimmedName) && !nameExists;

  useEffect(() => {
    if (open && editingCategory) {
      form.setFieldsValue({ name: editingCategory.name });
    }
  }, [open, editingCategory, form]);

  const handleSubmit = useCallback(async () => {
    if (!editingCategory) return;
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await updateCategory(editingCategory.id, { name: values.name.trim() });
      message.success(RC.LABELS.MESSAGES.CATEGORY_UPDATED(values.name.trim()));
      form.resetFields();
      onClose();
      await dispatch(fetchCategoriesByScopeThunk(CATEGORIES_CONSTANTS.SCOPES.ROLES));
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error(RC.LABELS.MESSAGES.CATEGORY_UPDATE_FAILED);
    } finally {
      setSubmitting(false);
    }
  }, [editingCategory, form, onClose, dispatch]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  if (!editingCategory) return null;

  return (
    <AnimationWrapper
      open={open}
      onClose={handleCancel}
      title={RC.LABELS.PANELS.EDIT_CATEGORY.TITLE}
      width={PANEL_WIDTH}
    >
      <div
        style={{
          height: '100%',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <Form form={form} layout="vertical" initialValues={{ name: editingCategory.name }}>
            <Form.Item
              name="name"
              label={RC.LABELS.PANELS.EDIT_CATEGORY.NAME_LABEL}
              rules={[
                { required: true, message: RC.LABELS.PANELS.EDIT_CATEGORY.NAME_REQUIRED_MESSAGE },
                { whitespace: true, message: RC.LABELS.PANELS.EDIT_CATEGORY.NAME_EMPTY_MESSAGE },
                {
                  validator: (_, value) => {
                    const trimmed = value?.trim();
                    if (!trimmed) return Promise.resolve();
                    if (existingNamesExcludingCurrent.has(trimmed.toLowerCase())) {
                      return Promise.reject(
                        new Error(RC.LABELS.PANELS.EDIT_CATEGORY.NAME_EXISTS_MESSAGE),
                      );
                    }
                    return Promise.resolve();
                  },
                  validateTrigger: 'onChange',
                },
              ]}
            >
              <Input placeholder={RC.LABELS.PANELS.EDIT_CATEGORY.NAME_PLACEHOLDER} allowClear />
            </Form.Item>
          </Form>
        </div>
        <PanelFooter
          onCancel={handleCancel}
          onPrimary={handleSubmit}
          cancelLabel={RC.LABELS.PANELS.EDIT_CATEGORY.CANCEL}
          primaryLabel={RC.LABELS.PANELS.EDIT_CATEGORY.SUBMIT_BUTTON}
          primaryLoading={submitting}
          primaryDisabled={submitting || !isNameValid || !hasChanges}
          horizontalPadding={0}
        />
      </div>
    </AnimationWrapper>
  );
};

export default EditRoleCategoryPanel;
