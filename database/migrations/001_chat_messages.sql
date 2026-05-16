create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.provider_settings (
  id uuid primary key default gen_random_uuid(),
  is_active boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists chat_messages_created_at_idx on public.chat_messages (created_at);
create index if not exists provider_settings_active_idx on public.provider_settings (is_active);

create table if not exists public.tasks (
  id text primary key,
  title text not null,
  description text,
  assignee_id text,
  project_id text,
  status text not null default 'todo',
  due_date date,
  file_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.files (
  id text primary key,
  storage_provider_file_id text not null,
  name text not null,
  mime_type text,
  web_view_link text,
  task_id text references public.tasks(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.file_storage_provider_settings (
  id uuid primary key default gen_random_uuid(),
  is_active boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.file_storage_tokens (
  id uuid primary key default gen_random_uuid(),
  is_active boolean not null default true,
  encrypted_tokens text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_assignee_status_idx on public.tasks (assignee_id, status);
create index if not exists files_task_id_idx on public.files (task_id);
create index if not exists file_storage_provider_settings_active_idx on public.file_storage_provider_settings (is_active);
