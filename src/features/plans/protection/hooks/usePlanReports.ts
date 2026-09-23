import { useCallback, useEffect, useState } from 'react';
import { App as AntdApp } from 'antd';
import type { ExtendedAxiosError } from '../../../../api/client/normalize';
import logger from '../../../../logging';
import {
  downloadPlanReport,
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

export function usePlanReports(planId: string, revision: string): UsePlanReportsResult {
  const { message } = AntdApp.useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<PlanReportMeta[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
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
  }, [planId, reloadKey, revision]);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  const generate = useCallback(
    async (userId: string): Promise<void> => {
      if (generating) return;
      setGenerating(true);
      try {
        const meta = await generatePlanReport(planId, userId);
        setReports((prev) => [meta, ...prev]);
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
    [generating, planId, message],
  );

  const download = useCallback(
    async (report: PlanReportMeta, format: PlanReportFormat, filename: string): Promise<void> => {
      setDownloading(`${report.id}:${format}`);
      try {
        await downloadPlanReport(planId, report, format, filename);
      } catch (err) {
        logger.warn(PPC.LABELS.REPORTS.DOWNLOAD_ERROR, err);
        if (isReportFileMissing(err)) {
          message.error(PPC.LABELS.REPORTS.DOWNLOAD_MISSING);
          refresh();
        } else {
          message.error(PPC.LABELS.REPORTS.DOWNLOAD_ERROR);
        }
      } finally {
        setDownloading(null);
      }
    },
    [planId, message, refresh],
  );

  return { reports, loading, error, generating, downloading, generate, download, refresh };
}
