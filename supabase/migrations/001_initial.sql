-- CareerSpeak production schema. Run in a fresh Supabase project.
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scenario_id text not null,
  transcript text not null check (char_length(transcript) between 20 and 4000),
  status text not null default 'processing' check (status in ('processing','completed','failed')),
  scores jsonb,
  overall_score smallint check (overall_score between 0 and 100),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index practice_sessions_user_created_idx on public.practice_sessions(user_id, created_at desc);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('sprint','monthly','annual')),
  status text not null check (status in ('pending','authenticated','active','paused','halted','completed','cancelled')),
  provider_subscription_id text unique,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  kind text not null check (kind in ('order','subscription')),
  provider_reference text not null unique,
  provider_payment_id text,
  amount_paise integer not null check (amount_paise > 0),
  status text not null default 'created',
  created_at timestamptz not null default now(),
  verified_at timestamptz
);
create index payment_attempts_user_created_idx on public.payment_attempts(user_id, created_at desc);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  event_type text not null,
  received_at timestamptz not null default now(),
  unique(provider, event_id)
);

create table public.usage_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('transcription')),
  created_at timestamptz not null default now()
);
create index usage_events_user_kind_created_idx on public.usage_events(user_id, kind, created_at desc);

alter table public.profiles enable row level security;
alter table public.practice_sessions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.webhook_events enable row level security;
alter table public.usage_events enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "sessions_select_own" on public.practice_sessions for select using (auth.uid() = user_id);
create policy "sessions_update_own" on public.practice_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);
create policy "payments_select_own" on public.payment_attempts for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.start_practice_session(p_scenario_id text, p_transcript text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_plan text := 'free';
  v_start timestamptz := date_trunc('month', now());
  v_limit integer := 3;
  v_used integer;
  v_session uuid;
  v_subscription public.subscriptions%rowtype;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;
  if char_length(trim(p_transcript)) < 20 or char_length(p_transcript) > 4000 then raise exception 'invalid_transcript'; end if;
  perform pg_advisory_xact_lock(hashtext(v_user::text));

  select * into v_subscription from public.subscriptions
  where user_id = v_user and status in ('active','authenticated') and coalesce(current_period_end, now() + interval '1 day') > now()
  order by current_period_end desc nulls last limit 1;

  if found then
    v_plan := v_subscription.plan_id;
    if v_plan = 'sprint' then
      v_limit := 10;
      v_start := coalesce(v_subscription.current_period_start, v_subscription.created_at);
    elsif v_plan = 'monthly' then
      v_limit := 25;
      v_start := coalesce(v_subscription.current_period_start, v_subscription.created_at);
    else
      v_limit := 25;
      v_start := greatest(coalesce(v_subscription.current_period_start, date_trunc('month', now())), date_trunc('month', now()));
    end if;
  end if;

  select count(*) into v_used from public.practice_sessions
  where user_id = v_user and created_at >= v_start and status in ('processing','completed');
  if v_used >= v_limit then raise exception 'quota_exceeded'; end if;

  insert into public.practice_sessions(user_id, scenario_id, transcript)
  values (v_user, p_scenario_id, trim(p_transcript)) returning id into v_session;
  return v_session;
end;
$$;

revoke all on function public.start_practice_session(text,text) from public;
grant execute on function public.start_practice_session(text,text) to authenticated;

create or replace function public.reserve_transcription()
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := auth.uid();
  v_count integer;
begin
  if v_user is null then raise exception 'not_authenticated'; end if;
  perform pg_advisory_xact_lock(hashtext(v_user::text || ':transcription'));
  select count(*) into v_count from public.usage_events
  where user_id = v_user and kind = 'transcription' and created_at >= now() - interval '1 hour';
  if v_count >= 12 then raise exception 'rate_limited'; end if;
  insert into public.usage_events(user_id, kind) values (v_user, 'transcription');
  return true;
end;
$$;

revoke all on function public.reserve_transcription() from public;
grant execute on function public.reserve_transcription() to authenticated;
