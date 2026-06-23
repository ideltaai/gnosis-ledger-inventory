alter table users add column if not exists name text;
alter table users add column if not exists password_hash text;
alter table users add column if not exists status text not null default 'active';
alter table users add column if not exists updated_at timestamptz not null default now();
alter table users add column if not exists last_login_at timestamptz;
update users set name = display_name where name is null;
alter table users alter column name set not null;

create table if not exists auth_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
