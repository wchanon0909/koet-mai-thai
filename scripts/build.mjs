import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// No package install, bundler or API key required. Build only public assets.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const publicFiles = [
  'index.html',
  'favicon.svg',
  '.nojekyll',
  'assets/style.css',
  'assets/visual.css',
  'assets/classroom.webp',
  'assets/avatar.webp',
  'assets/panorama.webp',
  'assets/data.js',
  'assets/events.js',
  'assets/sim.js',
];

for (const filename of publicFiles) {
  if (!existsSync(join(root, filename))) {
    throw new Error(`Missing public file: ${filename}`);
  }
}

const html = readFileSync(join(root, 'index.html'), 'utf8');
for (const [, ref] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  if (!ref || ref === './' || /^(https?:|mailto:|tel:|data:|#)/i.test(ref)) continue;
  const local = ref.replace(/^\.\//, '').split(/[?#]/, 1)[0];
  if (!local || local === '/') continue;
  if (local.startsWith('/') || local.includes('..')) {
    throw new Error(`Expected a relative link compatible with GitHub Pages: ${ref}`);
  }
  if (!existsSync(join(root, local)) || !statSync(join(root, local)).isFile()) {
    throw new Error(`Broken local resource in index.html: ${ref}`);
  }
}

rmSync(output, { recursive: true, force: true });
for (const filename of publicFiles) {
  const destination = join(output, filename);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(join(root, filename), destination);
}
console.log(`Built GitHub Pages site at ${output} (${publicFiles.length} files)`);
console.log('Only public app files are deployed. Tests, .github, and docs are excluded.');
