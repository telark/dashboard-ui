import { describe, expect, it } from 'vitest';
import { buildPlan, buildPlanReport } from '../../../../test/factories/plans';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../constants/protectionPlans';
import type { ProtectionPlan } from '../models';
import { applyPlanFilters } from './applyPlanFilters';
import { applyReportFilters } from './applyReportFilters';

const K = PPC.FILTER_KEYS;

describe('applyPlanFilters', () => {
  const plan = buildPlan({
    createdAt: '2026-03-10T12:00:00Z',
    createdBy: 'release_lead',
    policies: [{ templateID: 'block-delete', params: {} }],
    scope: { type: 'namespaces', applicationRefs: [], namespaces: ['payments'] },
    kindRef: 'kind-1',
    environmentRef: 'env-1',
    tagRefs: ['tag-1'],
  });

  it.each<[string, Record<string, unknown>, boolean]>([
    ['no filters', {}, true],
    ['matching scope type', { [K.SCOPE_TYPE]: ['namespaces'] }, true],
    ['other scope type', { [K.SCOPE_TYPE]: ['applications'] }, false],
    ['matching creator', { [K.CREATED_BY]: ['release_lead'] }, true],
    ['other creator', { [K.CREATED_BY]: ['sre_oncall'] }, false],
    ['matching template', { [K.TEMPLATES]: ['block-delete'] }, true],
    ['other template', { [K.TEMPLATES]: ['block-create'] }, false],
    ['matching target', { [K.TARGETS]: ['payments'] }, true],
    ['other target', { [K.TARGETS]: ['orders'] }, false],
    ['matching kind', { [K.KIND]: ['kind-1'] }, true],
    ['other kind', { [K.KIND]: ['kind-2'] }, false],
    ['matching environment', { [K.ENVIRONMENT]: ['env-1'] }, true],
    ['other environment', { [K.ENVIRONMENT]: ['env-2'] }, false],
    ['matching tag', { [K.TAGS]: ['tag-1'] }, true],
    ['other tag', { [K.TAGS]: ['tag-2'] }, false],
  ])('%s', (_label, filters, keeps) => {
    expect(applyPlanFilters([plan], filters)).toEqual(keeps ? [plan] : []);
  });

  it('reads application targets on an application scope', () => {
    const scoped = buildPlan({
      scope: { type: 'applications', applicationRefs: ['orders'], namespaces: [] },
    });

    expect(applyPlanFilters([scoped], { [K.TARGETS]: ['orders'] })).toEqual([scoped]);
  });
});

describe('applyReportFilters', () => {
  const plan: ProtectionPlan = buildPlan({
    id: 'plan-1',
    name: 'freeze-orders',
    environmentRef: 'env-1',
  });
  const report = buildPlanReport({ planId: plan.id, trigger: 'manual' });
  const planById = new Map([[plan.id, plan]]);
  const keptNames = new Map<string, string>();
  const run = (filters: Record<string, unknown>, search = '', reports = [report]) =>
    applyReportFilters(reports, filters, search, planById, keptNames);

  it.each<[string, Record<string, unknown>, string, boolean]>([
    ['no filter', {}, '', true],
    ['matching plan', { [K.PLAN]: ['plan-1'] }, '', true],
    ['other plan', { [K.PLAN]: ['plan-2'] }, '', false],
    ['matching environment', { [K.ENVIRONMENT]: ['env-1'] }, '', true],
    ['other environment', { [K.ENVIRONMENT]: ['env-2'] }, '', false],
    ['matching trigger', { [K.TRIGGER]: ['manual'] }, '', true],
    ['other trigger', { [K.TRIGGER]: ['end'] }, '', false],
    ['matching search', {}, ' ORDERS ', true],
    ['other search', {}, 'billing', false],
  ])('%s', (_label, filters, search, keeps) => {
    expect(run(filters, search)).toEqual(keeps ? [report] : []);
  });

  it('searches a deleted plan by its kept name', () => {
    const orphan = buildPlanReport({ planId: 'gone' });
    const kept = new Map([['gone', 'old-freeze']]);

    expect(applyReportFilters([orphan], {}, 'old', planById, kept)).toEqual([orphan]);
  });
});
