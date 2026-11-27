import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '../../../../test';
import IdeManifestCodeBlock from './IdeManifestCodeBlock';

const JSON_CODE = JSON.stringify(
  { kind: 'Deployment', spec: { replicas: 2, paused: false, image: null, ports: [80, -1.5e3] } },
  null,
  2,
);
const YAML_CODE = [
  '# the workload',
  'kind: Deployment',
  'metadata:',
  '  name: "checkout \\"v2\\""',
  "  label: 'web'",
  '  open: "no end',
  "  tier: 'no end",
  '  enabled: yes',
  '  replicas: 3',
  '  ratio: -0.5e2',
  '  note: ports 80 and 443',
  '  - plain list item',
].join('\n');

// The highlighter splits the code into colored parts: every character must still be shown, once.
describe('IdeManifestCodeBlock', () => {
  it.each([
    ['json', JSON_CODE],
    ['yaml', YAML_CODE],
  ] as const)('shows the whole %s manifest', (language, code) => {
    renderApp(<IdeManifestCodeBlock code={code} language={language} />);
    const shown = screen.getByText((_, el) => el?.tagName === 'PRE' && el.textContent === code);
    expect(shown).toBeInTheDocument();
  });
});
