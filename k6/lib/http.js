import http from 'k6/http';
import { authedHeaders } from './auth.js';
import { trend } from './metrics.js';
import { assertOk } from './assert.js';

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

const buildParams = (extraHeaders = {}, params = {}) => ({
  ...params,
  headers: { ...JSON_HEADERS, ...authedHeaders(), ...extraHeaders },
});

const recordTiming = (metricName, res) => {
  if (metricName) trend(metricName).add(res.timings.duration);
};

const stepCounter = { n: 0 };

export const resetStepCounter = () => {
  stepCounter.n = 0;
};

const logStep = (name, res) => {
  stepCounter.n += 1;
  const idx = String(stepCounter.n).padStart(2, '0');
  const status = res?.status ?? '???';
  const ms = res?.timings?.duration ? `${Math.round(res.timings.duration)}ms` : 'n/a';
  console.log(`[${idx}] ${name} ${status} ${ms}`);
};

export const get = (url, opts = {}) => {
  const params = buildParams(opts.headers, opts.params);
  const res = http.get(url, params);
  recordTiming(opts.metric, res);
  logStep(opts.name ?? `GET ${url}`, res);
  if (!opts.skipAssert) assertOk(res, opts.name ?? `GET ${url}`, opts.checks ?? {});
  return res;
};

export const post = (url, body, opts = {}) => {
  const params = buildParams(opts.headers, opts.params);
  const payload = body === undefined ? null : JSON.stringify(body);
  const res = http.post(url, payload, params);
  recordTiming(opts.metric, res);
  logStep(opts.name ?? `POST ${url}`, res);
  if (!opts.skipAssert) assertOk(res, opts.name ?? `POST ${url}`, opts.checks ?? {});
  return res;
};

export const patch = (url, body, opts = {}) => {
  const params = buildParams(opts.headers, opts.params);
  const payload = body === undefined ? null : JSON.stringify(body);
  const res = http.patch(url, payload, params);
  recordTiming(opts.metric, res);
  logStep(opts.name ?? `PATCH ${url}`, res);
  if (!opts.skipAssert) assertOk(res, opts.name ?? `PATCH ${url}`, opts.checks ?? {});
  return res;
};

export const del = (url, opts = {}) => {
  const params = buildParams(opts.headers, opts.params);
  const res = http.del(url, null, params);
  recordTiming(opts.metric, res);
  logStep(opts.name ?? `DELETE ${url}`, res);
  if (!opts.skipAssert) assertOk(res, opts.name ?? `DELETE ${url}`, opts.checks ?? {});
  return res;
};

export const parseJson = (res) => {
  try {
    return res.json();
  } catch {
    return null;
  }
};
