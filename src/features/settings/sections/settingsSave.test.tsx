import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../constants';
import type { StoreSeed } from '../../../test';
import {
  clickButton,
  mockEndpoint,
  permissionsSeed,
  renderApp,
  mockServerError,
} from '../../../test';
import { describeSettingsSave } from '../../../test/contracts/settingsSection';
import {
  buildBootstrapStatus,
  buildReportStorage,
  buildSnapshotStorage,
} from '../../../test/factories/settings';
import { buildUser } from '../../../test/factories/users';
import { seedGlobalConfig } from '../../../test/helpers/featureApi';
import { mockInsightsApi } from '../../../test/helpers/insightsApi';
import { signIn } from '../../../test/helpers/session';
import { pickSelectOption } from '../../../test/antd';
import { BOOTSTRAP_TEXTS } from '../../bootstrap';
import type { GlobalConfigModel } from '../../globalconfig/store/globalConfigSlice';
import AIInsightsSectionContent from './aiInsights/AIInsightsSectionContent';
import { DiscoveryBehaviorSection, StorageSectionContent } from './insightsGovernance';
import { INSIGHTS_GOVERNANCE_CONSTANTS as GOV } from './insightsGovernance/constants';
import IdentityProviderSectionContent from './identityProvider/IdentityProviderSectionContent';
import OIDCSection from './identityProvider/OIDCSection';
import SelfRegistrationSection from './identityProvider/SelfRegistrationSection';
import { IDENTITY_PROVIDER_CONSTANTS as IDP } from './identityProvider/constants';
import { TimezoneSectionContent } from './timezone';
import { TIMEZONE_SECTION_CONSTANTS as TZ } from './timezone/constants';

const CONFIG_GET = () => mockEndpoint('exporter', Endpoints.GLOBALCONFIG.GET, { data: {} });
const READ_ONLY = permissionsSeed('ReadOnly');

const SIGN_IN_ADMIN: StoreSeed = permissionsSeed('Admin');

const toggleSwitch = (position: number) => () =>
  screen.findAllByRole('switch').then((switches) => switches[position]);

const pickInSoleSelect = async (user: UserEvent, option: string) =>
  pickSelectOption(user, await screen.findByRole('combobox'), option);

describeSettingsSave({
  name: 'Insights',
  element: <AIInsightsSectionContent />,
  seed: seedGlobalConfig({ ai: { enabled: true, model: 'granite4:350m', autoAnalyze: false } }),
  mockReads: () => {
    mockInsightsApi();
    CONFIG_GET();
  },
  service: 'exporter',
  endpoint: Endpoints.GLOBALCONFIG.PATCH,
  change: async (user) => user.click(await toggleSwitch(1)()),
  expectedBody: { ai: { enabled: true, model: 'granite4:350m', autoAnalyze: true } },
  savedMessage: GOV.MESSAGES.SAVE_SUCCESS,
  failure: { status: 500, message: GOV.MESSAGES.SAVE_FAILED },
  readOnlySeed: READ_ONLY,
});

describeSettingsSave({
  name: 'Discovery',
  element: <DiscoveryBehaviorSection />,
  seed: seedGlobalConfig({ excludedNamespaces: ['kube-system'] }),
  mockReads: () => {
    CONFIG_GET();
    mockEndpoint('discovery', Endpoints.NAMESPACES.GET, { data: ['kube-system', 'payments'] });
  },
  service: 'exporter',
  endpoint: Endpoints.GLOBALCONFIG.PATCH,
  change: (user) => pickInSoleSelect(user, 'payments'),
  expectedBody: { excludedNamespaces: ['kube-system', 'payments'] },
  savedMessage: GOV.MESSAGES.SAVE_SUCCESS,
  failure: { status: 500, message: GOV.MESSAGES.SAVE_FAILED },
  readOnlySeed: READ_ONLY,
});

const mockStorageReads = () => {
  CONFIG_GET();
  mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_INFOS, { data: buildSnapshotStorage() });
  mockEndpoint('exporter', Endpoints.REPORTS.STORAGE, { data: buildReportStorage() });
};

describeSettingsSave({
  name: 'Snapshot storage',
  element: <StorageSectionContent />,
  seed: seedGlobalConfig({ snapshots: { maxPerApp: 5 } }),
  mockReads: mockStorageReads,
  service: 'exporter',
  endpoint: Endpoints.GLOBALCONFIG.PATCH,
  change: (user) => pickInSoleSelect(user, '10'),
  expectedBody: { snapshots: { maxPerApp: 10 } },
  savedMessage: GOV.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_SUCCESS,
  failure: { status: 500, message: GOV.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_FAILED },
  readOnlySeed: READ_ONLY,
});

const CLIENT_ID = 'abc.apps.googleusercontent.com';

