import { describe, expect, it } from 'vitest';
import { buildGroup } from '../../../../test/factories/groups';
import { buildUser } from '../../../../test/factories/users';
import { ROLES_CONSTANTS as RC } from '../../roles/constants';
import { USERS_CONSTANTS as UC } from '../constants';
import type { User } from '../models';
import { applyUserFilters } from './filter/applyUserFilters';
import { userLockReason } from './user/protection';
import {
  arraysEqual,
  filterBySearchTerm,
  fullnameFromUsername,
  getEffectiveRoleRefs,
  getScopeLabel,
  getTotalRoleCount,
  makeEmailFormatRule,
  makeEmailUniqueRule,
  makeFullnameCharsRule,
  makeUsernameFormatRule,
  makeUsernameUniqueRule,
  sanitizeUsername,
} from '.';

describe('user helpers', () => {
  it.each([
    [['a', 'b'], ['b', 'a'], true],
    [['a'], ['a', 'b'], false],
    [['a', 'c'], ['a', 'b'], false],
  ])('arraysEqual(%j, %j) is %j', (left, right, expected) => {
    expect(arraysEqual(left, right)).toBe(expected);
  });

  it('filters by any searchable field, and keeps everything for an empty term', () => {
    const items = [
      { a: 'Alpha', b: null },
      { a: 'x', b: 'beta' },
    ];
    const fields = (item: (typeof items)[number]) => [item.a, item.b];

    expect(filterBySearchTerm(items, '', fields)).toBe(items);
    expect(filterBySearchTerm(items, 'BET', fields)).toEqual([items[1]]);
  });

  it('labels a known scope and passes an unknown one through', () => {
    expect(getScopeLabel('unknown-scope')).toBe('unknown-scope');
    expect(getScopeLabel(RC.SCOPE.DEFAULT_AREAS[0].key)).toBe(RC.SCOPE.DEFAULT_AREAS[0].label);
  });

  it('merges direct and group roles without repeats', () => {
    const group = buildGroup({ roleRefs: ['b', 'c'] });
    const user = buildUser({ roleRefs: ['a', 'b'], groupRefs: [group.id, 'gone'] });

    expect(getEffectiveRoleRefs(user, [group, buildGroup({ roleRefs: ['z'] })])).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(getTotalRoleCount(user, [group])).toBe(3);
  });

  it('counts no roles when the record has no lists', () => {
    const user = { ...buildUser(), roleRefs: undefined, groupRefs: undefined } as unknown as User;

    expect(getTotalRoleCount(user, [buildGroup({ roleRefs: undefined })])).toBe(0);
  });

  it.each([
    ['sre.oncall!', 'sreoncall'],
    ['', ''],
  ])('sanitizeUsername(%j) is %j', (input, expected) => {
    expect(sanitizeUsername(input)).toBe(expected);
  });

  it.each([
    ['sre_oncall2', 'sre oncall'],
    ['1234', UC.DEFAULTS.FULLNAME],
  ])('fullnameFromUsername(%j) is %j', (input, expected) => {
    expect(fullnameFromUsername(input)).toBe(expected);
  });
});

describe('user form rules', () => {
  const taken = buildUser({ username: 'Sre_Oncall', email: 'taken@example.com' });
  const { VALIDATION } = UC.LABELS;

  it.each<
    [string, { validator: (_: unknown, value: string) => Promise<unknown> }, string, string?]
  >([
    ['format accepts a good username', makeUsernameFormatRule(), 'sre_oncall'],
    ['format accepts nothing yet', makeUsernameFormatRule(), ''],
    [
      'format refuses bad characters',
      makeUsernameFormatRule(),
      'sre oncall!',
      VALIDATION.USERNAME_INVALID_CHARS,
    ],
    ['unique accepts a free username', makeUsernameUniqueRule([taken]), 'free'],
    ['unique accepts nothing yet', makeUsernameUniqueRule([taken]), ' '],
    [
      'unique refuses a taken username in any case',
      makeUsernameUniqueRule([taken]),
      'SRE_ONCALL',
      VALIDATION.USERNAME_TAKEN,
    ],
    [
      'unique lets a user keep its own username',
      makeUsernameUniqueRule([taken], taken.id),
      'sre_oncall',
    ],
    ['email format accepts an address', makeEmailFormatRule(), 'test@example.com'],
    ['email format accepts nothing yet', makeEmailFormatRule(), ''],
    [
      'email format refuses a bad address',
      makeEmailFormatRule(),
      'not-an-email',
      VALIDATION.INVALID_EMAIL,
    ],
    ['email unique accepts a free address', makeEmailUniqueRule([taken]), 'free@example.com'],
    ['email unique accepts nothing yet', makeEmailUniqueRule([taken]), ''],
    [
      'email unique refuses a taken address',
      makeEmailUniqueRule([taken]),
      'TAKEN@example.com',
      VALIDATION.EMAIL_TAKEN,
    ],
    [
      'email unique lets a user keep its own address',
      makeEmailUniqueRule([taken], taken.id),
      'taken@example.com',
    ],
    ['full name accepts letters in any script', makeFullnameCharsRule(), "José O'Neil"],
    ['full name accepts nothing yet', makeFullnameCharsRule(), ''],
    [
      'full name refuses symbols',
      makeFullnameCharsRule(),
      'sre#1',
      VALIDATION.FULLNAME_SPECIAL_CHARS,
    ],
  ])('%s', async (_, rule, value, message) => {
    const outcome = await rule.validator(null, value).then(
      () => undefined,
      (error: Error) => error.message,
    );

    expect(outcome).toBe(message);
  });
});

describe('applyUserFilters', () => {
  const active = buildUser({
    username: 'alpha',
    fullname: 'First',
    creationDate: '2026-01-10T12:00:00Z',
  });
  const suspended = buildUser({
    username: 'beta',
    fullname: 'Second',
    status: { phase: 'suspended' },
    creationDate: '2026-03-10T12:00:00Z',
  });
  const users = [active, suspended];

  it.each<[string, Record<string, unknown>, string | undefined, User[]]>([
    ['no filters', {}, undefined, users],
    ['a search on the username', {}, 'alpha', [active]],
    ['a search on the full name', {}, 'second', [suspended]],
    ['status all', { status: 'all' }, undefined, users],
    ['active', { status: 'active' }, undefined, [active]],
    ['inactive', { status: 'inactive' }, undefined, [suspended]],
    ['an unknown status', { status: 'other' }, undefined, users],
    [
      'a date range',
      { dateRange: { from: '2026-02-01', to: '2026-04-01' } },
      undefined,
      [suspended],
    ],
    ['a start only', { dateRange: { from: '2026-02-01' } }, undefined, [suspended]],
    ['an end only', { dateRange: { to: '2026-02-01' } }, undefined, [active]],
  ])('applies %s', (_, filters, term, expected) => {
    expect(applyUserFilters(users, filters, term)).toEqual(expected);
  });
});

describe('userLockReason', () => {
  const viewer = buildUser();

  it.each<[string, User, User | null, string | undefined]>([
    ['the viewer', viewer, viewer, UC.LABELS.ACTIONS.SELF_LOCKED_TOOLTIP],
    [
      'the bootstrap admin',
      buildUser({ bootstrap: true }),
      viewer,
      UC.LABELS.ACTIONS.BOOTSTRAP_LOCKED_TOOLTIP,
    ],
    ['anyone else', buildUser(), null, undefined],
  ])('reads %s', (_, target, who, expected) => {
    expect(userLockReason(target, who)).toBe(expected);
  });
});
