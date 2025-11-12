import { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, message } from 'antd';

interface UseEditPageOptions<T, F> {
  data: T[];
  findById: (id: string, data: T[]) => T | undefined;
  getFormValues: (item: T) => F;
  onUpdate: (id?: string, values?: F) => Promise<void>;
  successMessage: (name: string) => string;
  viewRoute: (id: string) => string;
}

export const useEditPage = <T, F extends Record<string, any>>({
  data,
  findById,
  getFormValues,
  onUpdate,
  successMessage,
  viewRoute,
}: UseEditPageOptions<T, F>) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<F>();
  const [submitting, setSubmitting] = useState(false);

  const item = useMemo(() => {
    if (!id) return undefined;
    return findById(id, data);
  }, [id, data, findById]);

  useEffect(() => {
    if (item) {
      const formValues = getFormValues(item);
      form.setFieldsValue(formValues);
    }
  }, [item, form, getFormValues]);

  const handleFinish = async (values: F) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await onUpdate(id, values);
      message.success(successMessage((values as any).name || 'Item'));
      navigate(viewRoute(id));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    id,
    item,
    form,
    submitting,
    handleFinish,
    notFound: !item,
  };
};
