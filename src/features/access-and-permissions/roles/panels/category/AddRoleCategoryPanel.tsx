import React, { useState, useCallback } from 'react';
import { Form, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { PanelFooter } from '../../../../../components/display/panels/shared';
import { createCategory } from '../../../categories/clients';
import { fetchCategoriesByScopeThunk } from '../../../categories/store';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { ROLES_CONSTANTS as RC } from '../../constants';
import type { AppDispatch } from '../../../../../store';

const PANEL_WIDTH = 440;

interface AddRoleCategoryPanelProps {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
}

const AddRoleCategoryPanel: React.FC<AddRoleCategoryPanelProps> = ({ open, onClose }) => {
  const [form] = Form.useForm<FormValues>();
  const dispatch: AppDispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);
      await createCategory({
        name: values.name.trim(),
        scope: CATEGORIES_CONSTANTS.SCOPES.ROLES,
        type: CATEGORIES_CONSTANTS.TYPES.CUSTOM,
      });
      message.success(RC.LABELS.MESSAGES.CATEGORY_CREATED(values.name.trim()));
      form.resetFields();
      onClose();
      await dispatch(fetchCategoriesByScopeThunk(CATEGORIES_CONSTANTS.SCOPES.ROLES));
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return;
      message.error(RC.LABELS.MESSAGES.CATEGORY_CREATE_FAILED);
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
      title={RC.LABELS.PANELS.ADD_CATEGORY.TITLE}
      width={PANEL_WIDTH}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ padding: 24 }}
        initialValues={{ name: '' }}
      >
        <Form.Item
          name="name"
          label={RC.LABELS.PANELS.ADD_CATEGORY.NAME_LABEL}
          rules={[
            { required: true, message: RC.LABELS.PANELS.ADD_CATEGORY.NAME_REQUIRED_MESSAGE },
            { whitespace: true, message: RC.LABELS.PANELS.ADD_CATEGORY.NAME_EMPTY_MESSAGE },
          ]}
        >
          <Input placeholder={RC.LABELS.PANELS.ADD_CATEGORY.NAME_PLACEHOLDER} allowClear />
        </Form.Item>
      </Form>
      <PanelFooter
        onCancel={handleCancel}
        onPrimary={handleSubmit}
        cancelLabel={RC.LABELS.PANELS.ADD_CATEGORY.CANCEL}
        primaryLabel={RC.LABELS.PANELS.ADD_CATEGORY.SUBMIT_BUTTON}
        primaryLoading={submitting}
        primaryDisabled={submitting}
      />
    </AnimationWrapper>
  );
};

export default AddRoleCategoryPanel;
