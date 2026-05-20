-- =====================================================
-- GUZZO - Esquema de base de datos (PostgreSQL / Supabase)
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New query
-- Es seguro ejecutarlo varias veces (usa IF EXISTS / IF NOT EXISTS).
-- =====================================================

-- ---------- 1. TABLAS ----------

-- 1.1 users: perfil del cliente. Se enlaza 1:1 con auth.users
--     (auth.users guarda el correo y la contrasena encriptada).
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  email       text not null,
  phone       text,
  cedula      text,
  role        text not null default 'user' check (role in ('user', 'admin')),
  is_blocked  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- 1.2 categories: secciones del menu (Combos, Hamburguesas, etc.)
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- 1.3 products: cada plato del menu
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  description  text,
  price        numeric(10,2) not null check (price >= 0),
  image_url    text,
  category_id  uuid references public.categories(id) on delete set null,
  is_active    boolean not null default true,
  is_featured  boolean not null default false,
  created_at   timestamptz not null default now()
);

-- 1.4 inventory: stock disponible por producto
create table if not exists public.inventory (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null unique references public.products(id) on delete cascade,
  stock       integer not null default 0 check (stock >= 0),
  updated_at  timestamptz not null default now()
);

-- 1.5 orders: pedido (cabecera)
create table if not exists public.orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.users(id) on delete cascade,
  total       numeric(10,2) not null default 0 check (total >= 0),
  status      text not null default 'pendiente'
              check (status in ('pendiente','preparando','listo','entregado','cancelado')),
  created_at  timestamptz not null default now()
);

-- 1.6 order_items: lineas del pedido (que productos y cuantos)
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  quantity    integer not null check (quantity > 0),
  unit_price  numeric(10,2) not null check (unit_price >= 0),
  created_at  timestamptz not null default now()
);

-- 1.7 expenses: gastos del negocio
create table if not exists public.expenses (
  id          uuid primary key default gen_random_uuid(),
  description text not null,
  amount      numeric(10,2) not null check (amount >= 0),
  category    text,
  spent_at    timestamptz not null default now(),
  created_at  timestamptz not null default now()
);

-- 1.8 sales: ventas confirmadas (para ingresos y analiticas)
create table if not exists public.sales (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references public.orders(id) on delete set null,
  amount      numeric(10,2) not null check (amount >= 0),
  sold_at     timestamptz not null default now()
);

-- ---------- 2. INDICES (aceleran las consultas frecuentes) ----------
create index if not exists idx_products_category   on public.products(category_id);
create index if not exists idx_orders_user         on public.orders(user_id);
create index if not exists idx_order_items_order   on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(product_id);
create index if not exists idx_sales_order         on public.sales(order_id);

-- ---------- 3. FUNCIONES ----------

-- 3.1 is_admin(): true si el usuario actual tiene rol admin.
--     SECURITY DEFINER -> evita recursion al consultar public.users.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 3.2 handle_new_user(): al registrarse un usuario en Auth,
--     crea automaticamente su fila de perfil en public.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, email, phone, cedula)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'cedula'
  );
  return new;
end;
$$;

-- 3.3 protect_user_fields(): impide que un usuario normal
--     se cambie el rol o el estado de bloqueo a si mismo.
create or replace function public.protect_user_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.is_blocked := old.is_blocked;
  end if;
  return new;
end;
$$;

-- ---------- 4. TRIGGERS ----------
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists protect_user_fields_trigger on public.users;
create trigger protect_user_fields_trigger
  before update on public.users
  for each row execute function public.protect_user_fields();

-- ---------- 5. SEGURIDAD (Row Level Security) ----------
alter table public.users       enable row level security;
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.inventory   enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
alter table public.expenses    enable row level security;
alter table public.sales       enable row level security;

-- 5.1 users: cada quien ve/edita su perfil; el admin gestiona todos
drop policy if exists users_select on public.users;
create policy users_select on public.users
  for select to authenticated
  using (auth.uid() = id or public.is_admin());

drop policy if exists users_update on public.users;
create policy users_update on public.users
  for update to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists users_delete on public.users;
create policy users_delete on public.users
  for delete to authenticated
  using (public.is_admin());

-- 5.2 categories: todos leen; solo admin escribe
drop policy if exists categories_select on public.categories;
create policy categories_select on public.categories
  for select to authenticated using (true);

drop policy if exists categories_admin on public.categories;
create policy categories_admin on public.categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 5.3 products: todos leen los activos (admin ve tambien los inactivos)
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select to authenticated
  using (is_active or public.is_admin());

drop policy if exists products_admin on public.products;
create policy products_admin on public.products
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 5.4 inventory: todos leen; solo admin escribe
drop policy if exists inventory_select on public.inventory;
create policy inventory_select on public.inventory
  for select to authenticated using (true);

drop policy if exists inventory_admin on public.inventory;
create policy inventory_admin on public.inventory
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 5.5 orders: el cliente ve/crea sus pedidos; el admin ve/edita todos
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists orders_update on public.orders;
create policy orders_update on public.orders
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists orders_delete on public.orders;
create policy orders_delete on public.orders
  for delete to authenticated
  using (public.is_admin());

-- 5.6 order_items: ligado al dueno del pedido
drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists order_items_insert on public.order_items;
create policy order_items_insert on public.order_items
  for insert to authenticated
  with check (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    )
  );

-- 5.7 expenses: solo admin
drop policy if exists expenses_admin on public.expenses;
create policy expenses_admin on public.expenses
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 5.8 sales: solo admin
drop policy if exists sales_admin on public.sales;
create policy sales_admin on public.sales
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- 6. DATOS INICIALES ----------
insert into public.categories (name, slug) values
  ('Combos', 'combos'),
  ('Hamburguesas', 'hamburguesas'),
  ('Gaseosas', 'gaseosas'),
  ('Extras', 'extras')
on conflict (slug) do nothing;

-- =====================================================
-- FIN DEL ESQUEMA
-- =====================================================
