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
const workspacePanel = readFileSync('app/src/components/WorkspacePanel.js', 'utf8');
const chatPanel = readFileSync('app/src/components/ChatPanel.js', 'utf8');
const taskCreation = readFileSync('app/src/components/TaskCreationCard.js', 'utf8');
const filePicker = readFileSync('app/src/components/FilePickerModal.js', 'utf8');
const kanban = readFileSync('app/src/components/KanbanBoard.js', 'utf8');
const chatMessage = readFileSync('app/src/components/ChatMessage.js', 'utf8');
const avatar = readFileSync('app/src/components/SahibuyaAvatar.js', 'utf8');
const route = readFileSync('app/api/chat/route.js', 'utf8');
const tasksRoute = readFileSync('app/api/tasks/route.js', 'utf8');
const taskPatchRoute = readFileSync('app/api/tasks/[id]/route.js', 'utf8');
const storageFilesRoute = readFileSync('app/api/file-storage/files/route.js', 'utf8');
const storageOauthStartRoute = readFileSync('app/api/file-storage/oauth/start/route.js', 'utf8');
const databaseClient = readFileSync('app/src/lib/databaseClient.js', 'utf8');
const providerClient = readFileSync('app/src/lib/providerClient.js', 'utf8');
const migration = readFileSync('database/migrations/001_chat_messages.sql', 'utf8');
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
  assert.match(page, /<CommandCenter \/>/);
  assert.match(commandCenter, /<ChatPanel/);
  assert.match(commandCenter, /<WorkspacePanel/);
  assert.match(workspacePanel, /md:w-3\/5/);
  assert.match(chatPanel, /md:w-2\/5/);
  assert.match(commandCenter, /md:flex-row/);
});

test('implements the styled chat bubbles, composer, and avatar states', () => {
  assert.match(chatMessage, /mr-auto flex max-w-2xl animate-fade-in/);
  assert.match(chatMessage, /rounded-lg bg-surface-muted px-4 py-2 font-naskh text-sm text-fg-1/);
  assert.match(chatMessage, /ml-auto w-fit max-w-sm animate-fade-in rounded-lg bg-darkteal-50 px-4 py-2 font-naskh text-sm text-fg-1/);
  assert.match(chatPanel, /rounded-pill border border-stroke-1 bg-bg-elevated px-4 py-3 shadow-sm/);
  assert.match(chatPanel, /bottom-0 left-2 flex h-11 w-11/);
  assert.match(chatPanel, /fetch\('\/api\/chat'/);
  assert.match(avatar, /data-state=\{state\}/);
  assert.match(avatar, /sahibuya-lottie h-32 w-32/);
  for (const state of ['idle', 'listening', 'thinking', 'celebrating']) {
    assert.match(readFileSync('app/src/animations/sahibuya-lottie.json', 'utf8'), new RegExp(`"cm": "${state}"`));
  }
});

test('adds chat persistence schema and backend route without vendor-specific frontend code', () => {
  assert.match(migration, /create table if not exists public\.chat_messages/);
  assert.match(migration, /sender text not null/);
  assert.match(migration, /content text not null/);
  assert.match(migration, /created_at timestamptz not null default now\(\)/);
  assert.match(migration, /create table if not exists public\.provider_settings/);
  assert.match(route, /insertChatMessage\(\{ sender: payload\.userId \|\| 'user', content: message \}\)/);
  assert.match(route, /insertChatMessage\(\{ sender: 'sahibuya', content: finalReply \}\)/);
  assert.match(databaseClient, /provider_settings\?select=config/);
  assert.match(providerClient, /systemPrompt/);
});

test('implements task creation, file picker, and coworker kanban styling', () => {
  assert.match(taskCreation, /rounded-lg border border-stroke-1 bg-surface-card p-4 shadow-sm/);
  assert.match(taskCreation, /rounded-md border border-stroke-1 bg-surface-muted px-4 py-2 font-naskh text-sm text-fg-1 outline-none transition-all focus:ring-2 focus:ring-blue-300\/40 focus:border-blue-500 placeholder:text-fg-4/);
  assert.match(taskCreation, /px-4 py-2 rounded-md border border-stroke-2 text-fg-2 hover:bg-white\/\[0\.08\] font-naskh text-sm transition-all/);
  assert.match(taskCreation, /px-4 py-2 rounded-md bg-darkteal-500 hover:bg-darkteal-700 text-white font-naskh text-sm transition-all focus:shadow-focus disabled:opacity-50 disabled:cursor-not-allowed/);
  assert.match(filePicker, /rounded-lg border border-stroke-1 bg-bg-elevated p-4 shadow-lg/);
  assert.match(filePicker, /rounded-md bg-surface-muted p-3 text-right font-naskh text-sm text-fg-2 transition-all hover:bg-white\/\[0\.08\]/);
  assert.match(filePicker, /border border-darkteal-500/);
  assert.match(kanban, /font-naskh text-sm font-bold text-fg-2/);
  assert.match(kanban, /rounded-md bg-surface-card border border-stroke-1 p-3 shadow-xs text-right text-fg-1 font-naskh text-sm/);
  assert.match(kanban, /animate-pulse bg-danger/);
  assert.match(kanban, /bg-warning task-dot-soon shadow-sm/);
  assert.match(designCss, /task-dot-soon/);
  assert.match(kanban, /bg-success/);
});

test('adds generic file-storage and task persistence APIs', () => {
  assert.match(migration, /create table if not exists public\.tasks/);
  assert.match(migration, /create table if not exists public\.files/);
  assert.match(migration, /create table if not exists public\.file_storage_provider_settings/);
  assert.match(migration, /create table if not exists public\.file_storage_tokens/);
  assert.match(tasksRoute, /insertTask/);
  assert.match(tasksRoute, /insertFileReference/);
  assert.match(taskPatchRoute, /updateTask/);
  assert.match(storageFilesRoute, /listStorageFiles/);
  assert.match(storageOauthStartRoute, /buildAuthorizationUrl/);
  assert.match(databaseClient, /file_storage_provider_settings\?select=config/);
  assert.match(databaseClient, /file_storage_tokens\?select=encrypted_tokens/);
});

test('avoids disallowed palette and theme patterns in the shell source', () => {
  const source = [layout, page, globals, designCss, tailwind, commandCenter, workspacePanel, chatPanel, chatMessage, avatar, taskCreation, filePicker, kanban, route, tasksRoute, taskPatchRoute, storageFilesRoute, storageOauthStartRoute, databaseClient, providerClient].join('\n');
  assert.doesNotMatch(source, /dark:/);
  assert.doesNotMatch(source, /data-theme/);
  assert.doesNotMatch(source, /terracotta-/);
  assert.doesNotMatch(source, /text-(gray|slate|zinc|neutral|stone|black|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-/);
});
