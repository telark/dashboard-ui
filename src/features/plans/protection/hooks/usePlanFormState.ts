import { useMemo } from 'react';
import { Form } from 'antd';
import type { FormInstance } from 'antd';
import type { FormValues, PolicyEntry } from '../components/create';

interface UsePlanFormStateOptions {
  form: FormInstance<FormValues>;
  isEditMode: boolean;
  initialValues: FormValues | null;
  initialPolicies: PolicyEntry[];
  policies: PolicyEntry[];
}

const stableStringify = (value: unknown): string => {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => `${k}:${stableStringify(obj[k])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

const normalizeFormSnapshot = (values: FormValues, policies: PolicyEntry[]) => ({
  name: values.name ?? '',
  description: values.description ?? '',
  severity: values.severity ?? '',
  priority: values.priority ?? null,
  mode: values.mode ?? '',
  scopeType: values.scopeType,
  applicationIds: [...(values.applicationIds ?? [])].sort(),
  namespaces: [...(values.namespaces ?? [])].sort(),
  timeMode: values.timeMode,
  startAt: values.startAt ? values.startAt.toISOString() : null,
  endAt: values.endAt ? values.endAt.toISOString() : null,
  participantsIDs: [...(values.participantsIDs ?? [])].sort(),
  policies: policies.map((p) => ({
    templateID: p.templateID,
    params: Object.fromEntries(
      Object.entries(p.params ?? {})
        .map<[string, string[]]>(([k, v]) => [k, [...(v ?? [])].sort()])
        .sort(([a], [b]) => a.localeCompare(b)),
    ),
  })),
});

export const usePlanFormState = ({
  form,
  isEditMode,
  initialValues,
  initialPolicies,
  policies,
}: UsePlanFormStateOptions) => {
  const watched = Form.useWatch([], form) as FormValues | undefined;

  const initialSnapshot = useMemo(() => {
    if (!isEditMode || !initialValues) return '';
    return stableStringify(normalizeFormSnapshot(initialValues, initialPolicies));
  }, [isEditMode, initialValues, initialPolicies]);

  const hasChanges = useMemo(() => {
    if (!isEditMode || !initialValues) return false;
    const current = (watched ?? form.getFieldsValue(true)) as FormValues;
    if (!current) return false;
    return stableStringify(normalizeFormSnapshot(current, policies)) !== initialSnapshot;
  }, [isEditMode, initialValues, watched, form, policies, initialSnapshot]);

  const hasFormErrors = useMemo(() => {
    void watched;
    return form.getFieldsError().some((f) => f.errors.length > 0);
  }, [form, watched]);

  return { hasChanges, hasFormErrors };
};
