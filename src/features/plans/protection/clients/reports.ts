import { Client, discoveryApiClient, exporterApiClient } from '../../../../api/index';
import type { ExtendedAxiosError } from '../../../../api/client/normalize';
import { Endpoints, HTTP_HEADERS } from '../../../../constants';
import {
  OBJECT_URL_REVOKE_DELAY_MS,
  REPORT_BUSY_STATUS,
  REPORT_DOWNLOAD_TIMEOUT_MS,
  REPORT_GENERATE_TIMEOUT_MS,
} from '../constants/protectionPlans';
import type { PlanReportFormat, PlanReportMeta } from '../models';
import type { ApiResponse } from './shared';

export const fetchPlanReports = async (planId: string): Promise<PlanReportMeta[]> => {
  const res = await Client<ApiResponse<PlanReportMeta[]>>(
    exporterApiClient,
    Endpoints.REPORTS.PLANS.LIST(planId).path,
    { method: 'GET' },
  );
  return res.data;
};

export const generatePlanReport = async (
  planId: string,
  userId: string,
): Promise<PlanReportMeta> => {
  const res = await Client<ApiResponse<PlanReportMeta>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.REPORTS_GENERATE(planId).path,
    {
      method: 'POST',
      headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userId },
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
