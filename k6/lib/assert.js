import { check } from 'k6';

export const isOk = (res) => res && res.status >= 200 && res.status < 300;

export const assertOk = (res, name, extraChecks = {}) => {
  const baseChecks = {
    [`${name} :: 2xx status`]: (r) => isOk(r),
  };
  const all = { ...baseChecks, ...extraChecks };
  const passed = check(res, all);
  if (!passed) {
    console.error(`[FAIL] ${name} :: status=${res?.status} body=${truncate(res?.body)}`);
  }
  return passed;
};

export const assertShape = (res, name, shapeCheck) => {
  let body = null;
  try {
    body = res.json();
  } catch {
    console.error(`[FAIL] ${name} :: body not JSON`);
    return false;
  }
  const passed = check(body, { [`${name} :: shape`]: shapeCheck });
  if (!passed) {
    console.error(`[FAIL] ${name} :: shape mismatch, body=${truncate(JSON.stringify(body))}`);
  }
  return passed;
};

const truncate = (s, n = 300) => {
  if (s == null) return '';
  const str = String(s);
  return str.length > n ? `${str.slice(0, n)}…` : str;
};
