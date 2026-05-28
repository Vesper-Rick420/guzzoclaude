-- =====================================================
-- GUZZO - Migracion: tipo de pedido y metodo de pago
-- Ejecutar en: Supabase -> SQL Editor -> New query
-- Es seguro ejecutarlo varias veces (IF NOT EXISTS).
-- =====================================================

-- 1. Para llevar / para servirse + metodo de pago en orders
alter table public.orders
  add column if not exists order_type text not null default 'takeaway'
    check (order_type in ('takeaway','dinein')),
  add column if not exists payment_method text not null default 'efectivo'
    check (payment_method in ('efectivo','transferencia'));

-- 2. Personalizaciones de hamburguesas (extras y quitar ingredientes)
--    Se guarda como texto plano "Sin: cebolla. Extras: tocino, queso extra"
--    para que el personal del local lo lea directo.
alter table public.order_items
  add column if not exists notes text;
