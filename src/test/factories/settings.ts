import type { SnapshotStorageInfos } from '../../features/applications/models';
import type { BootstrapStatus } from '../../features/bootstrap/models/bootstrap';
import type { ReportStorageInfos } from '../../features/plans/protection/models';

const metric = (mb: number, percent: number) => ({
  bytes: mb * 1_048_576,
  kb: mb * 1024,
  mb,
  percent,
});

export const buildSnapshotStorage = (
  overrides: Partial<SnapshotStorageInfos> = {},
): SnapshotStorageInfos => ({
  totalPVCSpace: metric(1000, 100),
  consumedSpace: metric(250, 25),
  availableSpace: metric(750, 75),
  totalSnapshots: 12,
  ...overrides,
});

export const buildReportStorage = (
  overrides: Partial<ReportStorageInfos> = {},
): ReportStorageInfos => ({
  totalPVCSpace: metric(500, 100),
  consumedSpace: metric(50, 10),
  availableSpace: metric(450, 90),
  totalReports: 3,
  ...overrides,
});

export const buildBootstrapStatus = (
  overrides: Partial<BootstrapStatus> = {},
): BootstrapStatus => ({
  userID: 'user-1',
  email: 'test@example.com',
  pinnedAt: '2026-01-15T10:00:00Z',
  notifyAdmins: true,
  waitHours: 72,
  requests: [],
  ...overrides,
});
