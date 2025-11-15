import type { ReactNode } from 'react';

export interface HeaderProps {
  title?: string;
  subtitle?: string | ReactNode;
  onPrimary?: () => void;
  primaryText?: string;
  breadcrumbs?: Array<{ label: string; to?: string }>;
  primaryIcon?: ReactNode;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  secondaryText?: string;
  onSecondary?: () => void;
  secondaryIcon?: ReactNode;
  icon?: ReactNode;
  iconColor?: string;
  iconBackground?: string;
  extraContent?: ReactNode;
}
