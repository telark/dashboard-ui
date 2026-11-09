import dayjs from 'dayjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildRole } from '../../../../test/factories/roles';
import { ROLES_CONSTANTS as RC } from '../constants';
import type { RoleFormData, RoleFormValues } from '../models';
import {
  buildFieldsUpdatePayload,
  buildUpdatePayload,
  buildValidityForAPI,
  buildValidityForForm,
  canDeleteRole,
  canModifyRole,
  convertFormValuesToRoleFormData,
  convertRoleToFormValues,
  convertScopesFromAPI,
  convertScopesToAPI,
  deepEqual,
  detectChanges,
  formatValidity,
  isBuiltInRole,
  isRoleProtected,
  mapRoleDetailsData,
  mapRolesData,
  normalizeValue,
  type ChangeDetectionResult,
} from '.';

const NOW = new Date('2026-06-01T12:00:00Z');
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const fromNow = (ms: number) => new Date(NOW.getTime() + ms).toISOString();

const formValues = (overrides: Partial<RoleFormValues> = {}): RoleFormValues => ({
  name: 'release_lead',
  description: 'Leads releases',
  categoryRef: 'cat-1',
  scopes: { applications: { level: 'ReadOnly', rules: ['b', 'a'] } },
  validity: { type: 'permanent' },
  protection: {},
  ...overrides,
});

describe('deepEqual', () => {
  it.each([
    [1, 1, true],
    [null, null, true],
    [null, {}, false],
    [{}, undefined, false],
    [1, '1', false],
    ['a', 'b', false],
    [[1, [2]], [1, [2]], true],
    [[1], [1, 2], false],
    [[1], { 0: 1 }, false],
    [{ a: { b: 1 } }, { a: { b: 1 } }, true],
    [{ a: 1 }, { a: 1, b: 2 }, false],
    [{ a: 1 }, { a: 2 }, false],
  ])('compares %j and %j as %j', (left, right, expected) => {
    expect(deepEqual(left, right)).toBe(expected);
  });
});

describe('normalizeValue', () => {
  it.each([
    [null, undefined],
    [undefined, undefined],
    ['  ', undefined],
    [0, 0],
    ['keep', 'keep'],
    [[], undefined],
    [[null, '', undefined], undefined],
    [
      [' B ', 'a'],
      ['a', 'b'],
    ],
    [
      [1, { a: '' }, { a: 2 }],
      [1, undefined, { a: 2 }],
    ],
    [{ a: '', b: null }, undefined],
    [{ a: ' ', b: 'x', c: [] }, { b: 'x' }],
  ])('turns %j into %j', (input, expected) => {
    expect(normalizeValue(input)).toEqual(expected);
  });
});

