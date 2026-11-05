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

// One-shot navigate state that opens the Protection plans create panel (Home's Get started card).
export interface CreatePlanRouteState {
  createPlan: true;
}
