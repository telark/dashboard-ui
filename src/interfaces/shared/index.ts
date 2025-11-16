import type { ReactNode } from 'react';
import type { CSSProperties } from 'react';

export interface LoadingButtonInterface {
  action: string;
  loading?: boolean;
  loadingLabel: string;
  onClick: () => void;
  icon: ReactNode;
  color?: string;
  disabled?: boolean;
  style?: CSSProperties;
}

export interface NoLoadingButtonInterface {
  action: string;
  onClick: () => void;
  icon?: ReactNode;
  color?: string;
  disabled?: boolean;
}

export interface ResourcesInterface {
  resources: ResourceRowInterface[];
}

export interface ResourceRowInterface {
  name: string;
  lastSync: string;
  type: string;
  status: string;
  sourceName?: string;
  sourceType?: string;
  syncName?: string;
  creationTime?: string;
}

export interface GeneralInfoInterface {
  name: string;
  creationTime: string;
  lastUpdateTime: string;
  status: string;
}

export interface ButtonInterface {
  text: string;
  icon: ReactNode;
  active?: boolean;
  hoverIcon?: ReactNode;
  route: string;
}

export interface MetricInterface {
  label: string;
  value: number;
}

export interface HistoryInterface {
  Records: Record[];
}

export interface Record {
  name: string;
  status: string;
  creationTime: string;
}
