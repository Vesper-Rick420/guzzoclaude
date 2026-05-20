-- =====================================================
-- GUZZO - Configuracion de Storage (imagenes de productos)
-- Ejecutar en: Supabase -> SQL Editor -> New query
-- =====================================================

-- Bucket publico para las imagenes de los productos.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Cualquiera puede VER las imagenes (el bucket es publico).
drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select
  using (bucket_id = 'product-images');

-- Solo el ADMIN puede subir, cambiar o borrar imagenes.
drop policy if exists "product_images_admin_write" on storage.objects;
create policy "product_images_admin_write" on storage.objects
  for all
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
