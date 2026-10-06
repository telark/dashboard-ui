import { useState, useCallback } from 'react';
import { App as AntdApp } from 'antd';
import { ROLES_CONSTANTS as RC } from '../../../constants';
import type { RoleFormValues, RoleFormData, Role } from '../../../models';
import { convertFormValuesToRoleFormData } from '../../../utils';
import { detectChanges } from '../../../utils/helpers/changeDetection';
import {
  buildUpdatePayload,
  buildFieldsUpdatePayload,
} from '../../../utils/helpers/buildUpdatePayload';
import type { FormInstance } from 'antd';

interface UseEditRoleSubmitOptions {
  id: string;
  role: Role;
  initialValues: RoleFormValues;
  form: FormInstance<RoleFormValues>;
  handleUpdate: (
    id: string,
    data: Partial<RoleFormData>,
    options?: { silent?: boolean },
  ) => Promise<Role>;
  /** Called after successful update (e.g. close panel). */
  onSuccess?: () => void;
}

export const useEditRoleSubmit = ({
  id,
  role,
  initialValues,
  form,
  handleUpdate,
  onSuccess,
}: UseEditRoleSubmitOptions) => {
  const { message } = AntdApp.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (values: RoleFormValues) => {
      const allFormValues = form.getFieldsValue(true) as RoleFormValues;
      const finalValues: RoleFormValues = {
        ...allFormValues,
        ...values,
      };

      const fullRoleData = convertFormValuesToRoleFormData(finalValues, role.type, role.status);
      const currentProtection = finalValues.protection || {};
      const changes = detectChanges(initialValues, finalValues);

      if (changes.needsTwoStepUpdate) {
        setIsSubmitting(true);
        try {
          const protectionOnlyData: Partial<RoleFormData> = {
            protection: fullRoleData.protection,
          };
          await handleUpdate(id, protectionOnlyData, { silent: true });

          const fieldsData = buildFieldsUpdatePayload(fullRoleData, changes);
          const result = await handleUpdate(id, fieldsData, { silent: true });

          message.success(RC.LABELS.MESSAGES.UPDATED(result.name));
          onSuccess?.();
        } catch (error) {
          // Both steps are silent, so the refusal is shown here.
          message.error(error instanceof Error ? error.message : RC.LABELS.MESSAGES.UPDATE_FAILED);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        const roleData = buildUpdatePayload(fullRoleData, currentProtection, changes);
        await handleUpdate(id, roleData);
        onSuccess?.();
      }
    },
    [id, role, initialValues, form, handleUpdate, onSuccess, message],
  );

  return {
    handleSubmit,
    isSubmitting,
  };
};
