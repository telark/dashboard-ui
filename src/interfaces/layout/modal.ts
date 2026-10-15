import type React from 'react';

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
