import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Endpoints } from '../../../../constants';
import { clickButton, mockEndpoint, permissionsSeed, type StoreSeed } from '../../../../test';
import {
  buildApplication,
  buildApplicationSnapshot,
} from '../../../../test/factories/applications';
import { ROLLBACK_UNDO_WINDOW_SECONDS } from '../../constants/applications';
import { clickInDialog } from '../../../../test/helpers/dialogs';
import { renderManagePanel } from '../../../../test/helpers/managePanel';
import { APPLICATIONS_UI } from '../../constants/texts';
import ManageSnapshotsPanel from './ManageSnapshotsPanel';

const UI = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
const NAME = 'orders';
const [OLDER, NEWER] = [
  buildApplicationSnapshot({ id: 'snap-older', generation: 3 }),
  buildApplicationSnapshot({ id: 'snap-newer', generation: 4 }),
];

const renderPanel = (
  detailSnapshots = [OLDER, NEWER],
  { seed = permissionsSeed() as StoreSeed, rollbackDisabled = false } = {},
) =>
  renderManagePanel(
    ManageSnapshotsPanel,
    NAME,
    {
      detailSnapshots,
      rollbackDisabled,
      rollbackDisabledReason: rollbackDisabled ? 'sync' : null,
    },
    seed,
  );

const openRow = async () => screen.findAllByRole('button', { name: UI.VIEW_MANIFEST });

describe('manage snapshots panel', () => {
  it('lists snapshots newest first', async () => {
    renderPanel();

    const generations = await screen.findAllByText(new RegExp(String.raw`^${UI.GENERATION} \d+$`));
    expect(generations[0]).toHaveTextContent(`${UI.GENERATION} ${NEWER.generation}`);
  });

  it('shows an empty state with nothing to list', async () => {
    renderPanel([]);

    expect(await screen.findByText(UI.EMPTY_TITLE)).toBeInTheDocument();
  });

  it('shows the error when the list could not be read', async () => {
    renderPanel([], {
      seed: { ...permissionsSeed(), applications: { snapshotsError: 'Exporter is down' } },
    });

    expect(await screen.findByText('Exporter is down')).toBeInTheDocument();
  });

  it('opens a manifest and comes back to the list', async () => {
    const manifest = mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_MANIFEST(NEWER.id), {
      metadata: { name: 'checkout' },
    });
    const { user } = renderPanel();

    await user.click((await openRow())[0]);

    expect(await screen.findByText(/checkout/)).toBeInTheDocument();
    expect(manifest.calls[0].url.searchParams.get('generation')).toBe(String(NEWER.generation));
    await clickButton(user, UI.MANIFEST_BACK);
    expect(await screen.findAllByRole('button', { name: UI.VIEW_MANIFEST })).toHaveLength(2);
  });

  it.each([
    [404, UI.MANIFEST_NOT_FOUND_TITLE],
    [500, UI.MANIFEST_ERROR_TITLE],
  ])('explains a manifest that answers %i', async (status, title) => {
    mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_MANIFEST(NEWER.id), {}, { status });
    const { user } = renderPanel();

    await user.click((await openRow())[0]);

    expect(await screen.findByText(title)).toBeInTheDocument();
  });

  describe('compare', () => {
    const selectBoth = async (user: UserEvent) => {
      await clickButton(user, UI.COMPARE);
      for (const box of await screen.findAllByRole('checkbox')) await user.click(box);
      await clickButton(user, UI.COMPARE);
    };

    const deployment = (replicas: number) => ({
      kind: 'Deployment',
      metadata: { name: 'checkout' },
      spec: { replicas },
    });

    it.each([
      ['summarizes what changed', deployment(2), deployment(3), 200, UI.COMPARE_STAT_CHANGES],
      [
        'says two snapshots are identical',
        deployment(2),
        deployment(2),
        200,
        UI.COMPARE_IDENTICAL_TITLE,
      ],
      ['offers a retry when a manifest cannot be read', {}, {}, 500, UI.COMPARE_ERROR_TITLE],
    ])('%s', async (_label, older, newer, status, title) => {
      mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_MANIFEST(OLDER.id), older, { status });
      mockEndpoint('exporter', Endpoints.SNAPSHOTS.GET_MANIFEST(NEWER.id), newer, { status });
      const { user } = renderPanel();

      await selectBoth(user);

      expect(await screen.findByText(title)).toBeInTheDocument();
    });

    it('does not offer compare with a single snapshot', async () => {
      renderPanel([NEWER]);

      await openRow();
      expect(
        screen.queryByRole('button', { name: new RegExp(UI.COMPARE) }),
      ).not.toBeInTheDocument();
    });
  });

  it('blocks rollback while a sync runs', async () => {
    renderPanel([NEWER], { rollbackDisabled: true });

    expect(await screen.findByRole('button', { name: UI.ROLLBACK })).toBeDisabled();
  });

  describe('rollback undo window', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'], shouldAdvanceTime: true });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    const startRollback = async (user: UserEvent) => {
      await clickButton(user, UI.ROLLBACK);
      await clickInDialog(user, UI.ROLLBACK_CONFIRM_OK);
    };

    it('sends the rollback when the countdown runs out', async () => {
      const application = buildApplication({ name: NAME });
      const rollback = mockEndpoint('discovery', Endpoints.APPLICATIONS.TRIGGER_ROLLBACK(NAME), {
        data: application,
      });
      const { user } = renderPanel([NEWER]);

      await startRollback(user);
      await vi.advanceTimersByTimeAsync(ROLLBACK_UNDO_WINDOW_SECONDS * 1_000);

      await waitFor(() => expect(rollback.calls).toHaveLength(1));
      expect(rollback.calls[0].body).toEqual({
        snapshotGeneration: NEWER.generation,
        triggeredBy: 'user-under-test',
      });
    });

    it('sends nothing when the undo is pressed in time', async () => {
      const rollback = mockEndpoint('discovery', Endpoints.APPLICATIONS.TRIGGER_ROLLBACK(NAME), {});
      const { user } = renderPanel([NEWER]);

      await startRollback(user);
      await clickInDialog(user, new RegExp(UI.ROLLBACK_UNDO));
      await vi.advanceTimersByTimeAsync(ROLLBACK_UNDO_WINDOW_SECONDS * 1_000);

      expect(rollback.calls).toHaveLength(0);
    });

    it('asks a signed-in user to start a rollback', async () => {
      const { user } = renderPanel([NEWER], {
        seed: {
          ...permissionsSeed(),
          permissions: { ...permissionsSeed().permissions, userID: '' },
        },
      });

      await startRollback(user);

      expect(await screen.findByText(UI.ROLLBACK_USER_REQUIRED)).toBeInTheDocument();
    });
  });
});
