/*
          # [Operation Name]
          Create Core Application Tables and Policies

          ## Query Description: [This script sets up the foundational tables for the PrimeAdView application, including packages, user subscriptions, ads, transactions, and ad views. It also updates the existing profiles table to track user balances. Row Level Security (RLS) is enabled and configured for all new tables to ensure users can only access their own data. This is a critical structural update and is safe to run on a new database.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: false
          
          ## Structure Details:
          - Tables Created: packages, user_packages, ads, transactions, ad_views
          - Tables Altered: profiles (adds deposit_balance, total_earnings)
          
          ## Security Implications:
          - RLS Status: Enabled on all new tables.
          - Policy Changes: Yes, new policies are created for all new tables.
          - Auth Requirements: Policies use `auth.uid()` to restrict access.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys are indexed by default.
          - Triggers: None added in this script.
          - Estimated Impact: Low, as tables are being created, not modifying large existing datasets.
          */

-- 1. Add balance columns to profiles table
alter table public.profiles
add column deposit_balance numeric(10, 2) not null default 0,
add column total_earnings numeric(10, 2) not null default 0;

-- 2. Create Packages Table
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null,
  roi_percentage integer not null,
  daily_ads_limit integer not null,
  duration_days integer not null,
  created_at timestamptz default now()
);

-- 3. Create User Packages Table (Subscription)
create table public.user_packages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid not null references public.packages(id),
  activated_at timestamptz not null default now(),
  expires_at timestamptz not null
);

-- 4. Create Ads Table
create table public.ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  link text not null,
  duration_seconds integer not null,
  reward_amount numeric(10, 4) not null,
  created_at timestamptz default now()
);

-- 5. Create Ad Views Table (Earnings History)
create table public.ad_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  ad_id uuid not null references public.ads(id),
  earned_amount numeric(10, 4) not null,
  viewed_at timestamptz not null default now()
);

-- 6. Create Transactions Table (Deposits/Withdrawals)
create type transaction_type as enum ('deposit', 'withdrawal');
create type transaction_status as enum ('pending', 'completed', 'failed');
create type payment_method as enum ('jazzcash', 'easypaisa', 'card');

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type transaction_type not null,
  amount numeric(10, 2) not null,
  status transaction_status not null default 'pending',
  method payment_method,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

-- SEED DATA --
-- Insert Packages
insert into public.packages (name, price, roi_percentage, daily_ads_limit, duration_days) values
('Starter', 10, 150, 5, 30),
('Premium', 50, 200, 15, 90),
('Business', 100, 250, 50, 180);

-- Insert Sample Ads
insert into public.ads (title, link, duration_seconds, reward_amount) values
('Ad 1', 'https://example.com/ad1', 15, 0.10),
('Ad 2', 'https://example.com/ad2', 30, 0.15),
('Ad 3', 'https://example.com/ad3', 20, 0.12);


-- RLS POLICIES --
-- Profiles table policies are already set up in the previous migration.
-- We just need to ensure select is allowed for the owner.
-- alter policy "Users can view their own profile." on public.profiles using (auth.uid() = id);

-- Packages Table: Publicly visible
alter table public.packages enable row level security;
create policy "Packages are viewable by everyone." on public.packages for select using (true);

-- User Packages Table: Users can only see their own subscriptions
alter table public.user_packages enable row level security;
create policy "Users can view their own package subscriptions." on public.user_packages for select using (auth.uid() = user_id);
create policy "Users can insert their own package subscriptions." on public.user_packages for insert with check (auth.uid() = user_id);

-- Ads Table: Publicly visible to authenticated users
alter table public.ads enable row level security;
create policy "Ads are viewable by authenticated users." on public.ads for select using (auth.role() = 'authenticated');

-- Ad Views Table: Users can only see their own ad views
alter table public.ad_views enable row level security;
create policy "Users can view their own ad views." on public.ad_views for select using (auth.uid() = user_id);
create policy "Users can insert their own ad views." on public.ad_views for insert with check (auth.uid() = user_id);

-- Transactions Table: Users can only see their own transactions
alter table public.transactions enable row level security;
create policy "Users can view their own transactions." on public.transactions for select using (auth.uid() = user_id);
create policy "Users can insert their own transactions." on public.transactions for insert with check (auth.uid() = user_id);
