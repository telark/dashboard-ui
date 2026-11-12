import type { ReactElement } from 'react';
import { screen } from '@testing-library/react';
import { renderApp } from '../render';
import { permissionsSeed, type StoreSeed } from '../store';

interface DetailsPage<TRecord> {
  page: ReactElement;
  /** The route pattern, with `:name` for the record's name. */
  path: string;
  mockRecord: (record: TRecord) => unknown;
  /** Text that appears once the record has loaded. */
  loadedText: string;
}

/** `renderDetails`, and `openDetails` that mocks the record and waits for it, for a routed page. */
export const detailsPage = <TRecord extends { name: string }>({
  page,
  path,
  mockRecord,
  loadedText,
}: DetailsPage<TRecord>) => {
  const renderDetails = (record: TRecord, seed: StoreSeed = permissionsSeed()) =>
    renderApp(page, { route: path.replace(':name', record.name), path, seed });

  const openDetails = async (record: TRecord, seed?: StoreSeed) => {
    mockRecord(record);
    const view = renderDetails(record, seed);
    await screen.findByText(loadedText);
    return view;
  };

  return { renderDetails, openDetails };
};
