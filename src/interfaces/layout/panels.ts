import type React from 'react';

export interface AnimationWrapperProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: number;
}

export interface SlideOutPanelProps extends Omit<AnimationWrapperProps, 'children'> {
  sectionTitle?: string;
  sectionSubtitle?: string;
  formContent: React.ReactNode;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  onCancel: () => void;
  submitButtonText: string;
  submitButtonIcon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  initialValues?: Record<string, unknown>;
  cancelButtonText?: string;
  onValuesChange?: (
    changedValues: Record<string, unknown>,
    allValues: Record<string, unknown>,
  ) => void;
  onFieldsChange?: (changedFields: unknown[], allFields: unknown[]) => void;
}
