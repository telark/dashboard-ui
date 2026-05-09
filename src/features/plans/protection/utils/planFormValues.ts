import dayjs from 'dayjs';
import type { PolicyEntry, FormValues } from '../components/create';
import type { ProtectionPlan } from '../models';
import type { PatchPlanPayload } from '../clients/protectionPlansClient';

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

const policiesEqual = (a: PolicyEntry[], b: PolicyEntry[]): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].templateID !== b[i].templateID) return false;
    const ap = a[i].params ?? {};
    const bp = b[i].params ?? {};
    const ak = Object.keys(ap).sort();
    const bk = Object.keys(bp).sort();
    if (ak.length !== bk.length) return false;
    for (let k = 0; k < ak.length; k++) {
      if (ak[k] !== bk[k]) return false;
      const av = normalizeStringArray(ap[ak[k]]);
      const bv = normalizeStringArray(bp[bk[k]]);
      if (av.length !== bv.length) return false;
      for (let j = 0; j < av.length; j++) {
        if (av[j] !== bv[j]) return false;
      }
    }
  }
  return true;
};

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

interface BuildPatchPayloadInput {
  plan: ProtectionPlan;
  values: FormValues;
  policies: PolicyEntry[];
}

const coercePriority = (priority: FormValues['priority']): number | undefined => {
  if (priority === undefined || priority === null || (priority as unknown) === '') return undefined;
  return parseInt(String(priority), 10);
};

export const buildPatchPayload = ({
  plan,
  values,
  policies,
}: BuildPatchPayloadInput): PatchPlanPayload => {
  const patch: PatchPlanPayload = {};

  if ((values.name ?? '') !== plan.name) {
    patch.name = values.name;
  }
  if ((values.description ?? '') !== (plan.description ?? '')) {
    patch.description = values.description ?? '';
  }
  if ((values.severity ?? '') !== (plan.severity ?? '')) {
    patch.severity = values.severity ?? '';
  }
  const nextPriority = coercePriority(values.priority);
  if (nextPriority !== plan.priority) {
    patch.priority = nextPriority;
  }
  if (values.mode !== plan.mode) {
    patch.mode = values.mode;
  }
  if (values.timeMode !== plan.timeMode) {
    patch.timeMode = values.timeMode;
  }

  const nextRange =
    values.timeMode === 'time_range' && values.startAt && values.endAt
      ? { startAt: values.startAt.toISOString(), endAt: values.endAt.toISOString() }
      : null;
  const prevRange = plan.timeRange
    ? { startAt: plan.timeRange.startAt, endAt: plan.timeRange.endAt }
    : null;
  const rangeChanged =
    (nextRange?.startAt ?? null) !== (prevRange?.startAt ?? null) ||
    (nextRange?.endAt ?? null) !== (prevRange?.endAt ?? null);
  if (rangeChanged) {
    patch.timeRange = nextRange;
  }

  if (plan.scope.type === 'applications') {
    if (!arraysEqualUnordered(values.applicationIds ?? [], plan.scope.applicationIds ?? [])) {
      patch.scope = { applicationIds: values.applicationIds ?? [] };
    }
  } else if (plan.scope.type === 'namespaces') {
    if (!arraysEqualUnordered(values.namespaces ?? [], plan.scope.namespaces ?? [])) {
      patch.scope = { namespaces: values.namespaces ?? [] };
    }
  }

  if (!policiesEqual(policies, plan.policies)) {
    patch.policies = policies.map((p) => ({ templateID: p.templateID, params: p.params }));
  }

  if (!arraysEqualUnordered(values.participantsIDs ?? [], plan.participantsIDs ?? [])) {
    patch.participantsIDs = values.participantsIDs ?? [];
  }

  return patch;
};

export const isPatchEmpty = (patch: PatchPlanPayload): boolean => Object.keys(patch).length === 0;

export const scopeItemsChanged = (plan: ProtectionPlan, values: FormValues): boolean => {
  if (plan.scope.type === 'applications') {
    return !arraysEqualUnordered(values.applicationIds ?? [], plan.scope.applicationIds ?? []);
  }
  return !arraysEqualUnordered(values.namespaces ?? [], plan.scope.namespaces ?? []);
};
