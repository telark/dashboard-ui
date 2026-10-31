import { Client, discoveryApiClient, exporterApiClient } from '../../../../api/index';
import type { ExtendedAxiosError } from '../../../../api/client/normalize';
import { Endpoints } from '../../../../constants';
import {
  OBJECT_URL_REVOKE_DELAY_MS,
  REPORT_BUSY_STATUS,
  REPORT_DOWNLOAD_TIMEOUT_MS,
  REPORT_GENERATE_TIMEOUT_MS,
  REPORTS_LIST,
} from '../constants/protectionPlans';
import type {
  KeptPlanReports,
  PlanReportFormat,
  PlanReportMeta,
  ReportStorageInfos,
} from '../models';
import type { ApiResponse } from './shared';

export const fetchPlanReports = async (planId: string): Promise<PlanReportMeta[]> => {
  const res = await Client<ApiResponse<PlanReportMeta[]>>(
    exporterApiClient,
    Endpoints.REPORTS.PLANS.LIST(planId).path,
    { method: 'GET' },
  );
  return res.data;
};

// Newest first across every plan; the list is truncated at REPORTS_LIST.LIMIT.
export const fetchAllPlanReports = async (): Promise<PlanReportMeta[]> => {
  const qs = new URLSearchParams({ limit: String(REPORTS_LIST.LIMIT) }).toString();
  const res = await Client<ApiResponse<PlanReportMeta[]>>(
    exporterApiClient,
    `${Endpoints.REPORTS.LIST_ALL.path}?${qs}`,
    { method: 'GET' },
  );
  return res.data;
};

export const fetchKeptPlanReports = async (): Promise<KeptPlanReports[]> => {
  const res = await Client<ApiResponse<KeptPlanReports[]>>(
    exporterApiClient,
    Endpoints.REPORTS.LIST_KEPT.path,
    { method: 'GET' },
  );
  return res.data;
};

export const fetchReportStorage = async (): Promise<ReportStorageInfos> => {
  const res = await Client<ApiResponse<ReportStorageInfos>>(
    exporterApiClient,
    Endpoints.REPORTS.STORAGE.path,
    { method: 'GET' },
  );
  return res.data;
};

// Works for a live plan's report and for a kept one.
export const deletePlanReport = async (report: PlanReportMeta): Promise<void> => {
  const qs = new URLSearchParams({ report: report.id }).toString();
  await Client<ApiResponse<null>>(
    exporterApiClient,
    `${Endpoints.REPORTS.PLANS.DELETE(report.planId).path}?${qs}`,
    { method: 'DELETE' },
  );
};

export const generatePlanReport = async (planId: string): Promise<PlanReportMeta> => {
  const res = await Client<ApiResponse<PlanReportMeta>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.REPORTS_GENERATE(planId).path,
    {
      method: 'POST',
      timeout: REPORT_GENERATE_TIMEOUT_MS,
    },
  );
  return res.data;
};

export const isReportBusy = (error: unknown): boolean =>
  (error as ExtendedAxiosError)?.response?.status === REPORT_BUSY_STATUS;

export const isReportFileMissing = (error: unknown): boolean =>
  (error as ExtendedAxiosError)?.normalized?.isNotFound === true;

export const downloadPlanReport = async (
  planId: string,
  report: PlanReportMeta,
  format: PlanReportFormat,
  filename: string,
): Promise<void> => {
  const qs = new URLSearchParams({ report: report.id, format }).toString();
  const blob = await Client<Blob>(
    exporterApiClient,
    `${Endpoints.REPORTS.PLANS.DOWNLOAD(planId).path}?${qs}`,
    { method: 'GET', responseType: 'blob', timeout: REPORT_DOWNLOAD_TIMEOUT_MS },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // revoke on a later tick: a synchronous revoke can cancel the download in Firefox/Safari
  window.setTimeout(() => URL.revokeObjectURL(url), OBJECT_URL_REVOKE_DELAY_MS);
};
