import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';
import { cfg } from './config.js';

const ts = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`;
};

const METRIC_EXPLANATIONS = {
  duration: 'wall-clock time spent on the call (server + network)',
  p95: '95% of requests completed in this time or faster',
  p99: '99% of requests completed in this time or faster',
  p50: 'half of requests completed in this time or faster',
};

export const buildSummary = (scenarioName) => (data) => {
  const stamp = ts();
  const dir = cfg.outputDir.replace(/\/+$/, '');
  const stem = `${dir}/${scenarioName}_${stamp}`;
  const enriched = enrichSummaryWithExplanations(data);
  return {
    stdout: textSummary(data, { indent: '  ', enableColors: true }),
    [`${stem}.html`]: htmlReport(enriched, { title: `${scenarioName} @ ${stamp}` }),
    [`${stem}.json`]: JSON.stringify(data, null, 2),
    [`${stem}.txt`]: textSummary(data, { indent: '  ', enableColors: false }),
  };
};

const enrichSummaryWithExplanations = (data) => {
  const annotations = {
    explanations: METRIC_EXPLANATIONS,
    generatedAt: new Date().toISOString(),
  };
  return { ...data, annotations };
};
