import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import { describeClients, mockEndpoint } from '../../../../test';
import { buildPlanReport } from '../../../../test/factories/plans';
import { REPORT_BUSY_STATUS, REPORTS_LIST } from '../constants/protectionPlans';
import {
  cancelPlan,
  decidePlan,
  deletePlan,
  deletePlanReport,
  duplicatePlan,
  fetchAllPlanReports,
  fetchKeptPlanReports,
  fetchPlanReports,
  fetchPlanStatus,
  fetchPlanViolations,
  fetchProtectionPlanById,
  fetchProtectionPlans,
  fetchProtectionPlanTemplates,
  fetchReportStorage,
  generatePlanReport,
  isReportBusy,
  isReportFileMissing,
  preparePlan,
  reactivatePlan,
  updatePlan,
  type DecidePlanPayload,
  type DuplicatePlanPayload,
  type PlanPayload,
} from '.';

const ID = 'plan-1';
const PAYLOAD = { name: 'freeze' } as PlanPayload;
const DECISION: DecidePlanPayload = { decision: 'approved', requestedAt: '2026-02-01T10:00:00Z' };
const DUPLICATE: DuplicatePlanPayload = { name: 'freeze-copy' };

describeClients('protection plans', [
  {
    name: 'fetchProtectionPlans',
    service: 'exporter',
    endpoint: Endpoints.PROTECTION_PLANS.LIST,
    call: () => fetchProtectionPlans(),
    response: { data: { items: [{ id: ID }] } },
    expected: [{ id: ID }],
  },
  {
    name: 'fetchProtectionPlanById',
    service: 'exporter',
    endpoint: Endpoints.PROTECTION_PLANS.GET_BY_ID(ID),
    call: () => fetchProtectionPlanById(ID),
    response: { data: { id: ID } },
    expected: { id: ID },
  },
  {
    name: 'fetchProtectionPlanTemplates',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.TEMPLATES,
    call: () => fetchProtectionPlanTemplates(),
    response: { data: [{ id: 'template-1' }] },
    expected: [{ id: 'template-1' }],
  },
  {
    name: 'fetchPlanStatus',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.STATUS(ID),
    call: () => fetchPlanStatus(ID),
    response: { data: { planId: ID } },
    expected: { planId: ID },
  },
  {
    name: 'preparePlan',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.PREPARE,
    call: () => preparePlan(PAYLOAD),
    body: PAYLOAD,
    response: { data: { id: ID } },
    expected: { id: ID },
  },
  {
    name: 'updatePlan',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.UPDATE(ID),
    call: () => updatePlan(ID, PAYLOAD),
    body: PAYLOAD,
    response: { data: { id: ID } },
    expected: { id: ID },
  },
  {
    name: 'cancelPlan',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.CANCEL(ID),
    call: () => cancelPlan(ID, 'obsolete'),
    body: { reason: 'obsolete' },
    response: { data: { id: ID } },
    expected: { id: ID },
  },
  {
    name: 'reactivatePlan',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.REACTIVATE(ID),
    call: () => reactivatePlan(ID),
    response: { data: { id: ID } },
    expected: { id: ID },
  },
  {
    name: 'decidePlan',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.DECIDE(ID),
    call: () => decidePlan(ID, DECISION),
    body: DECISION,
    response: { data: { id: ID } },
    expected: { id: ID },
  },
  {
    name: 'duplicatePlan',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.DUPLICATE(ID),
    call: () => duplicatePlan(ID, DUPLICATE),
    body: DUPLICATE,
    response: { data: { id: 'plan-2' } },
    expected: { id: 'plan-2' },
  },
  {
    name: 'duplicatePlan (no overrides)',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.DUPLICATE(ID),
    call: () => duplicatePlan(ID),
    body: {},
    response: { data: { id: 'plan-2' } },
    expected: { id: 'plan-2' },
  },
  {
    name: 'fetchPlanReports',
    service: 'exporter',
    endpoint: Endpoints.REPORTS.PLANS.LIST(ID),
    call: () => fetchPlanReports(ID),
    response: { data: [] },
    expected: [],
  },
  {
    name: 'fetchAllPlanReports',
    service: 'exporter',
    endpoint: Endpoints.REPORTS.LIST_ALL,
    call: () => fetchAllPlanReports(),
    response: { data: [] },
    expected: [],
  },
  {
    name: 'fetchKeptPlanReports',
    service: 'exporter',
    endpoint: Endpoints.REPORTS.LIST_KEPT,
    call: () => fetchKeptPlanReports(),
    response: { data: [] },
    expected: [],
  },
  {
    name: 'fetchReportStorage',
    service: 'exporter',
    endpoint: Endpoints.REPORTS.STORAGE,
    call: () => fetchReportStorage(),
    response: { data: { totalReports: 2 } },
    expected: { totalReports: 2 },
  },
  {
    name: 'generatePlanReport',
    service: 'discovery',
    endpoint: Endpoints.PROTECTION_PLANS.REPORTS_GENERATE(ID),
    call: () => generatePlanReport(ID),
    response: { data: { id: 'report-1' } },
    expected: { id: 'report-1' },
  },
]);

describe('deletePlan', () => {
  it.each([
    [false, null],
    [true, 'true'],
  ])('with keepReports=%s sends %s', async (keepReports, sent) => {
    const remove = mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.CLEAR(ID), { data: null });

    await deletePlan(ID, keepReports);

    expect(remove.calls[0].url.searchParams.get('keepReports')).toBe(sent);
  });
});

describe('deletePlanReport', () => {
  it('names the report in the query', async () => {
    const report = buildPlanReport({ id: 'report-9', planId: ID });
    const remove = mockEndpoint('exporter', Endpoints.REPORTS.PLANS.DELETE(ID), { data: null });

    await deletePlanReport(report);

    expect(remove.calls[0].url.searchParams.get('report')).toBe('report-9');
  });
});

describe('fetchAllPlanReports', () => {
  it('caps the list at the page limit', async () => {
    const list = mockEndpoint('exporter', Endpoints.REPORTS.LIST_ALL, { data: [] });

    await fetchAllPlanReports();

    expect(list.calls[0].url.searchParams.get('limit')).toBe(String(REPORTS_LIST.LIMIT));
  });
});

describe('fetchPlanViolations', () => {
  it.each([
    [{ limit: 5, result: 'fail' as const }, '?limit=5&result=fail'],
    [undefined, ''],
  ])('with filters %j sends the query "%s"', async (filters, query) => {
    const list = mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.VIOLATIONS(ID), {
      data: { planId: ID, violations: [] },
    });

    await fetchPlanViolations(ID, filters);

    expect(list.calls[0].url.search).toBe(query);
  });
});

describe('report error helpers', () => {
  it.each([
    [{ response: { status: REPORT_BUSY_STATUS } }, true],
    [{ response: { status: 500 } }, false],
    [undefined, false],
  ])('isReportBusy(%j) is %s', (error, expected) => {
    expect(isReportBusy(error)).toBe(expected);
  });

  it.each([
    [{ normalized: { isNotFound: true } }, true],
    [{ normalized: { isNotFound: false } }, false],
    [undefined, false],
  ])('isReportFileMissing(%j) is %s', (error, expected) => {
    expect(isReportFileMissing(error)).toBe(expected);
  });
});
