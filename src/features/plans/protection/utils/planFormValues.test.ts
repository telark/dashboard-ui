import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { buildPlan, buildPlanTemplate } from '../../../../test/factories/plans';
import type { FormValues, PolicyEntry } from '../components/create';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import {
  DEFAULT_FORM_VALUES,
  applicationPlanValues,
  buildPreparePayload,
  decodeResourceKey,
  encodeResourceKey,
  hasInvalidParams,
  paramError,
  planToFormValues,
  planToPolicies,
  repeatFormValues,
  repeatPayload,
  scopeItemsChanged,
} from './planFormValues';

const { FORM } = PPC.CREATE_PAGE;
const values = (overrides: Partial<FormValues> = {}): FormValues => ({
  ...DEFAULT_FORM_VALUES,
  name: ' freeze ',
  ...overrides,
});

describe('buildPreparePayload', () => {
  const prepare = (overrides: Partial<FormValues>, policies: PolicyEntry[] = []) =>
    buildPreparePayload({ values: values(overrides), policies });

  it('trims the name and description, and turns a typed priority into a number', () => {
    const payload = prepare({ description: ' spring freeze ', priority: '7' as unknown as number });

    expect(payload).toMatchObject({ name: 'freeze', description: 'spring freeze', priority: 7 });
  });

  it.each([undefined, null, ''])('leaves the priority out for %j', (priority) => {
    const payload = prepare({ priority: priority as number | undefined });

    expect(payload.priority).toBeUndefined();
  });

  it('sends only the targets of the chosen scope type', () => {
    const payload = prepare(
      {
        scopeType: 'applications',
        applicationRefs: ['orders'],
        namespaces: ['payments'],
        excludedKinds: ['Secret'],
        excludedResources: ['Deployment/payments/orders', 'not-a-key'],
      },
      [{ templateID: 'block-delete', params: { kinds: ['Pod'] } }],
    );

    expect(payload.scope).toEqual({
      type: 'applications',
      applicationRefs: ['orders'],
      namespaces: [],
      exclusions: {
        kinds: ['Secret'],
        resources: [{ kind: 'Deployment', namespace: 'payments', name: 'orders' }],
      },
    });
    expect(payload.policies).toEqual([{ templateID: 'block-delete', params: { kinds: ['Pod'] } }]);
  });

  it('drops resource exclusions on a namespace scope', () => {
    const payload = prepare({
      scopeType: 'namespaces',
      namespaces: ['payments'],
      excludedResources: ['Deployment/payments/orders'],
    });

    expect(payload.scope.exclusions.resources).toEqual([]);
    expect(payload.scope.applicationRefs).toEqual([]);
  });

  it('sends the window of a time-range plan', () => {
    const [startAt, endAt] = [dayjs('2026-03-01T08:00:00Z'), dayjs('2026-03-02T08:00:00Z')];

    const payload = prepare({ timeMode: 'time_range', startAt, endAt });

    expect(payload.timeRange).toEqual({
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    });
    expect(payload.repeat).toBeUndefined();
  });

  it('sends a repeat rule with its days in week order', () => {
    const payload = prepare({
      timeMode: 'repeating',
      repeatDays: ['fri', 'mon'],
      repeatTimeZone: 'UTC',
    });

    expect(payload.repeat).toEqual({
      days: ['mon', 'fri'],
      startTime: '',
      endTime: '',
      timeZone: 'UTC',
    });
    expect(payload.timeRange).toBeUndefined();
  });
});

describe('repeat form values', () => {
  it('round-trips a stored rule through the form', () => {
    const repeat = {
      days: ['mon' as const],
      startTime: '08:30',
      endTime: '20:00',
      timeZone: 'UTC',
    };

    expect(repeatPayload(repeatFormValues(repeat))).toEqual(repeat);
  });

  it('defaults a new rule to the time zone alone', () => {
    expect(Object.keys(repeatFormValues())).toEqual(['repeatTimeZone']);
  });
});

describe('resource keys', () => {
  const resource = { kind: 'Service', namespace: 'payments', name: 'orders' };

  it('round-trips', () => {
    expect(decodeResourceKey(encodeResourceKey(resource))).toEqual(resource);
  });

  it.each(['Service/payments', 'Service//orders', 'a/b/c/d'])('rejects %s', (key) => {
    expect(decodeResourceKey(key)).toBeNull();
  });
});

