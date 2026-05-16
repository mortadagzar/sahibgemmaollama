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
const commandCenter = readFileSync('app/src/components/CommandCenter.js', 'utf8');
const chatPanel = readFileSync('app/src/components/ChatPanel.js', 'utf8');
const chatMessage = readFileSync('app/src/components/ChatMessage.js', 'utf8');
const avatar = readFileSync('app/src/components/SahibuyaAvatar.js', 'utf8');
const taskCreation = readFileSync('app/src/components/TaskCreationCard.js', 'utf8');
const filePicker = readFileSync('app/src/components/FilePickerModal.js', 'utf8');
const kanban = readFileSync('app/src/components/CoworkerKanban.js', 'utf8');
const chatRoute = readFileSync('app/api/chat/route.js', 'utf8');
const tasksRoute = readFileSync('app/api/tasks/route.js', 'utf8');
const fileRoute = readFileSync('app/api/file-storage/files/route.js', 'utf8');
const oauthStartRoute = readFileSync('app/api/file-storage/oauth/start/route.js', 'utf8');
const oauthCallbackRoute = readFileSync('app/api/file-storage/oauth/callback/route.js', 'utf8');
const databaseClient = readFileSync('app/src/lib/databaseClient.js', 'utf8');
const providerClient = readFileSync('app/src/lib/providerClient.js', 'utf8');
const chatMigration = readFileSync('database/migrations/001_chat_messages.sql', 'utf8');
const taskMigration = readFileSync('database/migrations/002_tasks_and_file_storage.sql', 'utf8');
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

test('renders the two-panel command center with externalized copy and responsive proportions', () => {
  assert.match(copy, /chatTitle: '\\u0627\\u0644\\u0645\\u062d\\u0627\\u062f\\u062b\\u0629'/);
  assert.match(copy, /workspaceTitle: '\\u0644\\u0648\\u062d\\u0629 \\u0627\\u0644\\u0639\\u0645\\u0644'/);
  assert.match(page, /<CommandCenter \/>/);
  assert.match(commandCenter, /<ChatPanel/);
  assert.match(commandCenter, /<StagePanel/);
  assert.match(chatPanel, /md:w-2\/5/);
  assert.match(commandCenter, /md:flex-row/);
});

test('implements the styled chat bubbles, composer, and avatar states', () => {
  assert.match(chatMessage, /mr-auto flex max-w-2xl animate-fade-in/);
  assert.match(chatMessage, /rounded-lg bg-surface-muted px-4 py-2 font-naskh text-sm text-fg-1/);
  assert.match(chatMessage, /ml-auto w-fit max-w-sm animate-fade-in rounded-lg bg-darkteal-50 px-4 py-2 font-naskh text-sm text-fg-1/);
  assert.match(chatPanel, /rounded-pill border border-stroke-1 bg-bg-elevated px-4 py-3 shadow-sm/);
  assert.match(chatPanel, /bottom-1 left-2 flex h-11 w-11/);
  assert.match(chatPanel, /onStageAction\?\.\(payload\.stageAction\)/);
  assert.match(avatar, /data-state=\{state\}/);
  for (const state of ['idle', 'listening', 'thinking', 'celebrating']) {
    assert.match(readFileSync('app/src/animations/sahibuya-lottie.json', 'utf8'), new RegExp(`"cm": "${state}"`));
  }
});

test('implements styled task creation, file picker, and coworker kanban patterns', () => {
  assert.match(taskCreation, /rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm/);
  assert.match(taskCreation, /w-full rounded-md border border-stroke-1 bg-surface-muted px-4 py-2 font-naskh text-sm text-fg-1/);
  assert.match(taskCreation, /px-4 py-2 rounded-md border border-stroke-2 text-fg-2 hover:bg-white\/\[0\.08\] font-naskh text-sm transition-all/);
  assert.match(taskCreation, /px-4 py-2 rounded-md bg-darkteal-500 hover:bg-darkteal-700 text-white font-naskh text-sm transition-all focus:shadow-focus/);
  assert.match(filePicker, /rounded-lg border border-stroke-1 bg-bg-elevated p-4 shadow-lg/);
  assert.match(filePicker, /rounded-md bg-surface-muted p-3 text-right text-fg-2 font-naskh text-sm hover:bg-white\/\[0\.08\] transition-all/);
  assert.match(kanban, /text-fg-2 font-naskh text-sm font-bold mb-2/);
  assert.match(kanban, /bg-danger animate-pulse/);
  assert.match(kanban, /bg-warning shadow-sm/);
  assert.match(kanban, /bg-success/);
});

test('adds chat, task, file, and provider-backed API persistence without vendor-specific frontend code', () => {
  assert.match(chatMigration, /create table if not exists public\.chat_messages/);
  assert.match(taskMigration, /create table if not exists public\.tasks/);
  assert.match(taskMigration, /create table if not exists public\.files/);
  assert.match(taskMigration, /create table if not exists public\.file_storage_tokens/);
  assert.match(taskMigration, /encrypted_access_token bytea not null/);
  assert.match(chatRoute, /getActiveProviderSettings\('ai_chat'\)/);
  assert.match(chatRoute, /stageAction/);
  assert.match(tasksRoute, /insertTask/);
  assert.match(tasksRoute, /insertFileReference/);
  assert.match(fileRoute, /getActiveProviderSettings\('file_storage_provider'\)/);
  assert.match(oauthStartRoute, /authorizationUrl/);
  assert.match(oauthCallbackRoute, /storeFileStorageTokens/);
  assert.match(databaseClient, /provider_type=eq/);
  assert.match(providerClient, /requestFileStorage/);
});

test('avoids disallowed palette and theme patterns in the shell source', () => {
  const source = [layout, page, globals, designCss, tailwind, commandCenter, chatPanel, chatMessage, avatar, taskCreation, filePicker, kanban, chatRoute, tasksRoute, fileRoute, oauthStartRoute, oauthCallbackRoute, databaseClient, providerClient].join('\n');
  assert.doesNotMatch(source, /dark:/);
  assert.doesNotMatch(source, /data-theme/);
  assert.doesNotMatch(source, /terracotta-/);
  assert.doesNotMatch(source, /text-(gray|slate|zinc|neutral|stone|black|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-/);
});
