import React, { useCallback, useState } from 'react';
import { App as AntdApp } from 'antd';
import { ActionConfirmModal } from '../../../../components/display/modal';
import { TIME_FORMATS } from '../../../../constants';
import logger from '../../../../logging';
import { formatDateTime } from '../../../../utils/shared/time';
import { deletePlanReport, isReportFileMissing } from '../clients';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import type { PlanReportMeta } from '../models';

interface DeleteTarget {
  report: PlanReportMeta;
  planName: string;
}

export interface UsePlanReportDeleteResult {
  requestDelete: (report: PlanReportMeta, planName: string) => void;
  modal: React.ReactNode;
}

const L = PPC.LABELS.REPORTS;

const reportName = ({ report, planName }: DeleteTarget): string =>
  L.REPORT_NAME(
    planName,
    L.TRIGGER_LABELS[report.trigger],
    formatDateTime(report.generatedAt, TIME_FORMATS.DATE_TIME),
  );

// Asks before deleting one report, then refreshes the host's list. A report someone else
// deleted first is gone either way, so the list refreshes then too.
export function usePlanReportDelete(onDeleted: () => void): UsePlanReportDeleteResult {
  const { message } = AntdApp.useApp();
  // The target outlives the close, so the name stays put while the dialog fades out.
  const [target, setTarget] = useState<DeleteTarget | null>(null);
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const requestDelete = useCallback((report: PlanReportMeta, planName: string) => {
    setTarget({ report, planName });
    setOpen(true);
  }, []);

  const confirm = useCallback(async (): Promise<void> => {
    if (!target) return;
    setDeleting(true);
    try {
      await deletePlanReport(target.report);
      message.success(L.DELETE_SUCCESS);
      setOpen(false);
      onDeleted();
    } catch (err) {
      logger.warn(L.DELETE_ERROR, err);
      const missing = isReportFileMissing(err);
      message.error(missing ? L.DOWNLOAD_MISSING : L.DELETE_ERROR);
      if (missing) {
        setOpen(false);
        onDeleted();
      }
    } finally {
      setDeleting(false);
    }
  }, [target, message, onDeleted]);

  const modal = (
    <ActionConfirmModal
      open={open}
      onClose={() => setOpen(false)}
      onConfirm={confirm}
      title={L.DELETE_MODAL_TITLE}
      action={L.DELETE_ACTION}
      resourceName={target ? reportName(target) : ''}
      resourceType={L.RESOURCE_TYPE}
      note={L.DELETE_MODAL_NOTE}
      confirmText={L.DELETE_MODAL_OK}
      loading={deleting}
      getContainer={() => document.body}
    />
  );

  return { requestDelete, modal };
}
