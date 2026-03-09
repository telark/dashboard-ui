import React, { useState, useCallback, useMemo } from 'react';
import { Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import AnimationWrapper from '../../../../components/display/panels/slide-out/AnimationWrapper';
import { PanelFooter } from '../../../../components/display/panels/shared';
import { createCategory } from '../clients';
import { fetchCategoriesByScopeThunk } from '../store';
import { useCategories } from '../hooks';
import { CATEGORIES_CONSTANTS } from '../constants';
import type { AppDispatch } from '../../../../store';

const PANEL_WIDTH = 440;

type CategoryScope = (typeof CATEGORIES_CONSTANTS.SCOPES)[keyof typeof CATEGORIES_CONSTANTS.SCOPES];

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
  const [submitting, setSubmitting] = useState(false);

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
      message.success(CATEGORIES_CONSTANTS.LABELS.MESSAGES.CATEGORY_CREATED(values.name.trim()));
      form.resetFields();
      onClose();
      await dispatch(fetchCategoriesByScopeThunk(scope));
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error(CATEGORIES_CONSTANTS.LABELS.MESSAGES.CATEGORY_CREATE_FAILED);
    } finally {
      setSubmitting(false);
    }
  }, [form, onClose, dispatch, scope]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  const labels = CATEGORIES_CONSTANTS.LABELS.PANELS.ADD_CATEGORY;

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
        </div>
        <PanelFooter
          onCancel={handleCancel}
          onPrimary={handleSubmit}
          cancelLabel={labels.CANCEL}
          primaryLabel={labels.SUBMIT_BUTTON}
          primaryLoading={submitting}
          primaryDisabled={submitting || !isNameValid}
          horizontalPadding={0}
        />
      </div>
    </AnimationWrapper>
  );
};

export default AddCategoryPanel;
