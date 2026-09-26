// S7 — notifications_flow
// Purpose: cursor-paginated list → mark first as read → mark all read → clear
// APIs: exporter notifications
// Services: exporter
// Why: only flow exercising cursor pagination in the UI

import { path, cfg, requireToken, requireUserId } from '../lib/config.js';
import { get, post, del, parseJson, resetStepCounter } from '../lib/http.js';
import { METRICS, pickThresholds } from '../lib/metrics.js';
import { buildSummary } from '../lib/report.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: pickThresholds([METRICS.NOTIF_LIST, METRICS.NOTIF_MUTATE]),
};

export const setup = () => {
  requireToken();
  requireUserId();
};

export default function () {
  resetStepCounter();
  const userQ = `userId=${encodeURIComponent(cfg.userId)}`;

  const firstRes = get(`${path.exporter('notifications')}?${userQ}&limit=50`, {
    name: 'notifications.list.page1',
    metric: METRICS.NOTIF_LIST,
  });
  const first = parseJson(firstRes);
  const items = extractItems(first);
  const cursor = extractCursor(first);

  if (cursor) {
    get(
      `${path.exporter('notifications')}?${userQ}&limit=50&cursor=${encodeURIComponent(cursor)}`,
      {
        name: 'notifications.list.page2',
        metric: METRICS.NOTIF_LIST,
      },
    );
  }

  if (items.length > 0) {
    const id = items[0]?.id;
    if (id) {
      post(
        `${path.exporter(`notifications/${encodeURIComponent(id)}/read`)}?${userQ}`,
        {},
        {
          name: 'notifications.markread',
          metric: METRICS.NOTIF_MUTATE,
        },
      );
    }
  }

  post(
    `${path.exporter('notifications/read')}?${userQ}`,
    {},
    {
      name: 'notifications.readall',
      metric: METRICS.NOTIF_MUTATE,
    },
  );

  del(`${path.exporter('notifications')}?${userQ}`, {
    name: 'notifications.clear',
    metric: METRICS.NOTIF_MUTATE,
  });
}

const extractItems = (body) => {
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.items)) return body.items;
  if (Array.isArray(body.data?.items)) return body.data.items;
  return [];
};

const extractCursor = (body) => {
  if (!body) return null;
  return body.nextCursor || body.cursor || body.data?.nextCursor || body.data?.cursor || null;
};

export const handleSummary = buildSummary('notifications_flow');
