import type { FormInstance } from 'antd';
import type { ReactNode, ComponentType } from 'react';
import type { RoleScopePermission } from './types';
import type { Role } from './roles';

export interface RoleFormValues {
  name: string;
  type?: string;
  status?: string;
  scopes: Record<string, RoleScopePermission[]>;
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
}