describe('detectChanges', () => {
  const noChange: ChangeDetectionResult = {
    protectionHasChanged: false,
    unlockingScopes: false,
    unlockingName: false,
    unlockingCategory: false,
    scopesHaveChanged: false,
    nameHasChanged: false,
    categoryHasChanged: false,
    descriptionHasChanged: false,
    validityHasChanged: false,
    hasChanges: false,
    needsTwoStepUpdate: false,
    modificationLocked: false,
  };

  it('finds nothing when the form is unchanged', () => {
    expect(detectChanges(formValues(), formValues())).toEqual(noChange);
  });

  it('reads a flag turned on and off again as no change', () => {
    const after = formValues({ protection: { lockName: false } });

    expect(detectChanges(formValues({ protection: undefined }), after).hasChanges).toBe(false);
  });

  it('ignores rule order in the scopes', () => {
    const after = formValues({
      scopes: { applications: { level: 'ReadOnly', rules: ['a', 'b'] } },
    });

    expect(detectChanges(formValues(), after).scopesHaveChanged).toBe(false);
  });

  it.each<[string, Partial<RoleFormValues>, keyof ChangeDetectionResult]>([
    ['the name', { name: 'renamed' }, 'nameHasChanged'],
    ['the description', { description: 'other' }, 'descriptionHasChanged'],
    ['the category', { categoryRef: 'cat-2' }, 'categoryHasChanged'],
    ['the scopes', { scopes: {} }, 'scopesHaveChanged'],
    ['the validity', { validity: { type: 'sessionBased' } }, 'validityHasChanged'],
    ['the protection', { protection: { softDelete: true } }, 'protectionHasChanged'],
  ])('reports a change to %s', (_, change, flag) => {
    const result = detectChanges(formValues(), formValues(change));

    expect(result).toMatchObject({ [flag]: true, hasChanges: true });
  });

  it.each<[string, keyof NonNullable<RoleFormValues['protection']>, Partial<RoleFormValues>]>([
    ['scopes', 'preventScopeChanges', { scopes: {} }],
    ['name', 'lockName', { name: 'renamed' }],
    ['category', 'lockCategory', { categoryRef: 'cat-2' }],
  ])('needs two steps to lift the %s lock and change what it guarded', (_, flag, change) => {
    const before = formValues({ protection: { [flag]: true } });

    expect(detectChanges(before, formValues(change)).needsTwoStepUpdate).toBe(true);
    expect(detectChanges(before, formValues()).needsTwoStepUpdate).toBe(false);
  });

  it('marks a role locked when preventModification stays on', () => {
    const locked = formValues({ protection: { preventModification: true } });

    expect(detectChanges(locked, locked).modificationLocked).toBe(true);
    expect(detectChanges(locked, formValues()).modificationLocked).toBe(false);
  });
});

describe('role update payloads', () => {
  const full: RoleFormData = {
    name: 'release_lead',
    description: 'Leads releases',
    type: 'custom',
    categoryRef: 'cat-1',
    status: 'Active',
    scopesAndPermissions: [],
    validity: { type: 'permanent' },
    protection: { softDelete: true },
  };
  const everything = {
    nameHasChanged: true,
    descriptionHasChanged: true,
    categoryHasChanged: true,
    scopesHaveChanged: true,
    validityHasChanged: true,
    protectionHasChanged: true,
  } as ChangeDetectionResult;
  const allFields = {
    name: full.name,
    description: full.description,
    categoryRef: full.categoryRef,
    scopesAndPermissions: full.scopesAndPermissions,
    validity: full.validity,
    protection: full.protection,
  };
  const fieldsOnly = { ...allFields, protection: undefined };

  it('sends every changed field, never the status', () => {
    expect(buildUpdatePayload(full, {}, everything)).toEqual(allFields);
  });

  it('sends nothing when nothing changed', () => {
    expect(buildUpdatePayload(full, {}, {} as ChangeDetectionResult)).toEqual({});
  });

  it('skips the fields a lock guards', () => {
    const locks = { lockName: true, lockCategory: true, preventScopeChanges: true };

    expect(Object.keys(buildUpdatePayload(full, locks, everything)).sort()).toEqual([
      'description',
      'protection',
      'validity',
    ]);
  });

  it.each([
    [true, { protection: full.protection }],
    [false, {}],
  ])('sends only the protection while locked (changed: %j)', (protectionHasChanged, expected) => {
    const changes = { ...everything, modificationLocked: true, protectionHasChanged };

    expect(buildUpdatePayload(full, {}, changes)).toEqual(expected);
  });

  it('builds the second step of a two-step update without the protection', () => {
    expect(buildFieldsUpdatePayload(full, everything)).toEqual(fieldsOnly);
    expect(buildFieldsUpdatePayload(full, {} as ChangeDetectionResult)).toEqual({});
  });
});

