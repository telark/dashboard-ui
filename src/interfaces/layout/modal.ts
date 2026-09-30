import type React from 'react';
import type { Rule } from 'antd/es/form';

export interface FormFieldConfig {
  type: 'input' | 'select' | 'textarea';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  marginBottom?: number;
  rules?: Rule[];
}

export interface BaseModalProps {
  open: boolean;
  onCancel: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  title?: string;
  description?: React.ReactNode;
  width?: number;
  /** false: no close button, and neither the mask nor Esc closes the modal. */
  closable?: boolean;
  /** Defaults to document.body; false renders the modal in place. */
  getContainer?: false | (() => HTMLElement);
  /** Shifts the modal's centering leftward by this many px (when a side panel is open). */
  offsetRight?: number;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}
