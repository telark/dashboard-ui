#!/usr/bin/env node
// Generates, for every production package in package-lock.json, public/licenses.json
// (name, version, license: the Settings > About list) and public/THIRD-PARTY-NOTICES.txt
// (each package's license, notice and credit files, which the minified bundle strips).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const lock = JSON.parse(readFileSync(path.join(rootDir, 'package-lock.json'), 'utf8'));

const LICENSE_FILE = /^(licen[cs]e|copying|notice)/i;
const CODE_FILE = /\.(c|m)?(js|ts)$|\.json$|\.map$/i;

// react-icons bundles icons from other projects without their notices: one entry per set src imports.
const ICON_SETS = {
  ai: ['Ant Design Icons', 'Copyright (c) 2018-present Ant UED, https://xtech.antfin.com/'],
  bi: ['BoxIcons', 'Copyright (c) 2015-2021 Aniket Suvarna'],
  bs: ['Bootstrap Icons', 'Copyright (c) 2019-2024 The Bootstrap Authors'],
  hi: ['Heroicons', 'Copyright (c) Tailwind Labs, Inc.'],
  hi2: ['Heroicons', 'Copyright (c) Tailwind Labs, Inc.'],
  tb: ['Tabler Icons', 'Copyright (c) 2020-2024 Paweł Kuna'],
};

const MIT_TERMS = `Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

function resolveLicense(depPkg, licenseText) {
  if (typeof depPkg.license === 'string') return depPkg.license;
  if (depPkg.license && typeof depPkg.license.type === 'string') return depPkg.license.type;
  if (Array.isArray(depPkg.licenses) && depPkg.licenses.length > 0) {
    return depPkg.licenses.map((l) => l.type).join(' OR ');
  }
  if (/^(the )?mit license/i.test(licenseText)) return 'MIT';
  return 'UNKNOWN';
}

function usedIconSets() {
  const sets = new Set();
  for (const file of readdirSync(path.join(rootDir, 'src'), { recursive: true })) {
    if (!/\.tsx?$/.test(file)) continue;
    const source = readFileSync(path.join(rootDir, 'src', file), 'utf8');
    for (const [, set] of source.matchAll(/from 'react-icons\/(\w+)'/g)) sets.add(set);
  }
  return [...sets].sort();
}

const packages = new Map();
for (const [key, meta] of Object.entries(lock.packages)) {
  const dir = path.join(rootDir, key);
  if (!key.startsWith('node_modules/') || meta.dev || meta.devOptional) continue;
  if (!existsSync(path.join(dir, 'package.json'))) continue;
  const depPkg = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const files = readdirSync(dir)
    .filter((f) => LICENSE_FILE.test(f) && !CODE_FILE.test(f))
    .sort();
  const texts = files.map((f) => readFileSync(path.join(dir, f), 'utf8').trim());
  const repository = depPkg.repository?.url ?? depPkg.repository ?? depPkg.homepage ?? '';
  packages.set(`${depPkg.name}@${depPkg.version}`, {
    name: depPkg.name,
    version: depPkg.version,
    license: resolveLicense(depPkg, texts[0] ?? ''),
    texts,
    repository,
  });
}

const sorted = [...packages.values()].sort(
  (a, b) => a.name.localeCompare(b.name) || a.version.localeCompare(b.version),
);

const sections = sorted.map(({ name, version, license, texts, repository }) => {
  const body =
    texts.length > 0
      ? texts.join('\n\n')
      : `The package ships no license file. Its package.json declares ${license}. Source: ${repository}`;
  return `=== ${name} ${version} (${license})\n\n${body}`;
});

for (const set of usedIconSets()) {
  if (!ICON_SETS[set]) throw new Error(`Add the license of react-icons/${set} to ICON_SETS`);
  const [project, copyright] = ICON_SETS[set];
  sections.push(
    `=== ${project} (react-icons/${set}) (MIT)\n\nMIT License\n\n${copyright}\n\n${MIT_TERMS}`,
  );
}

const header = `Third-party software in the Telark dashboard

The dashboard's own code is licensed under the Elastic License 2.0. The packages, icons and
artwork below stay under their own licenses. The license of each @dicebear avatar style names
the designer, source and license of its artwork.`;

writeFileSync(
  path.join(rootDir, 'public', 'licenses.json'),
  JSON.stringify(
    sorted.map(({ name, version, license }) => ({ name, version, license })),
    null,
    2,
  ) + '\n',
);
writeFileSync(
  path.join(rootDir, 'public', 'THIRD-PARTY-NOTICES.txt'),
  [header, ...sections].join('\n\n\n') + '\n',
);
