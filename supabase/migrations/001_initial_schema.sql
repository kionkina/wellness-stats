-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  reminder_time text, -- HH:MM format
  timezone text default 'UTC',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Check-ins table
create table public.checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  date date not null,
  mood smallint check (mood between 1 and 5),
  energy smallint check (energy between 1 and 5),
  appetite smallint check (appetite between 1 and 5),
  sleep_hours numeric(3,1) check (sleep_hours between 0 and 24),
  day_description text, -- free-text description of the day, replaces feelings wheel
  mood_tags text[], -- derived mood tags from day_description
  bloating boolean default false,
  bloating_severity smallint check (bloating_severity between 1 and 3),
  exercised boolean default false,
  exercise_type text,
  exercise_minutes smallint,
  period boolean default false,
  flow_level smallint check (flow_level between 1 and 3),
  sick boolean default false,
  pain_areas text[],
  sick_notes text,
  notable_events text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, date)
);

alter table public.checkins enable row level security;

create policy "Users can view own checkins"
  on public.checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on public.checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on public.checkins for update
  using (auth.uid() = user_id);

create policy "Users can delete own checkins"
  on public.checkins for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger checkins_updated_at
  before update on public.checkins
  for each row execute procedure public.update_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- Push subscriptions table
create table public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  endpoint text not null,
  keys jsonb not null, -- { p256dh, auth }
  created_at timestamptz default now(),
  unique(user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

create policy "Users can view own subscriptions"
  on public.push_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert own subscriptions"
  on public.push_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own subscriptions"
  on public.push_subscriptions for delete
  using (auth.uid() = user_id);

-- Indexes for common queries
create index checkins_user_date_idx on public.checkins (user_id, date desc);
create index checkins_date_idx on public.checkins (date);
create index push_subscriptions_user_idx on public.push_subscriptions (user_id);
