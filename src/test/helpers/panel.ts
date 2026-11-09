import { screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import { PANEL_SURFACE_CLASS } from '../../constants';

const openPanel = (): HTMLElement => {
  const panel = document.querySelector<HTMLElement>(`.${PANEL_SURFACE_CLASS}`);
  if (!panel) throw new Error('No slide-out panel is open');
  return panel;
};

/** The open slide-out panel, to scope queries (`within`) away from the page behind it. */
export const findPanel = (): Promise<HTMLElement> => waitFor(openPanel);

/** Waits until the slide-out panel has gone, exit animation included. */
export const waitForPanelClose = async (): Promise<void> => {
  await waitFor(() => expect(document.querySelector(`.${PANEL_SURFACE_CLASS}`)).toBeNull());
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
};
