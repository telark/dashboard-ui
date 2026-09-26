import dayjs from 'dayjs';
import type { PolicyEntry, FormValues } from '../components/create';
import type { ParamSpec, PlanExcludedResource, PlanTemplate, ProtectionPlan } from '../models';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';

const { FORM } = PPC.CREATE_PAGE;

export const RESOURCE_KEY_SEPARATOR = '/';

export const encodeResourceKey = (r: PlanExcludedResource): string =>
  [r.kind, r.namespace, r.name].join(RESOURCE_KEY_SEPARATOR);

export const decodeResourceKey = (key: string): PlanExcludedResource | null => {
  const parts = key.split(RESOURCE_KEY_SEPARATOR);
  if (parts.length !== 3 || parts.some((p) => p === '')) return null;
  const [kind, namespace, name] = parts;
  return { kind, name, namespace };
};

export const DEFAULT_FORM_VALUES: FormValues = {
  name: '',
  description: '',
  severity: undefined,
  priority: undefined,
  mode: 'audit',
  scopeType: 'namespaces',
  applicationRefs: [],
  namespaces: [],
  excludedKinds: [],
  excludedResources: [],
  timeMode: 'permanent',
  startAt: undefined,
  endAt: undefined,
  participantRefs: [],
  environmentRef: undefined,
  tagRefs: [],
  approvalMode: 'automatic',
};

export const planToFormValues = (plan: ProtectionPlan): FormValues => ({
  name: plan.name,
  description: plan.description ?? '',
  severity: plan.severity,
  priority: plan.priority,
  mode: plan.mode,
  scopeType: plan.scope.type,
  applicationRefs: plan.scope.applicationRefs ?? [],
  namespaces: plan.scope.namespaces ?? [],
  excludedKinds: plan.scope.exclusions?.kinds ?? [],
  excludedResources: (plan.scope.exclusions?.resources ?? []).map(encodeResourceKey),
  timeMode: plan.timeMode,
  startAt: plan.timeRange ? dayjs(plan.timeRange.startAt) : undefined,
  endAt: plan.timeRange ? dayjs(plan.timeRange.endAt) : undefined,
  participantRefs: plan.participantRefs ?? [],
  environmentRef: plan.environmentRef || undefined,
  tagRefs: plan.tagRefs ?? [],
  approvalMode: plan.approvalMode ?? 'automatic',
});

export const planToPolicies = (plan: ProtectionPlan): PolicyEntry[] =>
  (plan.policies ?? []).map((p) => ({ templateID: p.templateID, params: { ...(p.params ?? {}) } }));

const matchesPattern = (pattern: string, value: string): boolean => {
  try {
    return new RegExp(pattern).test(value);
  } catch {
    // A pattern this browser cannot compile is left to the backend.
    return true;
  }
};

// Mirrors the backend's required-param checks: non-empty, and every entry matches the pattern.
export const paramError = (entry: PolicyEntry, param: ParamSpec): string | undefined => {
  if (!param.required) return undefined;
  const values = entry.params[param.key] ?? [];
  if (values.length === 0) return FORM.PARAM_REQUIRED_ERROR;
  const { pattern } = param;
  const invalid = pattern ? values.find((v) => !matchesPattern(pattern, v)) : undefined;
  return invalid === undefined ? undefined : FORM.PARAM_PATTERN_ERROR(invalid);
};

export const hasInvalidParams = (policies: PolicyEntry[], templates: PlanTemplate[]): boolean =>
  policies.some((entry) =>
    (templates.find((t) => t.id === entry.templateID)?.params ?? []).some(
      (param) => paramError(entry, param) !== undefined,
    ),
  );

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
    applicationRefs: values.scopeType === 'applications' ? (values.applicationRefs ?? []) : [],
    namespaces: values.scopeType === 'namespaces' ? (values.namespaces ?? []) : [],
    exclusions: {
      kinds: values.excludedKinds ?? [],
      resources:
        values.scopeType === 'applications'
          ? (values.excludedResources ?? [])
              .map(decodeResourceKey)
              .filter((r): r is PlanExcludedResource => r !== null)
          : [],
    },
  },
  policies: policies.map((p) => ({ templateID: p.templateID, params: p.params })),
  timeRange:
    values.timeMode === 'time_range' && values.startAt && values.endAt
      ? { startAt: values.startAt.toISOString(), endAt: values.endAt.toISOString() }
      : undefined,
  participantRefs: values.participantRefs ?? [],
  environmentRef: values.environmentRef ?? '',
  tagRefs: values.tagRefs ?? [],
  approvalMode: values.approvalMode,
});

const exclusionsChanged = (plan: ProtectionPlan, values: FormValues): boolean =>
  !arraysEqualUnordered(values.excludedKinds ?? [], plan.scope.exclusions?.kinds ?? []) ||
  !arraysEqualUnordered(
    values.excludedResources ?? [],
    (plan.scope.exclusions?.resources ?? []).map(encodeResourceKey),
  );

export const scopeItemsChanged = (plan: ProtectionPlan, values: FormValues): boolean => {
  if (exclusionsChanged(plan, values)) return true;
  if (plan.scope.type === 'applications') {
    return !arraysEqualUnordered(values.applicationRefs ?? [], plan.scope.applicationRefs ?? []);
  }
  return !arraysEqualUnordered(values.namespaces ?? [], plan.scope.namespaces ?? []);
};
