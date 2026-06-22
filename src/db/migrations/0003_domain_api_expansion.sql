alter table categories add column if not exists category_type text not null default 'consumables';
alter table categories add column if not exists active boolean not null default true;

alter table items add column if not exists attributes jsonb not null default '{}';
alter table items add column if not exists tracking_mode text not null default 'unit-tracked';
alter table items add column if not exists active boolean not null default true;

alter table vendors add column if not exists active boolean not null default true;

alter table item_vendor_pricing add column if not exists preferred boolean not null default false;
alter table item_vendor_pricing add column if not exists vendor_sku text;
alter table item_vendor_pricing add column if not exists purchase_unit text not null default 'each';

alter table locations add column if not exists active boolean not null default true;
alter table bins add column if not exists active boolean not null default true;

alter table barcode_mappings add column if not exists priority text not null default 'vendor_barcode';
alter table barcode_mappings add column if not exists active boolean not null default true;

alter table jobs add column if not exists client_name text not null default 'Local Client';
alter table jobs add column if not exists due_date date;
alter table jobs add column if not exists source text not null default 'local';
alter table jobs add column if not exists external_reference text;

create table if not exists roll_measurements (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  inventory_unit_id uuid not null references inventory_units(id) on delete cascade,
  remaining_length numeric(14, 4) not null check (remaining_length >= 0),
  method text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
