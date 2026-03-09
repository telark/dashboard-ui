import React, { useMemo, useEffect, useState } from 'react';
import { Icons } from '../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../constants';
import RoleForm from '../../components/display/shared/RoleForm';
import { useRoleActions, useRoles, useEditRoleSubmit } from '../../hooks';
import { convertRoleToFormValues } from '../../utils';
import type { Role, RoleFormValues } from '../../models';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { PanelFooter } from '../../../../../components/display/panels/shared';
import { ExpandPanelButton } from '../../../../../components/display/panels/slide-out';
import type { FormInstance } from 'antd';

const PANEL_WIDTH = 720;
const PANEL_WIDTH_EXPANDED = 1400;

const RoleIcon = Icons.Role;

interface EditRolePanelProps {
  open: boolean;
  onClose: () => void;
  editingRole: Role | null;
  form: FormInstance<RoleFormValues>;
}

const EditRolePanel: React.FC<EditRolePanelProps> = ({ open, onClose, editingRole, form }) => {
  const [expanded, setExpanded] = useState(false);
  const { handleUpdate, submitting } = useRoleActions({ skipNavigate: true });
  const { roles } = useRoles();

  const initialValues = useMemo(
    () => (editingRole ? convertRoleToFormValues(editingRole) : null),
    [editingRole],
  );

  useEffect(() => {
    if (open && editingRole && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [open, editingRole, initialValues, form]);

  const roleForHook =
    editingRole ??
    ({
      id: '',
      name: '',
      description: '',
      version: '',
      type: RC.VALUES.ROLE_TYPE_CUSTOM,
      status: RC.STATUS.ACTIVE,
      categoryID: '',
      priority: 0,
      scopesAndPermissions: [],
      creationDate: '',
    } as Role);

  const { handleSubmit, isSubmitting } = useEditRoleSubmit({
    id: roleForHook.id,
    role: roleForHook,
    initialValues: initialValues ?? convertRoleToFormValues(null),
    form,
    handleUpdate,
    skipNavigate: true,
    onSuccess: onClose,
  });

  if (!editingRole || !initialValues) return null;

  const isSubmittingCombined = submitting || isSubmitting;

  return (
    <AnimationWrapper
      open={open}
      onClose={onClose}
      title={RC.LABELS.PANELS.EDIT.TITLE}
      subtitle={RC.LABELS.PANELS.EDIT.SUBTITLE(editingRole.name)}
      width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
      headerExtra={
        <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((prev) => !prev)} />
      }
    >
      <div style={{ overflow: 'auto', flex: 1 }}>
        <RoleForm
          form={form}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          buttonText={RC.LABELS.PANELS.EDIT.SUBMIT_BUTTON}
          submitting={isSubmittingCombined}
          roles={roles}
          isEditMode
          currentName={editingRole.name}
          hideSubmitButton
          expanded={expanded}
        />
      </div>
      <PanelFooter
        onCancel={onClose}
        onPrimary={() => form.submit()}
        cancelLabel="Cancel"
        primaryLabel={RC.LABELS.PANELS.EDIT.SUBMIT_BUTTON}
        primaryLoading={isSubmittingCombined}
        primaryIcon={<RoleIcon size={16} />}
        primaryLoadingLabel="Updating..."
        horizontalPadding={0}
      />
    </AnimationWrapper>
  );
};

export default EditRolePanel;
