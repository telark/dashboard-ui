import React, { useMemo, useEffect, useCallback, useState } from 'react';
import { Icons } from '../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../constants';
import RoleForm from '../../components/display/shared/RoleForm';
import { useRoleActions, useRoles, useRoleCategories } from '../../hooks';
import { convertFormValuesToRoleFormData } from '../../utils';
import type { RoleFormValues, ScopeFormValue } from '../../models';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { ExpandPanelButton } from '../../../../../components/display/panels/slide-out';
import type { FormInstance } from 'antd';

const PANEL_WIDTH = 720;
const PANEL_WIDTH_EXPANDED = 1400;

const RoleIcon = Icons.Role;

interface CreateRolePanelProps {
  open: boolean;
  onClose: () => void;
  form: FormInstance<RoleFormValues>;
}

const CreateRolePanel: React.FC<CreateRolePanelProps> = ({ open, onClose, form }) => {
  const [expanded, setExpanded] = useState(false);
  const { handleCreate, submitting } = useRoleActions({ skipNavigate: true });
  const { roles } = useRoles();
  const { defaultCategoryId } = useRoleCategories();

  const initialValues = useMemo<RoleFormValues>(() => {
    const scopes: Record<string, ScopeFormValue> = {};
    RC.SCOPE.DEFAULT_AREAS.forEach((area) => {
      scopes[area.key] = { level: RC.PERMISSION_LEVEL.READ_ONLY };
    });
    return {
      name: '',
      description: '',
      categoryID: defaultCategoryId,
      type: RC.VALUES.ROLE_TYPE_CUSTOM,
      status: RC.STATUS.ACTIVE,
      scopes,
      validity: { type: RC.VALIDITY_TYPES.PERMANENT },
      protection: {
        preventDeletion: false,
        preventModification: false,
        preventScopeChanges: false,
        lockName: false,
        lockCategory: false,
        softDelete: false,
      },
      assignedTo: [],
    };
  }, [defaultCategoryId]);

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [open, form, initialValues]);

  const handleFinish = useCallback(
    async (values: RoleFormValues) => {
      const allFormValues = form.getFieldsValue(true) as RoleFormValues;
      const finalValues: RoleFormValues = {
        ...allFormValues,
        scopes: allFormValues.scopes || values.scopes || {},
        protection: allFormValues.protection ||
          values.protection || {
            preventDeletion: false,
            preventModification: false,
            preventScopeChanges: false,
            lockName: false,
            lockCategory: false,
            softDelete: false,
          },
      };
      const roleData = convertFormValuesToRoleFormData(finalValues, 'custom', 'Active');
      await handleCreate(roleData);
      form.resetFields();
      onClose();
    },
    [form, handleCreate, onClose],
  );

  return (
    <AnimationWrapper
      open={open}
      onClose={onClose}
      title={RC.LABELS.PANELS.CREATE.TITLE}
      width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
      headerExtra={
        <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((prev) => !prev)} />
      }
      footer={{
        onCancel: onClose,
        onPrimary: () => form.submit(),
        primaryLabel: RC.LABELS.PANELS.CREATE.SUBMIT_BUTTON,
        primaryLoading: submitting,
        primaryIcon: <RoleIcon size={16} />,
        primaryLoadingLabel: 'Creating...',
      }}
    >
      <RoleForm
        form={form}
        initialValues={initialValues}
        onSubmit={handleFinish}
        buttonText={RC.LABELS.PANELS.CREATE.SUBMIT_BUTTON}
        submitting={submitting}
        roles={roles}
        isEditMode={false}
        hideSubmitButton
        expanded={expanded}
      />
    </AnimationWrapper>
  );
};

export default CreateRolePanel;
