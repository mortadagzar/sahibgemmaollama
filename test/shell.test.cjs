const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const layout = readFileSync('app/layout.js', 'utf8');
const page = readFileSync('app/page.js', 'utf8');
const globals = readFileSync('app/globals.css', 'utf8');
const designCss = readFileSync('app/src/index.css', 'utf8');
const tailwind = readFileSync('app/tailwind.config.js', 'utf8');
const rootTailwind = readFileSync('tailwind.config.js', 'utf8');
const copy = readFileSync('app/src/content/copy.js', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

test('uses Next.js 14 with App Router and Tailwind CSS', () => {
  assert.match(packageJson.dependencies.next, /^14\./);
  assert.match(globals, /@tailwind base/);
  assert.match(rootTailwind, /app\/tailwind\.config\.js/);
  assert.match(tailwind, /\.\/app\/\*\*\/\*\.\{js,jsx,mdx\}/);
});

test('sets the RTL language and typography foundation', () => {
  assert.match(layout, /<html lang="ar" dir="rtl"/);
  assert.match(layout, /Noto_Naskh_Arabic/);
  assert.match(layout, /weight: \['400', '500', '700'\]/);
  assert.match(designCss, /--font-ui: var\(--font-noto-naskh-arabic\), "Muna", "Noto Naskh Arabic", serif/);
  assert.match(designCss, /text-align: right/);
});

test('mirrors design-system color tokens between CSS and Tailwind', () => {
  for (const token of ['--bg-base: #2E3035', '--bg-surface: #35383E', '--bg-sunken: #26282C', '--fg-1: #F6F8FF', '--accent-blue: #395387']) {
    assert.match(designCss, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const token of ["'bg-base': 'var(--bg-base)'", "'surface-card': 'var(--bg-surface)'", "'fg-1': 'var(--fg-1)'", "'accent-blue': 'var(--accent-blue)'"]) {
    assert.match(tailwind, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('renders the two-panel shell with externalized copy and responsive proportions', () => {
  assert.match(copy, /chatTitle: '\\u0627\\u0644\\u0645\\u062d\\u0627\\u062f\\u062b\\u0629'/);
  assert.match(copy, /workspaceTitle: '\\u0644\\u0648\\u062d\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0644'/);
  assert.match(page, /shellCopy\.chatTitle/);
  assert.match(page, /shellCopy\.workspaceTitle/);
  assert.match(page, /md:w-2\/5/);
  assert.match(page, /md:w-3\/5/);
  assert.match(page, /md:flex-row/);
});

test('avoids disallowed palette and theme patterns in the shell source', () => {
  const source = [layout, page, globals, designCss, tailwind].join('\n');
  assert.doesNotMatch(source, /dark:/);
  assert.doesNotMatch(source, /data-theme/);
  assert.doesNotMatch(source, /terracotta-/);
  assert.doesNotMatch(source, /text-(gray|slate|zinc|neutral|stone|black|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-/);
});
