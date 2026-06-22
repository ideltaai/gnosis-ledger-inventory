create table barcode_mappings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  barcode text not null unique,
  item_id uuid references items(id),
  bin_id uuid references bins(id)
);

create table stock_statuses (
  code text primary key,
  label text not null
);

create table inventory_units (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  item_id uuid not null references items(id),
  bin_id uuid not null references bins(id),
  status text not null references stock_statuses(code),
  quantity numeric(14, 4) not null check (quantity >= 0),
  received_at timestamptz not null default now()
);

create table inventory_ledger (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  item_id uuid not null references items(id),
  bin_id uuid references bins(id),
  tx_type text not null,
  quantity numeric(14, 4) not null,
  reference text,
  created_at timestamptz not null default now()
);

create table allocations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  item_id uuid not null references items(id),
  bin_id uuid references bins(id),
  quantity numeric(14, 4) not null check (quantity > 0),
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  job_number text not null,
  name text not null,
  unique (organization_id, job_number)
);

create table reason_codes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  code text not null,
  label text not null,
  category text not null,
  unique (organization_id, code)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete set null,
  actor_user_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
