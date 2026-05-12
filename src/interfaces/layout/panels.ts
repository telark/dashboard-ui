import type React from 'react';
import type { FormInstance } from 'antd';

export interface TopPanelToolbarActions {
  onEdit?: () => void;
  onDelete?: () => void;
}

export interface AnimationWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number;
  toolbarActions?: TopPanelToolbarActions;
  headerExtra?: React.ReactNode;
  offsetX?: number;
}

export interface SlideOutPanelProps extends Omit<AnimationWrapperProps, 'children'> {
  sectionTitle?: string;
  sectionSubtitle?: string;
  formContent: React.ReactNode;
  /** Header + scrollable body only; no form wrapper or footer (e.g. read-only viewers). */
  contentOnly?: boolean;
  onSubmit?: (values: Record<string, unknown>) => Promise<void> | void;
  onCancel?: () => void;
  submitButtonText?: string;
  submitButtonIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  initialValues?: Record<string, unknown>;
  cancelButtonText?: string;
  form?: FormInstance;
  onValuesChange?: (
    changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>,
  ) => void;
  onFieldsChange?: (changedFields: unknown[], allFields: unknown[]) => void;
}
