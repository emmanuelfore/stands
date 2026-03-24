-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations (Multi-tenancy)
create table public.organizations (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    logo_url text,
    created_at timestamp with time zone default now()
);

-- Developments
create table public.developments (
    id uuid primary key default uuid_generate_v4(),
    org_id uuid references public.organizations(id) on delete cascade not null,
    name text not null,
    location text,
    description text,
    phases jsonb default '[]'::jsonb,
    penalty_type text check (penalty_type in ('flat', 'percent')),
    penalty_value numeric default 0,
    penalty_grace_days integer default 0,
    min_deposit_percent numeric default 0,
    currency text check (currency in ('USD', 'ZWG', 'BOTH')),
    created_at timestamp with time zone default now()
);

-- Stands
create table public.stands (
    id uuid primary key default uuid_generate_v4(),
    development_id uuid references public.developments(id) on delete cascade not null,
    stand_number text not null,
    size_sqm numeric not null,
    phase text,
    price_usd numeric,
    price_zwg numeric,
    status text not null check (status in ('available', 'reserved', 'allocated', 'transferred', 'on_hold')),
    servicing jsonb default '{}'::jsonb,
    zoning text,
    created_at timestamp with time zone default now()
);

-- Buyers
create table public.buyers (
    id uuid primary key default uuid_generate_v4(),
    org_id uuid references public.organizations(id) on delete cascade not null,
    full_name text not null,
    id_number text not null,
    email text not null,
    phone text,
    portal_activated_at timestamp with time zone,
    onboarding_complete boolean default false,
    referrer_id uuid, -- Reference to an agent if applicable
    created_at timestamp with time zone default now()
);

-- Allocations
create table public.allocations (
    id uuid primary key default uuid_generate_v4(),
    stand_id uuid references public.stands(id) on delete restrict not null,
    buyer_id uuid references public.buyers(id) on delete restrict not null,
    allocated_by uuid, -- Reference to admin user
    allocated_at timestamp with time zone default now(),
    purchase_price numeric not null,
    currency text not null check (currency in ('USD', 'ZWG')),
    deposit_amount numeric not null,
    instalment_plan jsonb default '{}'::jsonb,
    status text not null check (status in ('active', 'transferred', 'cancelled')),
    created_at timestamp with time zone default now()
);

-- Payment Schedule Items
create table public.payment_schedule_items (
    id uuid primary key default uuid_generate_v4(),
    allocation_id uuid references public.allocations(id) on delete cascade not null,
    due_date date not null,
    amount_due numeric not null,
    currency text not null check (currency in ('USD', 'ZWG')),
    status text not null check (status in ('pending', 'paid', 'overdue')),
    paid_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Payments
create table public.payments (
    id uuid primary key default uuid_generate_v4(),
    allocation_id uuid references public.allocations(id) on delete cascade not null,
    buyer_id uuid references public.buyers(id) on delete cascade not null,
    amount numeric not null,
    currency text not null check (currency in ('USD', 'ZWG')),
    exchange_rate numeric default 1,
    payment_method text check (payment_method in ('cash', 'ecocash', 'zipit', 'bank_transfer')),
    reference_number text,
    pop_url text,
    submitted_by text check (submitted_by in ('buyer', 'admin')),
    status text not null check (status in ('pending', 'verified', 'rejected')),
    verified_by uuid, -- Reference to admin user
    verified_at timestamp with time zone,
    rejection_note text,
    admin_note text,
    created_at timestamp with time zone default now()
);

-- Penalties
create table public.penalties (
    id uuid primary key default uuid_generate_v4(),
    allocation_id uuid references public.allocations(id) on delete cascade not null,
    amount numeric not null,
    currency text not null,
    reason text,
    calculation_basis text,
    status text check (status in ('pending_approval', 'approved', 'rejected', 'waived')),
    approved_by uuid,
    applied_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Documents
create table public.documents (
    id uuid primary key default uuid_generate_v4(),
    org_id uuid references public.organizations(id) on delete cascade not null,
    stand_id uuid references public.stands(id),
    buyer_id uuid references public.buyers(id),
    category text check (category in ('offer_letter', 'agreement', 'receipt', 'title_deed', 'id_document', 'other')),
    name text not null,
    file_url text not null,
    version integer default 1,
    expires_at timestamp with time zone,
    uploaded_by uuid,
    created_at timestamp with time zone default now()
);

-- Document Requests
create table public.document_requests (
    id uuid primary key default uuid_generate_v4(),
    buyer_id uuid references public.buyers(id) on delete cascade not null,
    document_type text not null,
    note text,
    status text check (status in ('open', 'in_progress', 'fulfilled')),
    fulfilled_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Enable RLS logic (Basic multi-tenancy policies)
alter table public.organizations enable row level security;
alter table public.developments enable row level security;
alter table public.stands enable row level security;
alter table public.buyers enable row level security;
alter table public.allocations enable row level security;
alter table public.payments enable row level security;
alter table public.payment_schedule_items enable row level security;
alter table public.documents enable row level security;

-- TODO: Add specific RLS policies based on auth roles and org_id
