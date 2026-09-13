import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const exec = promisify(execFile);

test('source entry uses project-relative URLs for GitHub Pages', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /href="\.\/src\/styles\.css"/);
  assert.match(html, /import\('\.\/src\/app\.js'\)/);
  assert.doesNotMatch(html, /(?:href|src)="\/src\//);
});

test('production build is a self-contained page', async () => {
  await exec(process.execPath, ['scripts/build.js']);
  const html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(html, /Here’s what to wear\./);
  assert.match(html, /<style>/);
  assert.doesNotMatch(html, /src\/app\.js/);
  assert.doesNotMatch(html, /src\/styles\.css/);
});
