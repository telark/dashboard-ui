import dayjs from 'dayjs';
import type { PolicyEntry, FormValues } from '../components/create';
import type { ProtectionPlan } from '../models';

export const DEFAULT_FORM_VALUES: FormValues = {
  name: '',
  description: '',
  severity: undefined,
  priority: undefined,
  mode: 'audit',
  scopeType: 'namespaces',
  applicationIds: [],
  namespaces: [],
  timeMode: 'permanent',
  startAt: undefined,
  endAt: undefined,
  participantsIDs: [],
};

export const planToFormValues = (plan: ProtectionPlan): FormValues => ({
  name: plan.name,
  description: plan.description ?? '',
  severity: plan.severity,
  priority: plan.priority,
  mode: plan.mode,
  scopeType: plan.scope.type,
  applicationIds: plan.scope.applicationIds ?? [],
  namespaces: plan.scope.namespaces ?? [],
  timeMode: plan.timeMode,
  startAt: plan.timeRange ? dayjs(plan.timeRange.startAt) : undefined,
  endAt: plan.timeRange ? dayjs(plan.timeRange.endAt) : undefined,
  participantsIDs: plan.participantsIDs ?? [],
});

export const planToPolicies = (plan: ProtectionPlan): PolicyEntry[] =>
  plan.policies.map((p) => ({ templateID: p.templateID, params: { ...(p.params ?? {}) } }));

const normalizeStringArray = (arr: string[] | undefined): string[] => [...(arr ?? [])].sort();

const arraysEqualUnordered = (a: string[], b: string[]): boolean => {
  const ax = normalizeStringArray(a);
  const bx = normalizeStringArray(b);
  if (ax.length !== bx.length) return false;
  return ax.every((v, i) => v === bx[i]);
};

interface BuildPreparePayloadInput {
  values: FormValues;
  policies: PolicyEntry[];
}

export const buildPreparePayload = ({ values, policies }: BuildPreparePayloadInput) => ({
  name: values.name,
  description: values.description,
  severity: values.severity,
  priority:
    values.priority !== undefined && values.priority !== null && (values.priority as unknown) !== ''
      ? parseInt(String(values.priority), 10)
      : undefined,
  mode: values.mode,
  timeMode: values.timeMode,
  scope: {
    type: values.scopeType,
    applicationIds: values.scopeType === 'applications' ? (values.applicationIds ?? []) : [],
    namespaces: values.scopeType === 'namespaces' ? (values.namespaces ?? []) : [],
  },
  policies: policies.map((p) => ({ templateID: p.templateID, params: p.params })),
  timeRange:
    values.timeMode === 'time_range' && values.startAt && values.endAt
      ? { startAt: values.startAt.toISOString(), endAt: values.endAt.toISOString() }
      : undefined,
  participantsIDs: values.participantsIDs ?? [],
});

export const scopeItemsChanged = (plan: ProtectionPlan, values: FormValues): boolean => {
  if (plan.scope.type === 'applications') {
    return !arraysEqualUnordered(values.applicationIds ?? [], plan.scope.applicationIds ?? []);
  }
  return !arraysEqualUnordered(values.namespaces ?? [], plan.scope.namespaces ?? []);
};
