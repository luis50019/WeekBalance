DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS weekly_goals CASCADE;
DROP TABLE IF EXISTS income_history CASCADE;
DROP TABLE IF EXISTS expense_history CASCADE;
DROP TABLE IF EXISTS savings_movements CASCADE;
DROP TABLE IF EXISTS expense_categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  created_at timestamp with time zone default now()
);

f
create table accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  balance numeric(12,2) not null default 0,
  created_at timestamp with time zone default now()
);

create table weekly_goals (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  target_amount numeric(12,2) not null,
  week_start date not null,
  week_end date not null,
  status text check (status in ('active', 'completed', 'failed')) default 'active',
  created_at timestamp with time zone default now()
);

create table income_history (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  amount numeric(12,2) not null,
  category text not null,
  description text,
  source text,
  created_at timestamp with time zone default now()
);

create table expense_history (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  category text not null,
  amount numeric(12,2) not null,
  description text,
  created_at timestamp with time zone default now()
);

create table savings_movements (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  amount numeric(12,2) not null,
  created_at timestamp with time zone default now()
);

alter table accounts disable row level security;
alter table profiles disable row level security;
alter table income_history disable row level security;
alter table expense_history disable row level security;
alter table savings_movements disable row level security;
alter table weekly_goals disable row level security;

create or replace function add_income()
returns trigger as $$
begin
  update accounts
  set balance = balance + new.amount
  where id = new.account_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_add_income
after insert on income_history
for each row execute function add_income();

create or replace function subtract_expense()
returns trigger as $$
begin
  update accounts
  set balance = balance - new.amount
  where id = new.account_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_subtract_expense
after insert on expense_history
for each row execute function subtract_expense();

create or replace function create_user_profile(
  p_user_id uuid,
  p_full_name text

)
returns table (
  user_id uuid,
  account_id uuid
)
language plpgsql
security definer
set search_path = public
as $$

declare
  v_account_id uuid;
begin
  insert into profiles (id, full_name)
  values (p_user_id, p_full_name);

  insert into accounts (user_id, balance)
  values (p_user_id, 0)
  returning id into v_account_id;

  return query
  select p_user_id, v_account_id;
end;
$$;

DROP FUNCTION IF EXISTS get_expense_percentage_by_category(uuid);
DROP FUNCTION IF EXISTS get_recent_incomes(uuid, int);

create or replace function get_expense_percentage_by_category(
  p_account_id uuid
)
returns table (
  category text,
  description text,
  total_spent numeric,
  percentage numeric
)
language sql
as $$
  select
    t.category,
    t.description,
    t.total_spent,
    round((t.total_spent / sum(t.total_spent) over ()) * 100, 2) as percentage
  from (
    select
      eh.category,
      eh.description,
      sum(eh.amount) as total_spent
    from expense_history eh
    join accounts a on a.id = eh.account_id
    where a.id = p_account_id
    group by eh.category
  ) t
  order by percentage desc;
$$;

create or replace function get_recent_incomes(
  p_account_id uuid
)
returns table (
  id uuid,
  amount numeric,
  description text,
  category text,
  source text,
  created_at timestamptz
)
language sql
as $$
  select
    ih.id,
    ih.amount,
    ih.description,
    ih.category,
    ih.source,
    ih.created_at
  from income_history ih
  where ih.account_id = p_account_id
  order by ih.created_at desc
$$;

