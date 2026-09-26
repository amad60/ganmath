-- Kode 6 digit yang dibuat di HP yang sudah masuk, diketik di HP baru (PWA).
-- Magic link email membuka browser lain di iOS, bukan PWA di home screen.

create table if not exists public.pairing_codes (
  code text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  expires_at timestamptz not null,
  attempts int not null default 0
);

create index if not exists pairing_codes_user_id_idx on public.pairing_codes (user_id);

alter table public.pairing_codes enable row level security;

create policy "owner inserts own pairing code"
  on public.pairing_codes for insert
  with check (auth.uid() = user_id);

create policy "owner reads own pairing code"
  on public.pairing_codes for select
  using (auth.uid() = user_id);

create policy "owner deletes own pairing code"
  on public.pairing_codes for delete
  using (auth.uid() = user_id);

grant select, insert, delete on public.pairing_codes to authenticated;
grant all on public.pairing_codes to service_role;
