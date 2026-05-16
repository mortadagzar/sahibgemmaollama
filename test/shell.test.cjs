const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const layout = readFileSync('app/layout.js', 'utf8');
const page = readFileSync('app/page.js', 'utf8');
const css = readFileSync('app/globals.css', 'utf8');
const tailwind = readFileSync('tailwind.config.js', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

test('uses Next.js 14 with App Router and Tailwind CSS', () => {
  assert.match(packageJson.dependencies.next, /^14\./);
  assert.match(css, /@tailwind base/);
  assert.match(tailwind, /\.\/app\/\*\*\/\*\.\{js,jsx,mdx\}/);
});

test('sets global RTL Arabic font foundation', () => {
  assert.match(layout, /<html lang="ar" dir="rtl"/);
  assert.match(layout, /Noto_Naskh_Arabic/);
  assert.match(layout, /weight: \['400', '500', '700'\]/);
  assert.match(css, /font-family: var\(--font-noto-naskh-arabic\), serif/);
});

test('renders the requested two-panel shell labels and proportions', () => {
  assert.match(page, /المحادثة/);
  assert.match(page, /لوحة العمل/);
  assert.match(page, /md:w-2\/5/);
  assert.match(page, /md:w-3\/5/);
  assert.match(page, /md:flex-row/);
});

test('keeps the base color system to charcoal, surface, and white text', () => {
  assert.match(tailwind, /charcoal: '#1A1A2E'/);
  assert.match(tailwind, /surface: '#16213E'/);
  assert.match(css, /color: #ffffff/);
  assert.doesNotMatch(page, /text-(gray|slate|zinc|neutral|stone|black|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-/);
});
