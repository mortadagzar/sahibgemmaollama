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