describe('planToFormValues', () => {
  it('reads a repeating plan back into form fields', () => {
    const plan = buildPlan({
      scope: {
        type: 'namespaces',
        applicationRefs: [],
        namespaces: ['payments'],
        exclusions: {
          kinds: ['Secret'],
          resources: [{ kind: 'Deployment', namespace: 'payments', name: 'orders' }],
        },
      },
      timeMode: 'repeating',
      repeat: { days: ['tue'], startTime: '09:00', endTime: '18:00', timeZone: 'UTC' },
      policies: [{ templateID: 'block-delete', params: { kinds: ['Pod'] } }],
    });

    const form = planToFormValues(plan);

    expect(form).toMatchObject({
      scopeType: 'namespaces',
      namespaces: ['payments'],
      excludedKinds: ['Secret'],
      excludedResources: ['Deployment/payments/orders'],
      repeatDays: ['tue'],
    });
    expect(planToPolicies(plan)).toEqual(plan.policies);
  });

  it('defaults the fields a plan may lack', () => {
    const plan = buildPlan({ description: undefined, approvalMode: undefined });

    expect(planToFormValues(plan)).toMatchObject({
      description: '',
      approvalMode: 'automatic',
      startAt: undefined,
    });
  });
});

describe('applicationPlanValues', () => {
  it('names the plan after the application and numbers it past taken names', () => {
    const base = 'Orders protection';

    expect(applicationPlanValues({ name: 'orders', title: 'Orders' }, [])).toMatchObject({
      scopeType: 'applications',
      applicationRefs: ['orders'],
      name: base,
    });
    expect(
      applicationPlanValues({ name: 'orders', title: 'Orders' }, [base.toLowerCase(), `${base} 2`])
        .name,
    ).toBe(`${base} 3`);
  });
});

describe('paramError and hasInvalidParams', () => {
  const param = { key: 'tags', label: 'Tags', type: 'string-array' as const, required: true };
  const withPattern = { ...param, pattern: String.raw`^v\d+$` };

  it.each([
    ['optional param', { ...param, required: false }, [], undefined],
    ['empty required param', param, [], FORM.PARAM_REQUIRED_ERROR],
    ['filled param', param, ['v1'], undefined],
    ['value matching the pattern', withPattern, ['v1'], undefined],
    ['value failing the pattern', withPattern, ['main'], FORM.PARAM_PATTERN_ERROR('main')],
    ['uncompilable pattern', { ...param, pattern: '(' }, ['anything'], undefined],
  ])('%s', (_label, spec, entered, expected) => {
    const entry = { templateID: 't', params: { tags: entered } };

    expect(paramError(entry, spec)).toBe(expected);
  });

  it('flags a policy with a bad required param against its template', () => {
    const template = buildPlanTemplate({ id: 't', params: [param] });

    expect(hasInvalidParams([{ templateID: 't', params: {} }], [template])).toBe(true);
    expect(hasInvalidParams([{ templateID: 't', params: { tags: ['v1'] } }], [template])).toBe(
      false,
    );
    expect(hasInvalidParams([{ templateID: 'unknown', params: {} }], [template])).toBe(false);
  });
});

describe('scopeItemsChanged', () => {
  const plan = buildPlan({
    scope: {
      type: 'applications',
      applicationRefs: ['orders', 'billing'],
      namespaces: [],
      exclusions: { kinds: ['Secret'], resources: [] },
    },
  });
  const base = { applicationRefs: ['billing', 'orders'], excludedKinds: ['Secret'] };

  it.each([
    ['same selection in another order', base, false],
    ['an application removed', { ...base, applicationRefs: ['orders'] }, true],
    ['an exclusion changed', { ...base, excludedKinds: [] }, true],
  ])('%s', (_label, change, expected) => {
    expect(scopeItemsChanged(plan, values(change))).toBe(expected);
  });

  it('reads namespaces on a namespace scope', () => {
    const scoped = buildPlan({
      scope: { type: 'namespaces', applicationRefs: [], namespaces: ['payments'] },
    });

    expect(scopeItemsChanged(scoped, values({ namespaces: ['payments'] }))).toBe(false);
    expect(scopeItemsChanged(scoped, values({ namespaces: ['ops'] }))).toBe(true);
  });
});
