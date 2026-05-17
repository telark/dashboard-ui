import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { cfg } from './config.js';

const ts = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
};

export const buildSummary = (scenarioName) => (data) => {
  const stamp = ts();
  const stem = `${cfg.resultsDir}/${scenarioName}_${stamp}`;
  return {
    stdout: textSummary(data, { indent: '  ', enableColors: true }),
    [`${stem}.json`]: JSON.stringify(data, null, 2),
    [`${stem}.txt`]: textSummary(data, { indent: '  ', enableColors: false }),
  };
};
