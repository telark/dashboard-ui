import type { ReactNode } from 'react';
import type { PermissionLevel } from '../../features/auth/models';

export interface RequiredPermission {
  scope: string;
  level: PermissionLevel;
  deny?: string;
}

export interface NoLoadingButtonInterface {
  action: string;
  onClick: () => void;
  icon?: ReactNode;
  color?: string;
  disabled?: boolean;
}

export interface ButtonInterface {
  text: string;
  icon: ReactNode;
  active?: boolean;
  hoverIcon?: ReactNode;
  route: string;
}

export interface Record {
  name: string;
  status: string;
  creationTime: string;
}
