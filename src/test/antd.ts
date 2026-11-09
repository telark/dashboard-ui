import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

type TextMatch = string | RegExp;

// An antd icon is role="img" with its own aria-label, so a Search button's name is "search Search".
const iconTolerantName =
  (label: string) =>
  (name: string): boolean =>
    name === label || name.endsWith(` ${label}`);

export const clickButton = async (user: UserEvent, name: TextMatch): Promise<void> => {
  const matcher = typeof name === 'string' ? iconTolerantName(name) : name;
  await user.click(await screen.findByRole('button', { name: matcher }));
};

/** Opens a list toolbar's collapsed search and pastes the term. */
export const searchList = async (user: UserEvent, placeholder: string, text: string) => {
  await clickButton(user, 'Search');
  await user.click(await screen.findByPlaceholderText(placeholder));
  await user.paste(text);
};

/** Pastes into labeled fields, in order. A value replaces what the field held. */
export const fillFields = async (
  user: UserEvent,
  fields: Readonly<Record<string, string>>,
): Promise<void> => {
  for (const [label, value] of Object.entries(fields)) {
    const field = await screen.findByLabelText(label);
    await user.clear(field);
    await user.click(field);
    if (value) await user.paste(value);
  }
};

const matchesOption = (text: string | null, option: TextMatch): boolean =>
  option instanceof RegExp ? option.test(text ?? '') : text === option;

const visibleOption = (option: TextMatch): HTMLElement | undefined =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      '.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option',
    ),
  ).find((item) => matchesOption(item.textContent, option));

/** Picks an option of the given Select. `search` narrows it first: jsdom virtualizes long lists. */
export const pickSelectOption = async (
  user: UserEvent,
  combobox: HTMLElement,
  option: TextMatch,
  search?: string,
): Promise<void> => {
  if (search) await user.type(combobox, search);
  else await user.click(combobox);
  const match = await waitFor(() => {
    const found = visibleOption(option);
    if (!found) throw new Error(`Option "${String(option)}" isn't open`);
    return found;
  });
  await user.click(match);
};

const isCombobox = (element: HTMLElement): boolean => element.getAttribute('role') === 'combobox';

/** Opens an antd Select by its form label and picks one option. */
export const selectOption = async (user: UserEvent, label: TextMatch, option: TextMatch) => {
  // A label can also name other elements (a tag group, say), so the combobox is picked out.
  const fields = await screen.findAllByLabelText(label);
  await pickSelectOption(user, fields.find(isCombobox) ?? fields[0], option);
};

/** The open modal, to scope queries (`within`) away from the page behind it. */
export const findDialog = (name?: TextMatch): Promise<HTMLElement> =>
  screen.findByRole('dialog', name === undefined ? {} : { name });
