import type { FormInstance } from 'antd';
import type { ReactNode, ComponentType } from 'react';
import type { Dayjs } from 'dayjs';
import type { PermissionLevel, ValidityType } from './types';
import type { Role } from './roles';

export interface ScopeFormValue {
  level: PermissionLevel;
  rules?: string[];
}

export interface RoleFormValues {
  name: string;
  description: string;
  categoryID: string;
  type?: string;
  status?: string;
  scopes: Record<string, ScopeFormValue>;
  validity?: {
    type: ValidityType;
    expirationModel?: 'expiresAt' | 'durationHours';
    expiresAt?: string | Dayjs;
    durationHours?: number;
    autoRevoke?: boolean;
  };
  protection?: {
    preventDeletion?: boolean;
    preventModification?: boolean;
    preventScopeChanges?: boolean;
    lockName?: boolean;
    lockCategory?: boolean;
    softDelete?: boolean;
  };
  assignedTo?: string[];
}

export interface RoleFormProps {
  form: FormInstance<RoleFormValues>;
  initialValues: RoleFormValues;
  onSubmit: (values: RoleFormValues) => void;
  buttonText: string;
  submitting?: boolean;
  wrapper?: ComponentType<{ children: ReactNode }>;
  roles: Role[];
  isEditMode?: boolean;
  currentName?: string;
  /** When true, do not render the submit button (e.g. when used inside SlideOutPanel). */
  hideSubmitButton?: boolean;
  /** When true, show two columns: General/Validity/Protection | Scope & Permissions. */
  expanded?: boolean;
}
