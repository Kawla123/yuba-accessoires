-- Commandes, lignes de commande, avis clients, newsletter.

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address text not null,
  city text not null,
  governorate text not null,
  payment_method payment_method not null default 'cod',
  payment_status payment_status not null default 'pending',
  order_status order_status not null default 'pending_confirmation',
  subtotal integer not null check (subtotal >= 0),
  shipping_cost integer not null default 0 check (shipping_cost >= 0),
  total integer not null check (total >= 0),
  konnect_payment_ref text,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  variant_id uuid references product_variants (id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price_at_purchase integer not null check (unit_price_at_purchase >= 0),
  product_name_snapshot text not null
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  order_id uuid references orders (id) on delete set null,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  photo_r2_keys text[] not null default '{}',
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  discount_code text,
  created_at timestamptz not null default now()
);

create index orders_order_number_idx on orders (order_number);
create index orders_order_status_idx on orders (order_status);
create index orders_payment_status_idx on orders (payment_status);
create index orders_customer_phone_idx on orders (customer_phone);
create index order_items_order_id_idx on order_items (order_id);
create index order_items_product_id_idx on order_items (product_id);
create index reviews_product_id_idx on reviews (product_id);
create index reviews_is_approved_idx on reviews (is_approved) where is_approved;
