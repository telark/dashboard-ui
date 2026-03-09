import React, { useState, useCallback, useMemo } from 'react';
import { Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { PanelFooter } from '../../../../../components/display/panels/shared';
import { createCategory } from '../../../categories/clients';
import { fetchCategoriesByScopeThunk } from '../../../categories/store';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { GROUPS_CONSTANTS as GC } from '../../constants';
import type { AppDispatch } from '../../../../../store';

const PANEL_WIDTH = 440;

interface AddGroupCategoryPanelProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
}

const AddGroupCategoryPanel: React.FC<AddGroupCategoryPanelProps> = ({ open, onClose }) => {
  const [form] = Form.useForm<FormValues>();
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);
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
        scope: CATEGORIES_CONSTANTS.SCOPES.GROUPS,
        type: CATEGORIES_CONSTANTS.TYPES.CUSTOM,
      });
      message.success(GC.LABELS.MESSAGES.CATEGORY_CREATED(values.name.trim()));
      form.resetFields();
      onClose();
      await dispatch(fetchCategoriesByScopeThunk(CATEGORIES_CONSTANTS.SCOPES.GROUPS));
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error(GC.LABELS.MESSAGES.CATEGORY_CREATE_FAILED);
    } finally {
      setSubmitting(false);
    }
  }, [form, onClose, dispatch]);

  const handleCancel = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  return (
    <AnimationWrapper
      open={open}
      onClose={handleCancel}
      title={GC.LABELS.PANELS.ADD_CATEGORY.TITLE}
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
          <Form form={form} layout="vertical" initialValues={{ name: '' }}>
            <Form.Item
              name="name"
              label={GC.LABELS.PANELS.ADD_CATEGORY.NAME_LABEL}
              rules={[
                { required: true, message: GC.LABELS.PANELS.ADD_CATEGORY.NAME_REQUIRED_MESSAGE },
                { whitespace: true, message: GC.LABELS.PANELS.ADD_CATEGORY.NAME_EMPTY_MESSAGE },
                {
                  validator: (_, value) => {
                    const trimmed = value?.trim();
                    if (!trimmed) return Promise.resolve();
                    if (existingNames.has(trimmed.toLowerCase())) {
                      return Promise.reject(
                        new Error(GC.LABELS.PANELS.ADD_CATEGORY.NAME_EXISTS_MESSAGE),
                      );
                    }
                    return Promise.resolve();
                  },
                  validateTrigger: 'onChange',
                },
              ]}
            >
              <Input placeholder={GC.LABELS.PANELS.ADD_CATEGORY.NAME_PLACEHOLDER} allowClear />
            </Form.Item>
          </Form>
        </div>
        <PanelFooter
          onCancel={handleCancel}
          onPrimary={handleSubmit}
          cancelLabel={GC.LABELS.PANELS.ADD_CATEGORY.CANCEL}
          primaryLabel={GC.LABELS.PANELS.ADD_CATEGORY.SUBMIT_BUTTON}
          primaryLoading={submitting}
          primaryDisabled={submitting || !isNameValid}
          horizontalPadding={0}
        />
      </div>
    </AnimationWrapper>
  );
};

export default AddGroupCategoryPanel;
