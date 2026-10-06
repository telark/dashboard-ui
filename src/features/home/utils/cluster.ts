import { EMPTY_VALUE } from '../../../constants';
import { HOME_DASHBOARD_TEXTS as T } from '../constants/dashboard';
import type { ClusterVersionInfo } from '../models';

// kube-apiserver's GitVersion embeds the distribution as a suffix after the semver
// core, e.g. v1.29.2-eks-5e0fdde, v1.28.3-gke.1286000, v1.27.1+k3s1.
const DISTRIBUTION_MARKERS: [pattern: RegExp, label: string][] = [
  [/eks/i, 'EKS'],
  [/gke/i, 'GKE'],
  [/aks/i, 'AKS'],
  [/rke2/i, 'RKE2'],
  [/\brke\b/i, 'RKE'],
  [/k3s/i, 'k3s'],
  [/k0s/i, 'k0s'],
  [/-do\./i, 'DigitalOcean'],
  [/oke/i, 'OKE'],
  [/aliyun/i, 'Alibaba Cloud'],
];

export const parseClusterVersion = (gitVersion?: string): ClusterVersionInfo => {
  if (!gitVersion) {
    return { version: EMPTY_VALUE, distribution: EMPTY_VALUE, full: EMPTY_VALUE };
  }
  const match = gitVersion.match(/^(v?\d+\.\d+\.\d+)(.*)$/);
  if (!match) return { version: gitVersion, distribution: T.CLUSTER.VANILLA, full: gitVersion };
  const [, version, suffix] = match;
  if (!suffix) return { version, distribution: T.CLUSTER.VANILLA, full: gitVersion };
  const marker = DISTRIBUTION_MARKERS.find(([pattern]) => pattern.test(suffix));
  return {
    version,
    distribution: marker?.[1] ?? suffix.replace(/^[-+]/, ''),
    full: gitVersion,
  };
};
