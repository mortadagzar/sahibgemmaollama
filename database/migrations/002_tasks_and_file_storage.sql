create extension if not exists pgcrypto;

alter table if exists public.provider_settings
  add column if not exists provider_type text not null default 'ai_chat';

create table if not exists public.file_storage_tokens (
  id uuid primary key default gen_random_uuid(),
  provider_type text not null default 'file_storage_provider',
  encrypted_access_token bytea not null,
  encrypted_refresh_token bytea,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assignee_id text,
  project_id uuid,
  status text not null default 'todo',
  due_date date,
  file_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  storage_provider_file_id text not null,
  name text not null,
  mime_type text,
  web_view_link text,
  task_id uuid references public.tasks(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table if exists public.tasks
  add constraint tasks_file_id_fkey foreign key (file_id) references public.files(id) deferrable initially deferred;

create index if not exists tasks_assignee_status_idx on public.tasks (assignee_id, status);
create index if not exists files_task_id_idx on public.files (task_id);
create index if not exists file_storage_tokens_provider_idx on public.file_storage_tokens (provider_type);
