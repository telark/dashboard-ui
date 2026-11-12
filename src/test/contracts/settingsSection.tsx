import type { ReactElement } from 'react';
import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import type { JsonBodyType } from 'msw';
import { describe, expect, it } from 'vitest';
import { clickButton } from '../antd';
import { mockEndpoint, type EndpointRef, type ServiceName } from '../api';
import { renderApp } from '../render';
import { permissionsSeed, type StoreSeed } from '../store';

const SAVE_LABEL = 'Save';

interface SettingsSaveContract {
  name: string;
  element: ReactElement;
  seed?: StoreSeed;
  /** Mocks what the section reads when it opens. */
  mockReads?: () => void;
  service: ServiceName;
  endpoint: EndpointRef;
  /** Changes one setting the way a user does. */
  change: (user: UserEvent) => Promise<void>;
  expectedBody: unknown;
  /** The answer to a successful save; `{ ok: true }` when the section ignores it. */
  saveResponse?: JsonBodyType;
  savedMessage: string;
  /** The response that fails the save, and what the section then shows. */
  failure: { status: number; body?: JsonBodyType; message: string };
  /** Seed for a user who may read this section but not change it. */
  readOnlySeed?: StoreSeed;
}

const saveButton = () => screen.findByRole('button', { name: new RegExp(`^${SAVE_LABEL}$`) });

/** What every settings card shares: Save lights up on a change, then saves or reports failure. */
export const describeSettingsSave = (contract: SettingsSaveContract): void => {
  const render = (seed: StoreSeed = {}) => {
    contract.mockReads?.();
    return renderApp(contract.element, {
      seed: { ...permissionsSeed(), ...contract.seed, ...seed },
    });
  };

  describe(`${contract.name} settings`, () => {
    it('keeps Save off until something changes, then saves and confirms it', async () => {
      const save = mockEndpoint(
        contract.service,
        contract.endpoint,
        contract.saveResponse ?? { ok: true },
      );
      const { user } = render();
      expect(await saveButton()).toBeDisabled();

      await contract.change(user);
      await clickButton(user, SAVE_LABEL);

      expect(await screen.findByText(contract.savedMessage)).toBeInTheDocument();
      expect(save.calls[0].body).toEqual(contract.expectedBody);
    });

    it('reports a save that fails', async () => {
      const { status, body = {}, message } = contract.failure;
      mockEndpoint(contract.service, contract.endpoint, body, { status });
      const { user } = render();
      await saveButton();

      await contract.change(user);
      await clickButton(user, SAVE_LABEL);

      expect(await screen.findByText(message)).toBeInTheDocument();
    });

    if (contract.readOnlySeed) {
      it('keeps Save off for a read-only user', async () => {
        render(contract.readOnlySeed);

        await waitFor(async () => expect(await saveButton()).toBeDisabled());
      });
    }
  });
};
