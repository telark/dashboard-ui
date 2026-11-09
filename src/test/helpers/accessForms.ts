import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

// Role queries walk the accessibility tree of the whole document, which costs seconds on antd
// pages when the suite runs in parallel. The flows below use label and text queries instead.

/** A switch next to its visible label: the label isn't associated with the control. */
export const switchFor = (panel: HTMLElement, label: string): HTMLElement => {
  const row = within(panel).getByText(label).parentElement;
  if (!row) throw new Error(`No row for "${label}"`);
  return within(row).getByRole('switch');
};

/** Clicks a button by its label or, for an icon-only one, its aria-label. */
export const clickAction = async (user: UserEvent, name: string | RegExp): Promise<void> => {
  const target = await waitFor(() => screen.queryByLabelText(name) ?? screen.getByText(name));
  await user.click(target);
};

/** Clicks a button inside a panel or dialog element. */
export const pressIn = async (user: UserEvent, container: HTMLElement, name: string | RegExp) => {
  await user.click(within(container).getByRole('button', { name, hidden: true }));
};

/** Opens a toolbar or row menu by its label and clicks one item. */
export const pickMenuItem = async (user: UserEvent, trigger: string, item: string) => {
  await clickAction(user, trigger);
  await user.click(await screen.findByText(item));
};
