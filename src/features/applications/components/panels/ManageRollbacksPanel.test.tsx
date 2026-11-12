import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Endpoints } from '../../../../constants';
import { clickButton, mockEndpoint, permissionsSeed, mockServerError } from '../../../../test';
import {
  buildApplication,
  buildApplicationRollback,
} from '../../../../test/factories/applications';
import { ACTION_PERMISSIONS } from '../../../auth/hooks/permissions/permissionEngine';
import { ADMISSION_DENIED_MARKER } from '../../constants/applications';
import { clickInDialog } from '../../../../test/helpers/dialogs';
import { renderManagePanel } from '../../../../test/helpers/managePanel';
import { APPLICATIONS_UI } from '../../constants/texts';
import type { ApplicationRollbackEntry } from '../../models';
import ManageRollbacksPanel from './ManageRollbacksPanel';

const UI = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
const NAME = 'orders';
const PENDING = buildApplicationRollback({ id: 'rb-1', status: 'pending', completedAt: null });

const renderPanel = (
  detailRollbacks: ApplicationRollbackEntry[],
  seed = permissionsSeed(),
  onAfterAbort = vi.fn(),
) => renderManagePanel(ManageRollbacksPanel, NAME, { detailRollbacks, onAfterAbort }, seed);

describe('manage rollbacks panel', () => {
  it('shows an empty state with nothing to list', async () => {
    renderPanel([]);

    expect(await screen.findByText(UI.ROLLBACKS_EMPTY_TITLE)).toBeInTheDocument();
  });

  it('labels each rollback with the generation it went back to', async () => {
    const rollback = buildApplicationRollback({
      targetGeneration: 9,
      status: 'success',
      restoredGeneration: 10,
    });

    renderPanel([rollback]);

    expect(await screen.findByText(`${UI.ROLLBACK_TARGET_PREFIX} 9`)).toBeInTheDocument();
    expect(screen.getByText(`${UI.RESTORED_PREFIX} 10`)).toBeInTheDocument();
  });

  it('explains a rollback an admission policy refused and keeps the raw error', async () => {
    const rollback = buildApplicationRollback({
      status: 'failed',
      error: `denied by ${ADMISSION_DENIED_MARKER} "guard"`,
    });

    renderPanel([rollback]);

    expect(await screen.findByText(UI.ROLLBACK_ADMISSION_BLOCKED)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: new RegExp(UI.TECHNICAL_DETAILS) }),
    ).toBeInTheDocument();
  });

  it('aborts a pending rollback after confirming', async () => {
    const abort = mockEndpoint(
      'discovery',
      Endpoints.APPLICATIONS.ABORT_ROLLBACK(NAME, PENDING.id),
      {
        data: buildApplication({ name: NAME }),
      },
    );
    const onAfterAbort = vi.fn();
    const { user } = renderPanel([PENDING], permissionsSeed(), onAfterAbort);

    await clickButton(user, UI.ABORT_ROLLBACK);
    await clickInDialog(user, UI.ABORT_CONFIRM_OK);

    await waitFor(() => expect(abort.calls).toHaveLength(1));
    expect(await screen.findByText(UI.ABORT_SUCCESS)).toBeInTheDocument();
    expect(onAfterAbort).toHaveBeenCalledOnce();
  });

  it('says so when the abort fails', async () => {
    mockServerError('discovery', Endpoints.APPLICATIONS.ABORT_ROLLBACK(NAME, PENDING.id));
    const { user } = renderPanel([PENDING]);

    await clickButton(user, UI.ABORT_ROLLBACK);
    await clickInDialog(user, UI.ABORT_CONFIRM_OK);

    expect(await screen.findByText(UI.ABORT_FAILED)).toBeInTheDocument();
  });

  it('disables the abort for viewers who may not roll back', async () => {
    const seed = permissionsSeed('ReadOnly', [ACTION_PERMISSIONS.applications.rollback.deny]);

    renderPanel([PENDING], seed);

    expect(await screen.findByRole('button', { name: UI.ABORT_ROLLBACK })).toBeDisabled();
  });
});
