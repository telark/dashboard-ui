import { useCallback, useState } from 'react';
import { App as AntdApp } from 'antd';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../../store';
import { updateApplicationThunk } from '../../store';
import type { Application, ApplicationUpdatePayload } from '../../models';
import { APPLICATIONS_UI } from '../../constants/texts';
import { textChanged } from '../../../shared';

interface UseEditApplicationPanelOptions {
  application: Application | null;
}

interface UseEditApplicationPanelReturn {
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export function useEditApplicationPanel({
  application,
}: UseEditApplicationPanelOptions): UseEditApplicationPanelReturn {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      if (!application) return;
      const v = values as { displayName: string; description?: string };
      const payload: ApplicationUpdatePayload = {
        displayName: textChanged(application.displayName, v.displayName)
          ? v.displayName
          : undefined,
        description: textChanged(application.description, v.description)
          ? v.description
          : undefined,
      };
      setSubmitting(true);
      try {
        await dispatch(updateApplicationThunk({ name: application.name, payload })).unwrap();
        message.success(APPLICATIONS_UI.EDIT_PAGE.SUCCESS_MESSAGE);
      } catch (err) {
        message.error(typeof err === 'string' ? err : APPLICATIONS_UI.EDIT_PAGE.ERROR_GENERIC);
        throw new Error('update failed', { cause: err });
      } finally {
        setSubmitting(false);
      }
    },
    [application, dispatch, message],
  );

  return { submitting, handleSubmit };
}
