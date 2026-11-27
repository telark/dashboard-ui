import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Endpoints, EXPORTER_API, HEADER_LAYOUT } from '../../../constants';
import { mockEndpoint, renderApp } from '../../../test';
import { mockEventStream } from '../../../test/helpers/eventStream';
import { NOTIFICATIONS_TEXTS } from '../../../features/notifications/constants';
import { pluralize } from '../../../utils/helpers/format';
import Header from './Header';

describe('header', () => {
  it('puts the theme switch first on the right, then Documentation and the bell', async () => {
    mockEventStream(`${EXPORTER_API.BASE_URL}/${Endpoints.NOTIFICATIONS.EVENTS.path}`);
    mockEndpoint('exporter', Endpoints.NOTIFICATIONS.LIST, { data: { items: [], unreadCount: 0 } });

    renderApp(<Header />);

    const theme = await screen.findByRole('button', {
      name: HEADER_LAYOUT.THEME_TOGGLE_LABELS.light,
    });
    const docs = screen.getByRole('link', { name: HEADER_LAYOUT.DOCS_LABEL });
    const bell = screen.getByRole('button', {
      name: pluralize(0, NOTIFICATIONS_TEXTS.BELL_UNREAD_NOUN),
    });
    expect(theme.compareDocumentPosition(docs)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(docs.compareDocumentPosition(bell)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
