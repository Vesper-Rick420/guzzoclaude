-- =====================================================
-- GUZZO - Permitir lectura publica del menu
-- Ejecutar en: Supabase -> SQL Editor -> New query
-- Es seguro ejecutarlo varias veces.
-- =====================================================
--
-- Hasta ahora las policies de categories/products solo dejaban leer
-- a 'authenticated'. Como ahora se puede navegar el menu sin cuenta
-- (login solo al confirmar pedido), permitimos lectura tambien a 'anon'.
-- El resto de tablas (orders, users, etc.) sigue protegido.

-- categorias: cualquiera lee
drop policy if exists categories_select on public.categories;
create policy categories_select on public.categories
  for select to anon, authenticated using (true);

-- productos activos: cualquiera lee.
-- Los inactivos siguen visibles solo para el admin (con la policy admin_all).
drop policy if exists products_select on public.products;
create policy products_select on public.products
  for select to anon, authenticated
  using (is_active or public.is_admin());
