import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

/** Clicks an antd Pagination page. Its anchor is role="button" and named "Page N". */
export const goToPage = async (user: UserEvent, page: number): Promise<void> => {
  await user.click(screen.getByRole('button', { name: `Page ${page}` }));
};
