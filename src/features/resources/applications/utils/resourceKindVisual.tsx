import React from 'react';
import {
  ApiOutlined,
  AppstoreOutlined,
  CloudServerOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HddOutlined,
  KeyOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../../constants';

export interface ResourceKindVisual {
  Icon: React.ComponentType<{ style?: React.CSSProperties }>;
  background: string;
  color: string;
}

const FALLBACK: ResourceKindVisual = {
  Icon: AppstoreOutlined,
  background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
  color: DEFAULT_COLORS.CHIP_CUSTOM_TEXT,
};

const KIND_VISUAL: Record<string, ResourceKindVisual> = {
  Deployment: {
    Icon: DeploymentUnitOutlined,
    background: DEFAULT_COLORS.CHIP_BLUE_BG,
    color: DEFAULT_COLORS.CHIP_BLUE_TEXT,
  },
  StatefulSet: {
    Icon: CloudServerOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  DaemonSet: {
    Icon: CloudServerOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  Job: {
    Icon: ThunderboltOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  CronJob: {
    Icon: ThunderboltOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  Service: {
    Icon: ApiOutlined,
    background: DEFAULT_COLORS.CHIP_BLUE_BG,
    color: DEFAULT_COLORS.CHIP_BLUE_TEXT,
  },
  Ingress: {
    Icon: GlobalOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  NetworkPolicy: {
    Icon: SafetyCertificateOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  ServiceAccount: {
    Icon: KeyOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  ConfigMap: {
    Icon: FileTextOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  Secret: {
    Icon: LockOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  PersistentVolumeClaim: {
    Icon: HddOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  HorizontalPodAutoscaler: {
    Icon: ThunderboltOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
  VerticalPodAutoscaler: {
    Icon: ThunderboltOutlined,
    background: DEFAULT_COLORS.CHIP_CUSTOM_BG,
    color: DEFAULT_COLORS.TEXT_SECONDARY,
  },
};

export function getResourceKindVisual(kind: string): ResourceKindVisual {
  return KIND_VISUAL[kind] ?? {
    ...FALLBACK,
  };
}
