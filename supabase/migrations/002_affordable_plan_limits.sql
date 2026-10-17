-- Apply to existing CareerSpeak projects after 001_initial.sql.
-- Updates review allowances for the ₹39 / ₹79 / ₹599 pricing model.
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
