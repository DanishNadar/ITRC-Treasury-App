create table if not exists club_settings (
  id integer primary key check (id = 1),
  club_name varchar(150) not null default 'Illinois Tech Railroad Club',
  opening_balance numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now()
);
insert into club_settings (id, club_name, opening_balance) values (1, 'Illinois Tech Railroad Club', 0) on conflict (id) do nothing;
create table if not exists donations (
  id text primary key,
  amount numeric(12, 2) not null check (amount >= 0),
  donation_date date not null,
  company_name varchar(150) not null,
  company_rep varchar(150),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists expenses (
  id text primary key,
  amount numeric(12, 2) not null check (amount >= 0),
  expense_date date not null,
  description text not null,
  person_name varchar(150) not null,
  company_name varchar(150),
  company_rep varchar(150),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_donations_date on donations (donation_date desc);
create index if not exists idx_expenses_date on expenses (expense_date desc);
create or replace view club_financial_summary as
select s.club_name, s.opening_balance, coalesce(d.total_gains, 0) as total_gains, coalesce(e.total_expenses, 0) as total_expenses, s.opening_balance + coalesce(d.total_gains, 0) - coalesce(e.total_expenses, 0) as current_funds
from club_settings s
left join (select sum(amount) as total_gains from donations) d on true
left join (select sum(amount) as total_expenses from expenses) e on true
where s.id = 1;
create or replace view treasury_ledger as
select d.id, 'gain'::text as entry_type, d.amount, d.donation_date as activity_date, concat('Donation from ', d.company_name, coalesce(concat(' (', d.company_rep, ')'), '')) as detail_text, d.company_name, d.created_at from donations d
union all
select e.id, 'expense'::text as entry_type, e.amount, e.expense_date as activity_date, concat(e.description, ' -- by ', e.person_name) as detail_text, e.company_name, e.created_at from expenses e;