describe('validity builders', () => {
  const expiresAt = '2026-07-01T00:00:00.000Z';

  it.each<[string, RoleFormValues['validity'], RoleFormData['validity']]>([
    ['no validity', undefined, { type: 'permanent' }],
    ['a permanent one', { type: 'permanent', autoRevoke: true }, { type: 'permanent' }],
    [
      'a dated one',
      { type: 'temporary', expiresAt },
      { type: 'temporary', expiresAt, autoRevoke: false },
    ],
    [
      'a picked date',
      { type: 'temporary', expiresAt: dayjs(expiresAt), autoRevoke: true },
      { type: 'temporary', expiresAt, autoRevoke: true },
    ],
    [
      'a duration',
      { type: 'temporary', durationHours: 4 },
      { type: 'temporary', durationHours: 4, autoRevoke: false },
    ],
  ])('converts %s for the API', (_, validity, expected) => {
    expect(buildValidityForAPI(validity)).toEqual(expected);
  });

  it.each<[string, Parameters<typeof buildValidityForForm>[0], RoleFormValues['validity']]>([
    ['no validity', undefined, { type: 'permanent' }],
    ['a session one', { type: 'sessionBased' }, { type: 'sessionBased' }],
    [
      'a duration',
      { type: 'temporary', durationHours: 4, autoRevoke: false },
      { type: 'temporary', durationHours: 4, autoRevoke: false, expirationModel: 'durationHours' },
    ],
    [
      'a bare temporary one',
      { type: 'temporary' },
      { type: 'temporary', expirationModel: undefined },
    ],
  ])('converts %s for the form', (_, validity, expected) => {
    expect(buildValidityForForm(validity)).toEqual(expected);
  });

  it('turns a stored expiry into a picker value', () => {
    const result = buildValidityForForm({ type: 'temporary', expiresAt });

    expect(dayjs.isDayjs(result?.expiresAt)).toBe(true);
    expect(result?.expirationModel).toBe('expiresAt');
  });
});

