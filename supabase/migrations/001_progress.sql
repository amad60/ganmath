-- Satu baris per akun orang tua. Anak tidak punya akun sendiri.
-- RLS: hanya pemilik yang bisa baca/tulis progress-nya.

create table if not exists public.progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz not null
);

alter table public.progress enable row level security;

create policy "owner reads own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "owner inserts own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "owner updates own progress"
  on public.progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
