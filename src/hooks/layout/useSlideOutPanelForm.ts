import { useEffect } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';
import logger from '../../logging';

interface UseSlideOutPanelFormOptions {
  open: boolean;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  onClose: () => void;
  onCancel: () => void;
}

interface UseSlideOutPanelFormReturn {
  form: FormInstance;
  handleFinish: (values: Record<string, unknown>) => Promise<void>;
  handleCancel: () => void;
}

export const useSlideOutPanelForm = ({
  open,
  initialValues = {},
  onSubmit,
  onClose,
  onCancel,
}: UseSlideOutPanelFormOptions): UseSlideOutPanelFormReturn => {
  const [form] = Form.useForm();

  const handleFinish = async (values: Record<string, unknown>) => {
    try {
      await onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      logger.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
    onClose();
  };

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(initialValues);
    }
  }, [open, form, initialValues]);

  return {
    form,
    handleFinish,
    handleCancel,
  };
};
