import type React from 'react';
import type { FormInstance } from 'antd';

export interface TopPanelToolbarActions {
  onEdit?: () => void;
  onDelete?: () => void;
  /** When set, the button stays visible but disabled, with this reason as its tooltip. */
  editDisabledReason?: string;
  deleteDisabledReason?: string;
}

export interface AnimationWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
  toolbarActions?: TopPanelToolbarActions;
  headerExtra?: React.ReactNode;
  offsetX?: number;
  /** Cancel + primary action row, pinned below the scrolling body. */
  footer?: PanelFooterProps;
}

export interface PanelFooterProps {
  onCancel?: () => void;
  onPrimary?: () => void;
  cancelLabel?: string;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  primaryIcon?: React.ReactNode;
  primaryLoadingLabel?: string;
}

export interface SlideOutPanelProps extends Omit<AnimationWrapperProps, 'children' | 'footer'> {
  sectionTitle?: string;
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
