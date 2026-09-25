import React, { useState, useCallback, useMemo } from 'react';
import { Form, Input, App as AntdApp } from 'antd';
import { useDispatch } from 'react-redux';
import AnimationWrapper from '../../../../components/display/panels/slide-out/AnimationWrapper';
import { createCategory } from '../clients';
import { fetchCategoriesByScopeThunk } from '../store';
import { useCategories } from '../hooks';
import { CATEGORIES_CONSTANTS, labelsFor } from '../constants';
import type { CategoryScope } from '../constants';
import type { AppDispatch } from '../../../../store';

const PANEL_WIDTH = 440;

interface AddCategoryPanelProps {
  open: boolean;
  onClose: () => void;
  scope: CategoryScope;
}

interface FormValues {
  name: string;
}

const AddCategoryPanel: React.FC<AddCategoryPanelProps> = ({ open, onClose, scope }) => {
  const [form] = Form.useForm<FormValues>();
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [submitting, setSubmitting] = useState(false);
  const L = labelsFor(scope);

  const { categories } = useCategories(scope);
  const existingNames = useMemo(
    () => new Set((categories ?? []).map((c) => c.name.toLowerCase())),
    [categories],
  );

  const nameValue = Form.useWatch('name', form);
  const trimmedName = nameValue?.trim() ?? '';
  const nameExists = Boolean(trimmedName && existingNames.has(trimmedName.toLowerCase()));
  const isNameValid = Boolean(trimmedName) && !nameExists;

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await createCategory({
        name: values.name.trim(),
        scope,
        type: CATEGORIES_CONSTANTS.TYPES.CUSTOM,
      });
      message.success(L.MESSAGES.CATEGORY_CREATED(values.name.trim()));
      form.resetFields();
      onClose();
      await dispatch(fetchCategoriesByScopeThunk(scope));
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error(L.MESSAGES.CATEGORY_CREATE_FAILED);
    } finally {
      setSubmitting(false);
    }
  }, [form, onClose, dispatch, scope, message, L]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  const labels = L.PANELS.ADD_CATEGORY;

  return (
    <AnimationWrapper
      open={open}
      onClose={handleCancel}
      title={labels.TITLE}
      width={PANEL_WIDTH}
      footer={{
        onCancel: handleCancel,
        onPrimary: handleSubmit,
        cancelLabel: labels.CANCEL,
        primaryLabel: labels.SUBMIT_BUTTON,
        primaryLoading: submitting,
        primaryDisabled: submitting || !isNameValid,
      }}
    >
      <Form form={form} layout="vertical" initialValues={{ name: '' }}>
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
                if (existingNames.has(trimmed.toLowerCase())) {
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
    </AnimationWrapper>
  );
};

export default AddCategoryPanel;
