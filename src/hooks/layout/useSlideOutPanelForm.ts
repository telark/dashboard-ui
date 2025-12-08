import { useEffect, useRef } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd/es/form';
import logger from '../../logging';

interface UseSlideOutPanelFormOptions {
  open: boolean;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  onClose: () => void;
  onCancel: () => void;
  form?: FormInstance;
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
  form: externalForm,
}: UseSlideOutPanelFormOptions): UseSlideOutPanelFormReturn => {
  const [internalForm] = Form.useForm();
  const form = externalForm || internalForm;
  const previousOpenRef = useRef(false);
  const hasExternalForm = !!externalForm;

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
    const isOpening = open && !previousOpenRef.current;

    if (isOpening) {
      if (!hasExternalForm) {
        form.resetFields();
        if (Object.keys(initialValues).length > 0) {
          form.setFieldsValue(initialValues);
        }
      }
    }

    previousOpenRef.current = open;
  }, [open, form, hasExternalForm]);

  return {
    form,
    handleFinish,
    handleCancel,
  };
};
