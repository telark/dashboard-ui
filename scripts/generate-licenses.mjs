#!/usr/bin/env node
// Generates public/licenses.json: {name, version, license} for every runtime
// dependency, read straight from each package's installed package.json.
// No extra devDependency needed — Node's fs + the existing node_modules tree
// already have everything this requires.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

function resolveLicense(depPkg) {
  if (typeof depPkg.license === 'string') return depPkg.license;
  if (depPkg.license && typeof depPkg.license.type === 'string') return depPkg.license.type;
  if (Array.isArray(depPkg.licenses) && depPkg.licenses.length > 0) {
    return depPkg.licenses.map((l) => l.type).join(' OR ');
  }
  return 'UNKNOWN';
}

const entries = Object.keys(pkg.dependencies ?? {})
  .map((name) => {
    const depPkgPath = path.join(rootDir, 'node_modules', name, 'package.json');
    const depPkg = JSON.parse(readFileSync(depPkgPath, 'utf8'));
    return {
      name,
      version: depPkg.version,
      license: resolveLicense(depPkg),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(
  path.join(rootDir, 'public', 'licenses.json'),
  JSON.stringify(entries, null, 2) + '\n',
);
