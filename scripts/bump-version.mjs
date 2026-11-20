#!/usr/bin/env node
// Bump the app version for a release.
//
//   npm run bump -- patch|minor|major|<x.y.z>
//
// Updates `version` + increments `versionCode` in package.json (the single
// source of truth read by app.config.js and F-Droid), syncs package-lock.json,
// and creates empty changelog files for the new versionCode in every
// fastlane locale. It does NOT commit or tag — review, fill in the
// changelogs, then commit and tag `v<version>` yourself.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkgPath = join(root, 'package.json');
const lockPath = join(root, 'package-lock.json');
const metadataDir = join(root, 'fastlane', 'metadata', 'android');

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: npm run bump -- patch|minor|major|<x.y.z>');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);

let next;
if (arg === 'patch') next = `${major}.${minor}.${patch + 1}`;
else if (arg === 'minor') next = `${major}.${minor + 1}.0`;
else if (arg === 'major') next = `${major + 1}.0.0`;
else if (/^\d+\.\d+\.\d+$/.test(arg)) next = arg;
else {
  console.error(`Invalid version "${arg}". Use patch, minor, major or x.y.z.`);
  process.exit(1);
}

const nextCode = Number(pkg.versionCode) + 1;

// Edit package.json textually to keep its formatting / key order intact.
const pkgText = readFileSync(pkgPath, 'utf8')
  .replace(/("version":\s*)"[^"]+"/, `$1"${next}"`)
  .replace(/("versionCode":\s*)\d+/, `$1${nextCode}`);
writeFileSync(pkgPath, pkgText);

if (existsSync(lockPath)) {
  const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  lock.version = next;
  if (lock.packages?.['']) lock.packages[''].version = next;
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`);
}

const created = [];
if (existsSync(metadataDir)) {
  for (const locale of readdirSync(metadataDir)) {
    const changelogDir = join(metadataDir, locale, 'changelogs');
    const file = join(changelogDir, `${nextCode}.txt`);
    if (!existsSync(file)) {
      mkdirSync(changelogDir, { recursive: true });
      writeFileSync(file, '');
      created.push(file.slice(root.length + 1));
    }
  }
}

console.log(`Version ${pkg.version} (${pkg.versionCode}) → ${next} (${nextCode})`);
if (created.length > 0) {
  console.log('\nWrite the release notes (max 500 characters) in:');
  for (const file of created) console.log(`  ${file}`);
}
console.log(`\nThen: git commit -am "chore: release v${next}" && git tag v${next}`);