describeSettingsSave({
  name: 'Google sign-in',
  element: <OIDCSection />,
  seed: {
    ...seedGlobalConfig({
      oidc: { enabled: true, googleClientID: CLIENT_ID, egressAllowed: true },
    }),
    ...SIGN_IN_ADMIN,
  },
  mockReads: () => {
    signIn({ bootstrap: true });
    mockEndpoint('exporter', Endpoints.GLOBALCONFIG.GET, {
      data: { oidc: { enabled: true, googleClientID: CLIENT_ID, egressAllowed: true } },
    });
  },
  service: 'auth',
  endpoint: Endpoints.AUTH.OIDC.CONFIG,
  change: async (user) => user.click(await toggleSwitch(0)()),
  expectedBody: { enabled: false, googleClientID: CLIENT_ID, egressAllowed: true },
  savedMessage: IDP.MESSAGES.SAVE_SUCCESS,
  failure: { status: 400, body: { message: 'bad client' }, message: 'bad client' },
  readOnlySeed: READ_ONLY,
});

describeSettingsSave({
  name: 'Self-registration',
  element: <SelfRegistrationSection />,
  seed: SIGN_IN_ADMIN,
  mockReads: () => {
    signIn({ bootstrap: true });
    CONFIG_GET();
  },
  service: 'auth',
  endpoint: Endpoints.AUTH.SELF_REGISTRATION,
  change: async (user) => user.click(await toggleSwitch(0)()),
  expectedBody: { enabled: true },
  savedMessage: IDP.MESSAGES.SELF_REGISTRATION_SAVED,
  failure: { status: 400, body: { message: 'refused' }, message: 'refused' },
});

const timezoneUser = buildUser({ settings: { timezone: 'Europe/Paris', region: 'FR' } });

describeSettingsSave({
  name: 'Time zone',
  element: <TimezoneSectionContent />,
  mockReads: () => {
    signIn(timezoneUser);
    mockEndpoint('exporter', Endpoints.USERS.GET_BY_ID(timezoneUser.id), {
      data: timezoneUser as never,
    });
  },
  service: 'exporter',
  endpoint: Endpoints.USERS.PATCH_BY_ID(timezoneUser.id),
  change: async (user) => {
    const [timezone] = await screen.findAllByRole('combobox');
    await pickSelectOption(user, timezone, /^Asia\/Tokyo/, 'Asia/Tokyo');
  },
  expectedBody: { settings: expect.objectContaining({ timezone: 'Asia/Tokyo' }) },
  saveResponse: {
    data: { ...timezoneUser, settings: { timezone: 'Asia/Tokyo' } } as never,
  },
  savedMessage: TZ.LABELS.SAVE_SUCCESS,
  failure: { status: 500, message: TZ.LABELS.SAVE_ERROR },
});

describe('Google sign-in validation', () => {
  const renderForm = async (oidc: NonNullable<GlobalConfigModel['oidc']>) => {
    signIn({ bootstrap: true });
    mockEndpoint('exporter', Endpoints.GLOBALCONFIG.GET, { data: { oidc } });
    const view = renderApp(<OIDCSection />, {
      seed: { ...seedGlobalConfig({ oidc }), ...SIGN_IN_ADMIN },
    });
    await screen.findByText(IDP.LABELS.CARD_TITLE);
    return view;
  };

  it('requires a client ID in Google format once enabled', async () => {
    const { user } = await renderForm({ enabled: false });

    await user.click(await toggleSwitch(0)());
    expect(await screen.findByText(IDP.MESSAGES.CLIENT_ID_REQUIRED)).toBeInTheDocument();
    await user.type(await screen.findByPlaceholderText(IDP.LABELS.CLIENT_ID_PLACEHOLDER), 'nope');

    expect(await screen.findByText(IDP.MESSAGES.CLIENT_ID_FORMAT)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: IDP.LABELS.SAVE_BUTTON })).toBeDisabled();
  });

  it('needs a key set when the cluster may not fetch one, and validates its JSON', async () => {
    const { user } = await renderForm({
      enabled: true,
      googleClientID: CLIENT_ID,
      egressAllowed: false,
    });

    expect(await screen.findByText(IDP.MESSAGES.TRUST_SOURCE_REQUIRED)).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(IDP.LABELS.JWK_PLACEHOLDER), 'not json');

    expect(await screen.findByText(IDP.MESSAGES.JWK_INVALID)).toBeInTheDocument();
  });

  it('keeps a pinned key set when the field stays empty', async () => {
    const { user } = await renderForm({
      enabled: true,
      googleClientID: CLIENT_ID,
      egressAllowed: false,
      googleJwkJson: '{"keys":[]}',
    });

    expect(await screen.findByText(IDP.LABELS.JWK_KEEP_HINT, { exact: false })).toBeInTheDocument();
    expect(screen.queryByText(IDP.MESSAGES.TRUST_SOURCE_REQUIRED)).not.toBeInTheDocument();
    await user.click(screen.getAllByRole('switch')[1]);
    expect(screen.queryByPlaceholderText(IDP.LABELS.JWK_PLACEHOLDER)).not.toBeInTheDocument();
  });

  it('tells other accounts that only the bootstrap account can change this', async () => {
    signIn();
    CONFIG_GET();

    renderApp(<OIDCSection />);

    expect(await screen.findByText(IDP.LABELS.BOOTSTRAP_ONLY_NOTICE)).toBeInTheDocument();
  });
});