describe('formatValidity', () => {
  const record = buildRole({ creationDate: NOW.toISOString(), lastUpdateDate: undefined });

  beforeEach(() => {
    vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each<[string, Parameters<typeof formatValidity>[0], string]>([
    ['nothing', undefined, 'Permanent'],
    ['permanent', { type: 'permanent' }, 'Permanent'],
    ['session based', { type: 'sessionBased' }, 'Session Based'],
    ['temporary without a limit', { type: 'temporary' }, 'Temporary'],
  ])('labels %s', (_, validity, label) => {
    expect(formatValidity(validity, record)).toEqual({ label });
  });

  it.each([
    [2 * DAY_MS + 3 * HOUR_MS, '2d 3h'],
    [2 * DAY_MS, '2d'],
    [3 * HOUR_MS + 5 * MINUTE_MS, '3h 5m'],
    [3 * HOUR_MS, '3h'],
    [5 * MINUTE_MS, '5m'],
  ])('shows the time left of an expiry %i ms away', (ms, left) => {
    const validity = { type: 'temporary' as const, expiresAt: fromNow(ms) };

    expect(formatValidity(validity, record).expiresIn).toContain(left);
  });

  it.each<[string, Parameters<typeof formatValidity>[0], string]>([
    ['date', { type: 'temporary', expiresAt: fromNow(-HOUR_MS) }, NOW.toISOString()],
    ['duration', { type: 'temporary', durationHours: 1 }, fromNow(-2 * HOUR_MS)],
  ])('says an expiry %s that has passed is expired', (_, validity, lastUpdateDate) => {
    expect(formatValidity(validity, { ...record, lastUpdateDate })).toEqual({
      label: 'Temporary',
      expiresIn: RC.VALIDITY.EXPIRED,
    });
  });

  it('counts a duration from the last update', () => {
    const updated = { ...record, lastUpdateDate: fromNow(-HOUR_MS) };
    const validity = { type: 'temporary' as const, durationHours: 4 };

    expect(formatValidity(validity, updated).expiresIn).toContain('3h');
    expect(formatValidity(validity, record).expiresIn).toContain('4h');
  });
});

describe('form data converters', () => {
  it('keeps the set scopes and deduplicates their rules', () => {
    const scopes = {
      applications: { level: 'Owner' as const, rules: ['x', 'x', ''] },
      plans: { level: '' as 'Owner' },
      groups: { level: 'ReadOnly' as const },
    };

    expect(convertScopesToAPI(scopes)).toEqual([
      { scope: 'applications', level: 'Owner', rules: ['x'] },
      { scope: 'groups', level: 'ReadOnly', rules: [] },
    ]);
  });

  it('reads scopes back with empty rules by default', () => {
    expect(convertScopesFromAPI([{ scope: 'plans', level: 'Admin' }])).toEqual({
      plans: { level: 'Admin', rules: [] },
    });
  });

  it('builds a full payload from sparse form values', () => {
    const data = convertFormValuesToRoleFormData(
      { name: 'r', description: '  ', categoryRef: '', scopes: {} },
      'custom',
      'Inactive',
    );

    expect(data).toMatchObject({
      name: 'r',
      description: '',
      type: 'custom',
      status: 'Inactive',
      categoryRef: '',
      validity: { type: 'permanent' },
      protection: { preventDeletion: false, softDelete: false },
    });
  });

  it('keeps the values the form set', () => {
    const data = convertFormValuesToRoleFormData(
      formValues({
        description: ' kept ',
        type: 'built-in',
        status: 'Active',
        protection: { lockName: true },
      }),
    );

    expect(data).toMatchObject({ description: 'kept', type: 'built-in', status: 'Active' });
    expect(data.protection?.lockName).toBe(true);
  });

  it('gives empty form values for no role', () => {
    expect(convertRoleToFormValues(null)).toMatchObject({ name: '', scopes: {}, categoryRef: '' });
  });

  it('fills the form from a role, with defaults for what the API omitted', () => {
    const role = buildRole({ description: '', categoryRef: '', protection: undefined });

    expect(convertRoleToFormValues(role)).toMatchObject({
      name: role.name,
      description: '',
      categoryRef: '',
      scopes: { applications: { level: 'ReadOnly', rules: [] } },
      protection: { preventDeletion: false },
    });
  });

  it('keeps a stored protection', () => {
    const protection = { lockName: true };

    expect(convertRoleToFormValues(buildRole({ protection })).protection).toEqual(protection);
  });
});

describe('role mappers', () => {
  it('hides soft-deleted roles and fills in what the API omitted', () => {
    const kept = buildRole({ description: '', version: '', priority: 0, categoryRef: '' });
    const deleted = buildRole({ status: 'Deleted' });

    expect(mapRolesData([kept, deleted])).toEqual([
      expect.objectContaining({ id: kept.id, version: 'v1.0.0', priority: 0 }),
    ]);
  });

  it('maps a details response', () => {
    const role = buildRole();

    expect(
      mapRoleDetailsData({ data: role } as Parameters<typeof mapRoleDetailsData>[0]),
    ).toMatchObject({
      id: role.id,
      name: role.name,
    });
  });
});

describe('role protection flags', () => {
  it.each([
    [undefined, true, true, false],
    [{}, true, true, false],
    [{ preventDeletion: true }, true, false, false],
    [{ preventModification: true }, false, true, false],
    [{ preventDeletion: true, preventModification: true }, false, false, true],
  ])('reads %j', (protection, modifiable, deletable, protectedRole) => {
    const role = buildRole({ protection });

    expect(canModifyRole(role)).toBe(modifiable);
    expect(canDeleteRole(role)).toBe(deletable);
    expect(isRoleProtected(role)).toBe(protectedRole);
  });

  it.each([
    ['built-in', true],
    ['custom', false],
  ] as const)('reads type %s as built-in: %j', (type, expected) => {
    expect(isBuiltInRole(buildRole({ type }))).toBe(expected);
  });
});
