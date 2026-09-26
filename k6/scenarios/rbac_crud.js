// S3 — rbac_crud
// Purpose: create-list-get-update-delete one of each: user, group, access role, category
// APIs: exporter (writes); auth (cleanup for users/groups/roles); exporter (delete for categories)
// Services: exporter + auth (finalizer cascade)
// Why: only flow exercising cross-service async delete cascade (auth → exporter add/remove-finalizer)

import { path, requireToken, requireUserId } from '../lib/config.js';
import { get, post, patch, del, parseJson, resetStepCounter } from '../lib/http.js';
import { METRICS, pickThresholds } from '../lib/metrics.js';
import { fixtures } from '../lib/fixtures.js';
import { buildSummary } from '../lib/report.js';

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: pickThresholds([
    METRICS.RBAC_WRITE,
    METRICS.RBAC_CLEANUP,
    METRICS.CACHED_LIST,
    METRICS.CACHED_GET,
  ]),
};

export const setup = () => {
  requireToken();
  requireUserId();
};

export default function () {
  resetStepCounter();

  runUserCycle();
  runGroupCycle();
  runRoleCycle();
  runCategoryCycle();
}

const extractId = (body) => {
  if (!body) return null;
  if (body.id) return body.id;
  if (body.data?.id) return body.data.id;
  if (body.data?.metadata?.name) return body.data.metadata.name;
  return null;
};

const runUserCycle = () => {
  const payload = fixtures.user();
  const created = post(path.exporter('users'), payload, {
    name: 'users.create',
    metric: METRICS.RBAC_WRITE,
  });
  const id = extractId(parseJson(created));
  if (!id) {
    console.log('[info] no user id returned, skipping rest of users cycle');
    return;
  }

  get(path.exporter('users'), {
    name: 'users.list',
    metric: METRICS.CACHED_LIST,
  });

  get(path.exporter(`users/${encodeURIComponent(id)}`), {
    name: 'users.get',
    metric: METRICS.CACHED_GET,
  });

  patch(
    path.exporter(`users/${encodeURIComponent(id)}`),
    { fullname: `${payload.fullname} (edited)` },
    {
      name: 'users.patch',
      metric: METRICS.RBAC_WRITE,
    },
  );

  del(path.auth(`auth/users/${encodeURIComponent(id)}`), {
    name: 'users.cleanup',
    metric: METRICS.RBAC_CLEANUP,
  });
};

const runGroupCycle = () => {
  const payload = fixtures.group();
  const created = post(path.exporter('groups'), payload, {
    name: 'groups.create',
    metric: METRICS.RBAC_WRITE,
  });
  const id = extractId(parseJson(created));
  if (!id) {
    console.log('[info] no group id returned, skipping rest of groups cycle');
    return;
  }

  get(path.exporter('groups'), {
    name: 'groups.list',
    metric: METRICS.CACHED_LIST,
  });

  get(path.exporter(`groups/${encodeURIComponent(id)}`), {
    name: 'groups.get',
    metric: METRICS.CACHED_GET,
  });

  patch(
    path.exporter(`groups/${encodeURIComponent(id)}`),
    { description: 'k6 edited' },
    {
      name: 'groups.patch',
      metric: METRICS.RBAC_WRITE,
    },
  );

  del(path.auth(`auth/groups/${encodeURIComponent(id)}`), {
    name: 'groups.cleanup',
    metric: METRICS.RBAC_CLEANUP,
  });
};

const runRoleCycle = () => {
  const payload = fixtures.role();
  const created = post(path.exporter('accessroles'), payload, {
    name: 'roles.create',
    metric: METRICS.RBAC_WRITE,
  });
  const id = extractId(parseJson(created));
  if (!id) {
    console.log('[info] no role id returned, skipping rest of roles cycle');
    return;
  }

  get(path.exporter('accessroles'), {
    name: 'roles.list',
    metric: METRICS.CACHED_LIST,
  });

  get(path.exporter(`accessroles/${encodeURIComponent(id)}`), {
    name: 'roles.get',
    metric: METRICS.CACHED_GET,
  });

  patch(
    path.exporter(`accessroles/${encodeURIComponent(id)}`),
    { description: 'k6 edited' },
    {
      name: 'roles.patch',
      metric: METRICS.RBAC_WRITE,
    },
  );

  del(path.auth(`auth/accessroles/${encodeURIComponent(id)}`), {
    name: 'roles.cleanup',
    metric: METRICS.RBAC_CLEANUP,
  });
};

const runCategoryCycle = () => {
  const payload = fixtures.category();
  const created = post(path.exporter('categories'), payload, {
    name: 'categories.create',
    metric: METRICS.RBAC_WRITE,
  });
  const id = extractId(parseJson(created));
  if (!id) {
    console.log('[info] no category id returned, skipping rest of categories cycle');
    return;
  }

  get(path.exporter('categories'), {
    name: 'categories.list',
    metric: METRICS.CACHED_LIST,
  });

  get(path.exporter(`categories/${encodeURIComponent(id)}`), {
    name: 'categories.get',
    metric: METRICS.CACHED_GET,
  });

  patch(
    path.exporter(`categories/${encodeURIComponent(id)}`),
    { description: 'k6 edited' },
    {
      name: 'categories.patch',
      metric: METRICS.RBAC_WRITE,
    },
  );

  del(path.exporter(`categories/${encodeURIComponent(id)}`), {
    name: 'categories.delete',
    metric: METRICS.RBAC_WRITE,
  });
};

export const handleSummary = buildSummary('rbac_crud');