describe('storage section', () => {
  const renderStorage = (seed: StoreSeed = {}) => {
    CONFIG_GET();
    return renderApp(<StorageSectionContent />, {
      seed: { ...seedGlobalConfig({ snapshots: { maxPerApp: 5 } }), ...seed },
    });
  };

  const renderStorageSave = () => {
    mockStorageReads();
    const save = mockEndpoint('exporter', Endpoints.GLOBALCONFIG.PATCH, { ok: true });
    return { save, ...renderStorage() };
  };

  it('shows the snapshot and report usage', async () => {
    mockStorageReads();

    renderStorage();

    expect(await screen.findByText('250.00 MB (25.00%)')).toBeInTheDocument();
    expect(await screen.findByText('50.00 MB (10.00%)')).toBeInTheDocument();
  });

  it('confirms before lowering the snapshot limit', async () => {
    const { save, user } = renderStorageSave();

    await pickInSoleSelect(user, '3');
    await clickButton(user, GOV.LABELS.SAVE_BUTTON);
    await clickButton(user, GOV.LABELS.SNAPSHOTS_LOWER_CONFIRM_OK);

    expect(
      await screen.findByText(GOV.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_SUCCESS),
    ).toBeInTheDocument();
    expect(save.calls[0].body).toEqual({ snapshots: { maxPerApp: 3 } });
  });

  it('accepts a custom limit', async () => {
    const { save, user } = renderStorageSave();

    await pickInSoleSelect(user, GOV.LABELS.CUSTOM_OPTION);
    const custom = await screen.findByRole('spinbutton');
    await user.clear(custom);
    await user.type(custom, '42');
    await clickButton(user, GOV.LABELS.SAVE_BUTTON);

    await screen.findByText(GOV.MESSAGES.PLATFORM_SAVE_SNAPSHOTS_SUCCESS);
    expect(save.calls[0].body).toEqual({ snapshots: { maxPerApp: 42 } });
  });

  it('reports storage it could not load', async () => {
    mockServerError('exporter', Endpoints.SNAPSHOTS.GET_INFOS);
    mockServerError('exporter', Endpoints.REPORTS.STORAGE);

    renderStorage();

    expect(await screen.findByText(GOV.MESSAGES.SNAPSHOT_STORAGE_LOAD_FAILED)).toBeInTheDocument();
    expect(await screen.findByText(GOV.MESSAGES.REPORT_STORAGE_LOAD_FAILED)).toBeInTheDocument();
  });

  it('explains missing access to the storage figures', async () => {
    renderStorage(
      permissionsSeed('ReadOnly', [
        'applications.viewapplicationssnapshots.deny',
        'protection-plans.viewprotectionplansreports.deny',
      ]),
    );

    expect(await screen.findByText(GOV.LABELS.SNAPSHOT_STORAGE_NO_ACCESS)).toBeInTheDocument();
  });
});

describe('discovery scope', () => {
  it('previews how many applications a namespace change hides', async () => {
    mockEndpoint('discovery', Endpoints.NAMESPACES.GET, { data: ['payments', 'billing'] });
    const seed: StoreSeed = {
      ...seedGlobalConfig({ excludedNamespaces: ['billing'] }),
      applications: {
        applications: [
          { name: 'checkout', namespaces: { items: [{ name: 'payments' }] } },
          { name: 'ledger', namespaces: { items: [{ name: 'billing' }] } },
        ],
      } as never,
    };
    const { user } = renderApp(<DiscoveryBehaviorSection />, { seed });

    await pickInSoleSelect(user, 'payments');

    expect(
      await screen.findByText(
        `1 ${GOV.LABELS.NAMESPACES_IMPACT_NOUN} ${GOV.LABELS.NAMESPACES_IMPACT_HIDDEN}`,
      ),
    ).toBeInTheDocument();
  });

  it('reports namespaces it could not load', async () => {
    mockServerError('discovery', Endpoints.NAMESPACES.GET);

    renderApp(<DiscoveryBehaviorSection />);

    expect(await screen.findByText(GOV.MESSAGES.NAMESPACES_LOAD_FAILED)).toBeInTheDocument();
  });
});

describe('sign-in settings page', () => {
  it('shows the bootstrap card for the bootstrap account', async () => {
    signIn({ bootstrap: true });
    CONFIG_GET();
    mockEndpoint('exporter', Endpoints.BOOTSTRAP.GET, { data: buildBootstrapStatus() });
    const seed = permissionsSeed('Admin');
    seed.permissions = {
      ...seed.permissions,
      roles: seed.permissions?.roles?.map((role) => ({
        ...role,
        scopes: [{ scope: 'ALL', level: 'Admin' as const, rules: [] }],
      })),
    };

    renderApp(<IdentityProviderSectionContent />, { seed });

    expect(await screen.findByText(BOOTSTRAP_TEXTS.CARD_TITLE)).toBeInTheDocument();
    expect(await screen.findByText(BOOTSTRAP_TEXTS.NO_REQUESTS)).toBeInTheDocument();
  });
});
