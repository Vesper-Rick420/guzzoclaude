-- =====================================================
-- GUZZO - Migracion: metodo de pago "tarjeta"
-- Ejecutar en: Supabase -> SQL Editor -> New query
-- Es seguro ejecutarlo varias veces.
-- =====================================================
--
-- Reemplaza "transferencia" por "tarjeta" en payment_method.
-- Conservamos "transferencia" en el constraint por compatibilidad con
-- pedidos antiguos que ya hayan quedado guardados.

alter table public.orders
  drop constraint if exists orders_payment_method_check;

alter table public.orders
  add constraint orders_payment_method_check
  check (payment_method in ('efectivo','transferencia','tarjeta'));

-- Migrar valores antiguos: transferencia -> tarjeta.
update public.orders
set payment_method = 'tarjeta'
where payment_method = 'transferencia';
