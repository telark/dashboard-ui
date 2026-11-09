import { within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { BUTTON_TEXTS, FILTER_PANEL } from '../../constants';
import { clickButton, pickSelectOption, inOrder } from '../antd';
import { findPanel } from './panel';

const filterCombobox = (field: HTMLElement): HTMLElement => {
  const item = field.closest<HTMLElement>('.ant-form-item');
  if (!item) throw new Error('The filter field is not on screen');
  return within(item).getByRole('combobox');
};

/** Opens a list's filter panel, picks one option per field, and applies them. */
export const applyFilters = async (
  user: UserEvent,
  filters: Readonly<Record<string, string>>,
): Promise<void> => {
  await clickButton(user, FILTER_PANEL.TITLE);
  const panel = within(await findPanel());
  await inOrder(Object.entries(filters), async ([label, option]) =>
    pickSelectOption(user, filterCombobox(await panel.findByText(label)), option),
  );
  await clickButton(user, BUTTON_TEXTS.APPLY);
};
