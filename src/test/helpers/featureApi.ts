import type { JsonBodyType } from 'msw';
import { Endpoints, HTTP_STATUS } from '../../constants';
import { CATEGORIES_CONSTANTS } from '../../features/access-and-permissions/categories/constants';
import type {
  Application,
  DiscoveryCycleStatus,
  SnapshotStorageInfos,
} from '../../features/applications/models';
import type { GlobalConfigModel } from '../../features/globalconfig/store/globalConfigSlice';
import type { ProtectionPlan, ReportStorageInfos } from '../../features/plans/protection/models';
import { mockEmptyLists, mockEndpoint, mockList } from '../api';
import { permissionsSeed, type StoreSeed } from '../store';
import { buildDiscoveryStatus } from '../factories/applications';
import { buildPlanStatus, buildPlanTemplate } from '../factories/plans';
import './panel';

/** The plans list, as the plans pages and the applications' coverage read it. */
const mockPlansList = (plans: ProtectionPlan[] = []) =>
  mockList('exporter', Endpoints.PROTECTION_PLANS.LIST, plans);

const mockDiscoveryStatus = (status: DiscoveryCycleStatus = buildDiscoveryStatus()) =>
  mockEndpoint('discovery', Endpoints.APPLICATIONS.DISCOVERY_STATUS, { data: status });

/** The applications list page's list and its side requests. */
export const mockApplicationsPage = (applications: Application[], plans: ProtectionPlan[] = []) => {
  mockPlansList(plans);
  mockDiscoveryStatus();
  mockEmptyLists('exporter', [Endpoints.USERS.GET_ALL]);
  return mockEndpoint('exporter', Endpoints.APPLICATIONS.GET_ALL, {
    status: HTTP_STATUS.SUCCESS,
    data: { items: applications },
  });
};

/** The application details page's record and its side requests. */
export const mockApplicationDetails = (application: Application) => {
  mockPlansList();
  mockEmptyLists('exporter', [Endpoints.USERS.GET_ALL]);
  mockEmptyLists('discovery', [Endpoints.PROTECTION_PLANS.TEMPLATES]);
  mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_INFOS, { data: {} });
  return mockEndpoint('exporter', Endpoints.APPLICATIONS.GET_DETAILS(application.name), {
    data: application,
  });
};

const PLAN_TAXONOMY_SCOPES = [
  CATEGORIES_CONSTANTS.SCOPES.PLAN_KINDS,
  CATEGORIES_CONSTANTS.SCOPES.PLAN_ENVIRONMENTS,
  CATEGORIES_CONSTANTS.SCOPES.PLAN_TAGS,
];

/** The three classification lists the plans pages read. */
export const mockPlanTaxonomies = () =>
  mockEmptyLists(
    'exporter',
    PLAN_TAXONOMY_SCOPES.map((scope) => Endpoints.CATEGORIES.GET_BY_SCOPE(scope)),
  );

/** The plans main page's list and its side requests. */
export const mockPlansPage = (plans: ProtectionPlan[]) => {
  mockPlanTaxonomies();
  mockEmptyLists('exporter', [Endpoints.USERS.GET_ALL]);
  return mockPlansList(plans);
};

/** The plan details page's record and the sections it loads. */
export const mockPlanDetails = (plan: ProtectionPlan) => {
  mockPlansPage([plan]);
  mockEndpoint('exporter', Endpoints.PROTECTION_PLANS.GET_BY_ID(plan.id), { data: plan });
  mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.STATUS(plan.id), {
    data: buildPlanStatus({ planId: plan.id, phase: plan.phase }),
  });
  mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.VIOLATIONS(plan.id), {
    data: { planId: plan.id, total: 0, retentionWindow: '30d', violations: [] },
  });
  mockEndpoint('exporter', Endpoints.REPORTS.PLANS.LIST(plan.id), { data: [] });
  mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.TEMPLATES, { data: [] });
};

/** The lists the create and edit plan forms load. */
export const mockPlanForm = ({
  plans = [],
  applications = [],
  namespaces = ['payments', 'ops'],
}: {
  plans?: ProtectionPlan[];
  applications?: Application[];
  namespaces?: string[];
} = {}) => {
  mockPlanTaxonomies();
  mockPlansList(plans);
  mockEmptyLists('exporter', [Endpoints.USERS.GET_ALL]);
  mockEndpoint('exporter', Endpoints.APPLICATIONS.GET_ALL, {
    status: HTTP_STATUS.SUCCESS,
    data: { items: applications },
  });
  mockEndpoint('discovery', Endpoints.NAMESPACES.GET, { data: namespaces });
  mockEndpoint('discovery', Endpoints.PROTECTION_PLANS.TEMPLATES, {
    data: [
      buildPlanTemplate({ id: 'block-delete', name: 'Block deletes' }),
      buildPlanTemplate({
        id: 'block-tags',
        name: 'Block tags',
        params: [{ key: 'tags', label: 'Tags', type: 'string-array', required: true }],
      }),
    ],
  });
};

/** Everything Home loads besides the Insights API: the two lists and both storage summaries. */
export const mockHomeLists = (
  applications: Application[] = [],
  plans: ProtectionPlan[] = [],
  storage: { snapshots?: SnapshotStorageInfos; reports?: ReportStorageInfos } = {},
) => {
  mockApplicationsPage(applications, plans);
  const answer = (data: object | undefined) => ({ data: data ?? null }) as JsonBodyType;
  mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_INFOS, answer(storage.snapshots));
  mockEndpoint('exporter', Endpoints.REPORTS.STORAGE, answer(storage.reports));
};

/** A store seed for the parts of the GlobalConfig a test cares about. */
export const seedGlobalConfig = (data: Partial<GlobalConfigModel>): StoreSeed => ({
  ...permissionsSeed(),
  globalconfig: { data },
});
