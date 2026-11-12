import type { ReactElement } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CONNECTIVITY_CONSTANTS } from '../../constants/pages/connectivity';
import { renderApp } from '../render';

interface ListPageContract<TItem> {
  feature: string;
  page: ReactElement;
  build: () => TItem;
  /** The text a record shows on the page. */
  label: (item: TItem) => string;
  /** Mocks the list and the page's side requests. */
  mockList: (items: TItem[]) => void;
  /** Makes the list unreachable. */
  failList: () => void;
  emptyTitle: string;
}

/** The states every list page shares: populated, empty and unreachable. */
export const describeListPage = <TItem,>(contract: ListPageContract<TItem>): void => {
  describe(`${contract.feature} list page`, () => {
    it('shows the records the server returns', async () => {
      const item = contract.build();
      contract.mockList([item]);

      renderApp(contract.page);

      expect(await screen.findByText(contract.label(item))).toBeInTheDocument();
    });

    it('shows its empty state when there are no records', async () => {
      contract.mockList([]);

      renderApp(contract.page);

      expect(await screen.findByText(contract.emptyTitle)).toBeInTheDocument();
    });

    it('shows the unreachable state when the server is out of reach', async () => {
      contract.mockList([]);
      contract.failList();

      renderApp(contract.page);

      expect(await screen.findByText(CONNECTIVITY_CONSTANTS.UNREACHABLE.TITLE)).toBeInTheDocument();
    });
  });
};
