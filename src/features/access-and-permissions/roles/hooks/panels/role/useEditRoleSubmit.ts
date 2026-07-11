import { useState, useCallback } from 'react';
import { App as AntdApp } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../../../../../constants';
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
  /** When true, do not navigate after update (e.g. when using edit panel on list page). */
  skipNavigate?: boolean;
  /** Called after successful update (e.g. close panel). */
  onSuccess?: () => void;
}

export const useEditRoleSubmit = ({
  id,
  role,
  initialValues,
  form,
  handleUpdate,
  skipNavigate = false,
  onSuccess,
}: UseEditRoleSubmitOptions) => {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
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
          if (!skipNavigate) {
            navigate(`${APP_ROUTES.ROLES}/${id}/view`);
          }
          onSuccess?.();
        } catch {
          // Error handling is done in handleUpdate
        } finally {
          setIsSubmitting(false);
        }
      } else {
        const roleData = buildUpdatePayload(fullRoleData, currentProtection, changes);
        await handleUpdate(id, roleData);
        onSuccess?.();
      }
    },
    [id, role, initialValues, form, handleUpdate, navigate, skipNavigate, onSuccess, message],
  );

  return {
    handleSubmit,
    isSubmitting,
  };
};
