import type { UserEvent } from '@testing-library/user-event';
import { findDialog } from '../antd';
import { pressIn } from './accessForms';

/** Clicks a button in the open confirmation dialog, away from the page's same-named buttons. */
export const clickInDialog = async (user: UserEvent, name: string | RegExp): Promise<void> => {
  await pressIn(user, await findDialog(), name);
};
