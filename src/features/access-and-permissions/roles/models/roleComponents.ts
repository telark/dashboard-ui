import type React from 'react';
import type { Role } from './roles';
import type { RolesSortKey, PermissionLevel } from './types';
import type { ScopeRule } from '../constants/scopeRules';

export interface RolesGeneralSectionProps {
  roles: Role[];
  isEditMode?: boolean;
  currentName?: string;
  lockName?: boolean;
  lockCategory?: boolean;
  onManualChange?: () => void;
}

export interface ActionsProps {
  record: Role;
  onView: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete: (r: Role) => void;
}

export interface ScopesPermissionsProps {
  scopes: Record<string, { level: string; rules?: string[] }>;
}

import type { Category } from '../../categories/models';

export interface ColumnsArgs {
  onView?: (r: Role) => void;
  onEdit?: (r: Role) => void;
  onDelete?: (r: Role) => void;
  onSort: (key: RolesSortKey) => void;
  activeSortKey: RolesSortKey;
  sortOrder?: 'asc' | 'desc';
  getPermissionCount: (r: Role) => number;
  categories?: Category[];
}

export interface ScopesAndPermissionsSectionProps {
  isLocked?: boolean;
  onManualChange?: () => void;
  initialValues?: { scopes?: Record<string, { level: string; rules?: string[] }> } | null;
}

export interface ProtectionSectionProps {
  onManualChange?: () => void;
}

export interface FieldChangeWatcherProps {
  fieldName: string;
  onChange?: () => void;
}

export interface AssignmentSectionProps {
  onManualChange?: () => void;
}

export interface ScopeRowProps {
  scopeKey: string;
  scopeLabel: string;
  permissionLevels: readonly { value: PermissionLevel; label: string }[];
  tooltipMap: Record<string, string>;
  onLevelChange?: (scopeKey: string, level: PermissionLevel) => void;
  onRuleToggle?: (scopeKey: string, formattedKey: string, checked: boolean) => void;
  rowPaddingPx?: number;
  isLast?: boolean;
  isLocked?: boolean;
  onManualChange?: () => void;
  initialScopeValue?: { level: string; rules?: string[] };
}

export interface LevelSelectorProps {
  value: PermissionLevel;
  onChange: (value: PermissionLevel) => void;
  options: readonly { value: PermissionLevel; label: string }[];
  tooltipMap: Record<PermissionLevel, string>;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export interface RulesItemProps {
  ruleLabel: string;
  formattedKey: string;
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
}

export interface RulesListProps {
  rules: ScopeRule[];
  scopeKey: string;
  selectedRules: string[];
  onRuleToggle: (formattedKey: string, checked: boolean) => void;
  formatRuleKey: (scope: string, ruleKey: string) => string;
}

export interface AssignmentSelectOption {
  label: React.ReactNode;
  value: string;
  displayName?: string;
}

export interface AssignmentSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  options: AssignmentSelectOption[];
  placeholder?: string;
  loading?: boolean;
  allOptionsMap?: Map<string, string>;
  className?: string;
  allowClear?: boolean;
  showSearch?: boolean;
  filterOption?: (input: string, option?: AssignmentSelectOption) => boolean;
}

export interface UsersSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  allOptionsMap?: Map<string, string>;
  onOptionsMapUpdate?: (map: Map<string, string>) => void;
}

export interface GroupsSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  allOptionsMap?: Map<string, string>;
  onOptionsMapUpdate?: (map: Map<string, string>) => void;
}

export interface RolesActionBarProps {
  selectedCount: number;
  hasSelection: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}
