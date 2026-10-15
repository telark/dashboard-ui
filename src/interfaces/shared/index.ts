import type { ReactNode } from 'react';
import type { PermissionLevel } from '../../features/auth/models';

export interface RequiredPermission {
  scope: string;
  level: PermissionLevel;
  deny?: string;
}

export interface ButtonInterface {
  text: string;
  icon: ReactNode;
  active?: boolean;
  route: string;
}
