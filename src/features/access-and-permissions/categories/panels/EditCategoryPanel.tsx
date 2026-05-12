import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import AnimationWrapper from '../../../../components/display/panels/slide-out/AnimationWrapper';
import { PanelFooter } from '../../../../components/display/panels/shared';
import { updateCategory } from '../clients';
import { fetchCategoriesByScopeThunk } from '../store';
import { useCategories } from '../hooks';
import { CATEGORIES_CONSTANTS } from '../constants';
import type { AppDispatch } from '../../../../store';
import type { Category } from '../models';

const PANEL_WIDTH = 440;

interface EditCategoryPanelProps {
  open: boolean;
  onClose: () => void;
  editingCategory: Category | null;
}

interface FormValues {
  name: string;
}

const EditCategoryPanel: React.FC<EditCategoryPanelProps> = ({
  open,
  onClose,
  editingCategory,
}) => {
  const [form] = Form.useForm<FormValues>();
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const scope = editingCategory?.scope ?? CATEGORIES_CONSTANTS.SCOPES.ROLES;
  const { categories } = useCategories(scope);
  const editingCategoryName = editingCategory?.name;
  const existingNamesExcludingCurrent = useMemo(() => {
    const set = new Set((categories ?? []).map((c) => c.name.toLowerCase()));
    if (editingCategoryName) {
      set.delete(editingCategoryName.toLowerCase());
    }
    return set;
  }, [categories, editingCategoryName]);

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
      message.success(CATEGORIES_CONSTANTS.LABELS.MESSAGES.CATEGORY_UPDATED(values.name.trim()));
      form.resetFields();
      onClose();
      await dispatch(fetchCategoriesByScopeThunk(editingCategory.scope));
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error(CATEGORIES_CONSTANTS.LABELS.MESSAGES.CATEGORY_UPDATE_FAILED);
    } finally {
      setSubmitting(false);
    }
  }, [editingCategory, form, onClose, dispatch]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  if (!editingCategory) return null;

  const labels = CATEGORIES_CONSTANTS.LABELS.PANELS.EDIT_CATEGORY;

  return (
    <AnimationWrapper open={open} onClose={handleCancel} title={labels.TITLE} width={PANEL_WIDTH}>
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
              label={labels.NAME_LABEL}
              rules={[
                { required: true, message: labels.NAME_REQUIRED_MESSAGE },
                { whitespace: true, message: labels.NAME_EMPTY_MESSAGE },
                {
                  validator: (_, value) => {
                    const trimmed = value?.trim();
                    if (!trimmed) return Promise.resolve();
                    if (existingNamesExcludingCurrent.has(trimmed.toLowerCase())) {
                      return Promise.reject(new Error(labels.NAME_EXISTS_MESSAGE));
                    }
                    return Promise.resolve();
                  },
                  validateTrigger: 'onChange',
                },
              ]}
            >
              <Input placeholder={labels.NAME_PLACEHOLDER} allowClear />
            </Form.Item>
          </Form>
        </div>
        <PanelFooter
          onCancel={handleCancel}
          onPrimary={handleSubmit}
          cancelLabel={labels.CANCEL}
          primaryLabel={labels.SUBMIT_BUTTON}
          primaryLoading={submitting}
          primaryDisabled={submitting || !isNameValid || !hasChanges}
          horizontalPadding={0}
        />
      </div>
    </AnimationWrapper>
  );
};

export default EditCategoryPanel;
