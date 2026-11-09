import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { PROTECTION_PLANS_CONSTANTS as PPC } from '../../features/plans/protection/constants/protectionPlans';
import { pickSelectOption } from '../antd';

const policyCombobox = (): HTMLElement => {
  const select = screen
    .getByText(PPC.CREATE_PAGE.FORM.ADD_POLICY_BUTTON)
    .closest<HTMLElement>('.ant-select');
  if (!select) throw new Error('The policies select is not on screen');
  return within(select).getByRole('combobox');
};

/** Picks one policy in the plan form's policies select, which has no field label of its own. */
export const pickPolicy = (user: UserEvent, policy: string): Promise<void> =>
  // The option's text is the label plus the template's description, so it is matched by its start.
  pickSelectOption(user, policyCombobox(), new RegExp(`^${policy}`));
