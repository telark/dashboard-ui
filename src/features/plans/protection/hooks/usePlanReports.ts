import { useCallback, useEffect, useState } from 'react';
import { App as AntdApp } from 'antd';
import type { ExtendedAxiosError } from '../../../../api/client/normalize';
import logger from '../../../../logging';
import {
  downloadPlanReport,
  fetchAllPlanReports,
  fetchPlanReports,
  generatePlanReport,
  isReportBusy,
  isReportFileMissing,
} from '../clients';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import type { PlanReportFormat, PlanReportMeta } from '../models';

export interface UsePlanReportsResult {
  reports: PlanReportMeta[];
  loading: boolean;
  error: string | null;
  generating: boolean;
  downloading: string | null;
  generate: (userId: string) => Promise<void>;
  download: (report: PlanReportMeta, format: PlanReportFormat, filename: string) => Promise<void>;
  refresh: () => void;
}

export function usePlanReportDownload(
  onMissing: () => void,
): Pick<UsePlanReportsResult, 'downloading' | 'download'> {
  const { message } = AntdApp.useApp();
  const [downloading, setDownloading] = useState<string | null>(null);

  const download = useCallback(
    async (report: PlanReportMeta, format: PlanReportFormat, filename: string): Promise<void> => {
      setDownloading(`${report.id}:${format}`);
      try {
        await downloadPlanReport(report.planId, report, format, filename);
      } catch (err) {
        logger.warn(PPC.LABELS.REPORTS.DOWNLOAD_ERROR, err);
        if (isReportFileMissing(err)) {
          message.error(PPC.LABELS.REPORTS.DOWNLOAD_MISSING);
          onMissing();
        } else {
          message.error(PPC.LABELS.REPORTS.DOWNLOAD_ERROR);
        }
      } finally {
        setDownloading(null);
      }
    },
    [message, onMissing],
  );

  return { downloading, download };
}

export function useGeneratePlanReport(
  planId: string,
  onGenerated?: (meta: PlanReportMeta) => void,
): Pick<UsePlanReportsResult, 'generating' | 'generate'> {
  const { message } = AntdApp.useApp();
  const [generating, setGenerating] = useState(false);

  const generate = useCallback(
    async (userId: string): Promise<void> => {
      if (generating) return;
      setGenerating(true);
      try {
        const meta = await generatePlanReport(planId, userId);
        onGenerated?.(meta);
        message.success(PPC.LABELS.REPORTS.GENERATE_SUCCESS);
      } catch (err) {
        if (isReportBusy(err)) {
          message.warning(PPC.LABELS.REPORTS.GENERATE_BUSY);
        } else {
          const serverMessage = (err as ExtendedAxiosError)?.normalized?.message;
          message.error(serverMessage ?? PPC.LABELS.REPORTS.GENERATE_ERROR);
        }
      } finally {
        setGenerating(false);
      }
    },
    [generating, planId, message, onGenerated],
  );

  return { generating, generate };
}

export function usePlanReports(
  planId: string,
  revision: string,
  enabled: boolean,
): UsePlanReportsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<PlanReportMeta[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetchPlanReports(planId)
      .then((data) => {
        if (cancelled) return;
        setReports(data);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError(PPC.LABELS.REPORTS.LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, planId, reloadKey, revision]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const onGenerated = useCallback(
    (meta: PlanReportMeta) => setReports((prev) => [meta, ...prev]),
    [],
  );
  const { generating, generate } = useGeneratePlanReport(planId, onGenerated);
  const { downloading, download } = usePlanReportDownload(refresh);

  return { reports, loading, error, generating, downloading, generate, download, refresh };
}

export type UseAllPlanReportsResult = Omit<UsePlanReportsResult, 'generating' | 'generate'>;

export function useAllPlanReports(enabled: boolean): UseAllPlanReportsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<PlanReportMeta[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    fetchAllPlanReports()
      .then((data) => {
        if (cancelled) return;
        setReports(data);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError(PPC.LABELS.REPORTS.LOAD_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, reloadKey]);

  const refresh = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);
  const { downloading, download } = usePlanReportDownload(refresh);

  return { reports, loading, error, downloading, download, refresh };
}
