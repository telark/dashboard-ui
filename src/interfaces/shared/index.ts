import type { ReactNode, CSSProperties } from 'react';

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

export interface Record {
  name: string;
  status: string;
  creationTime: string;
}
