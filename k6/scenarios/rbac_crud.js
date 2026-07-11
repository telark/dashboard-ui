// S3 — rbac_crud
// Purpose: create-list-get-update-delete one of each: user, group, role, category
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
  const created = post(path.exporter('resources/users/create'), payload, {
    name: 'users.create',
    metric: METRICS.RBAC_WRITE,
  });
  const id = extractId(parseJson(created));
  if (!id) {
    console.log('[info] no user id returned, skipping rest of users cycle');
    return;
  }

  get(path.exporter('resources/users/get'), {
    name: 'users.list',
    metric: METRICS.CACHED_LIST,
  });

  get(path.exporter(`resources/users/findbyid/${encodeURIComponent(id)}/get`), {
    name: 'users.findbyid',
    metric: METRICS.CACHED_GET,
  });

  patch(
    path.exporter(`resources/users/${encodeURIComponent(id)}/patch`),
    { fullname: `${payload.fullname} (edited)` },
    {
      name: 'users.patch',
      metric: METRICS.RBAC_WRITE,
    },
  );

  del(path.auth(`auth/users/${encodeURIComponent(id)}/cleanup`), {
    name: 'users.cleanup',
    metric: METRICS.RBAC_CLEANUP,
  });
};

const runGroupCycle = () => {
  const payload = fixtures.group();
  const created = post(path.exporter('resources/groups/create'), payload, {
    name: 'groups.create',
    metric: METRICS.RBAC_WRITE,
  });
  const id = extractId(parseJson(created));
  if (!id) {
    console.log('[info] no group id returned, skipping rest of groups cycle');
    return;
  }

  get(path.exporter('resources/groups/get'), {
    name: 'groups.list',
    metric: METRICS.CACHED_LIST,
  });

  get(path.exporter(`resources/groups/${encodeURIComponent(id)}/get`), {
    name: 'groups.get',
    metric: METRICS.CACHED_GET,
  });

  patch(
    path.exporter(`resources/groups/${encodeURIComponent(id)}/patch`),
    { description: 'k6 edited' },
    {
      name: 'groups.patch',
      metric: METRICS.RBAC_WRITE,
    },
  );

  del(path.auth(`auth/groups/${encodeURIComponent(id)}/cleanup`), {
    name: 'groups.cleanup',
    metric: METRICS.RBAC_CLEANUP,
  });
};

const runRoleCycle = () => {
  const payload = fixtures.role();
  const created = post(path.exporter('resources/roles/create'), payload, {
    name: 'roles.create',
    metric: METRICS.RBAC_WRITE,
  });
  const id = extractId(parseJson(created));
  if (!id) {
    console.log('[info] no role id returned, skipping rest of roles cycle');
    return;
  }

  get(path.exporter('resources/roles/get'), {
    name: 'roles.list',
    metric: METRICS.CACHED_LIST,
  });

  get(path.exporter(`resources/roles/${encodeURIComponent(id)}/get`), {
    name: 'roles.get',
    metric: METRICS.CACHED_GET,
  });

  patch(
    path.exporter(`resources/roles/${encodeURIComponent(id)}/patch`),
    { description: 'k6 edited' },
    {
      name: 'roles.patch',
      metric: METRICS.RBAC_WRITE,
    },
  );

  del(path.auth(`auth/roles/${encodeURIComponent(id)}/cleanup`), {
    name: 'roles.cleanup',
    metric: METRICS.RBAC_CLEANUP,
  });
};

const runCategoryCycle = () => {
  const payload = fixtures.category();
  const created = post(path.exporter('classification/categories/create'), payload, {
    name: 'categories.create',
    metric: METRICS.RBAC_WRITE,
  });
  const id = extractId(parseJson(created));
  if (!id) {
    console.log('[info] no category id returned, skipping rest of categories cycle');
    return;
  }

  get(path.exporter('classification/categories/get'), {
    name: 'categories.list',
    metric: METRICS.CACHED_LIST,
  });

  get(path.exporter(`classification/categories/${encodeURIComponent(id)}/get`), {
    name: 'categories.get',
    metric: METRICS.CACHED_GET,
  });

  patch(
    path.exporter(`classification/categories/${encodeURIComponent(id)}/patch`),
    { description: 'k6 edited' },
    {
      name: 'categories.patch',
      metric: METRICS.RBAC_WRITE,
    },
  );

  del(path.exporter(`classification/categories/${encodeURIComponent(id)}/delete`), {
    name: 'categories.delete',
    metric: METRICS.RBAC_WRITE,
  });
};

export const handleSummary = buildSummary('rbac_crud');
