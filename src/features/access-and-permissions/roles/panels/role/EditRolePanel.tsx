import React, { useMemo, useState, useCallback } from 'react';
import { BUTTON_TEXTS, SLIDE_OUT } from '../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../constants';
import RoleForm from '../../components/display/shared/RoleForm';
import {
  useRoleActions,
  useRoles,
  useEditRoleSubmit,
  useNameValidation,
  useCanChangeRoleProtection,
} from '../../hooks';
import { convertRoleToFormValues, detectChanges } from '../../utils';
import type { Role, RoleFormValues } from '../../models';
import AnimationWrapper from '../../../../../components/display/panels/slide-out/AnimationWrapper';
import { ExpandPanelButton } from '../../../../../components/display/panels/slide-out';
import { Form } from 'antd';

const PANEL_WIDTH = 720;
const PANEL_WIDTH_EXPANDED = 1400;

// useWatch first calls its selector with {}, before the form holds the role (no scopes yet).
const roleChanged = (initialValues: RoleFormValues | null, values: RoleFormValues) =>
  Boolean(initialValues && values.scopes && detectChanges(initialValues, values).hasChanges);

interface EditRolePanelProps {
  open: boolean;
  onClose: () => void;
  editingRole: Role | null;
}

const EditRolePanel: React.FC<EditRolePanelProps> = ({ open, onClose, editingRole }) => {
  // The panel mounts per open, so a form of its own starts empty: a shared one merged the last
  // role's values into this one's, since the fields mount a frame after the panel.
  const [form] = Form.useForm<RoleFormValues>();
  const [expanded, setExpanded] = useState(false);
  const { handleUpdate, submitting } = useRoleActions();
  const { roles } = useRoles();
  const protectionEditable = useCanChangeRoleProtection(editingRole);
  const watchedName = Form.useWatch('name', form) as string | undefined;
  const { isNameInvalid } = useNameValidation({
    roles,
    isEditMode: true,
    currentName: editingRole?.name,
  });

  const initialValues = useMemo(
    () => (editingRole ? convertRoleToFormValues(editingRole) : null),
    [editingRole],
  );

  const selectHasChanges = useCallback(
    (values: RoleFormValues) => roleChanged(initialValues, values),
    [initialValues],
  );
  const hasChanges = Form.useWatch(selectHasChanges, { form, preserve: true });

  const roleForHook =
    editingRole ??
    ({
      id: '',
      name: '',
      description: '',
      version: '',
      type: RC.VALUES.ROLE_TYPE_CUSTOM,
      status: RC.STATUS.ACTIVE,
      categoryRef: '',
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
    onSuccess: onClose,
  });

  if (!editingRole || !initialValues) return null;

  const isSubmittingCombined = submitting || isSubmitting;

  return (
    <AnimationWrapper
      open={open}
      onClose={onClose}
      title={SLIDE_OUT.ENTITY_TITLE(RC.LABELS.PANELS.EDIT.TITLE, editingRole.name)}
      width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
      headerExtra={
        <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((prev) => !prev)} />
      }
      footer={{
        onCancel: onClose,
        onPrimary: () => form.submit(),
        primaryLabel: BUTTON_TEXTS.SAVE_CHANGES,
        primaryLoading: isSubmittingCombined,
        primaryDisabled: !hasChanges || isNameInvalid(watchedName),
      }}
    >
      <RoleForm
        form={form}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        roles={roles}
        isEditMode
        currentName={editingRole.name}
        expanded={expanded}
        protectionReadOnly={!protectionEditable}
      />
    </AnimationWrapper>
  );
};

export default EditRolePanel;
