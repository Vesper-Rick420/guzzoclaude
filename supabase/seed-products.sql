-- =====================================================
-- GUZZO - Productos de ejemplo
-- Ejecutar en: Supabase -> SQL Editor -> New query
-- Es seguro ejecutarlo varias veces (no duplica productos).
-- =====================================================

-- Inserta los productos enlazandolos a su categoria por el slug.
insert into public.products (name, description, price, category_id, is_active, is_featured)
select p.name, p.description, p.price, c.id, true, p.featured
from (values
  -- Hamburguesas
  ('Guzzo Clasica',   'Carne de res a la parrilla, cheddar, lechuga, tomate y salsa Guzzo.', 5.99,  'hamburguesas', true),
  ('Doble Tocino',    'Doble carne, doble cheddar y tocino crocante.',                       7.99,  'hamburguesas', true),
  ('BBQ Crispy',      'Carne jugosa, aros de cebolla, cheddar y salsa BBQ ahumada.',          6.99,  'hamburguesas', true),
  ('Pollo Crunch',    'Pechuga de pollo crocante, lechuga y mayonesa de la casa.',            6.49,  'hamburguesas', false),
  ('Veggie Deluxe',   'Medallon de vegetales, palta, tomate y rucula fresca.',                5.99,  'hamburguesas', false),
  -- Combos
  ('Combo Clasico',   'Guzzo Clasica + papas fritas + gaseosa 500ml.',                        8.99,  'combos', true),
  ('Combo Doble',     'Doble Tocino + papas con queso + gaseosa 500ml.',                     10.99,  'combos', true),
  ('Combo Pollo',     'Pollo Crunch + aros de cebolla + gaseosa 500ml.',                      9.49,  'combos', false),
  ('Combo Familiar',  '4 hamburguesas + 2 papas grandes + 4 gaseosas.',                      24.99,  'combos', true),
  -- Gaseosas
  ('Coca-Cola 500ml', 'Bebida gaseosa bien fria.',                                           1.50,  'gaseosas', false),
  ('Sprite 500ml',    'Refresco de lima-limon.',                                             1.50,  'gaseosas', false),
  ('Fanta 500ml',     'Refresco sabor naranja.',                                             1.50,  'gaseosas', false),
  ('Agua 500ml',      'Agua sin gas.',                                                       1.00,  'gaseosas', false),
  -- Extras
  ('Papas Fritas',    'Porcion de papas crocantes con sal.',                                 2.50,  'extras', true),
  ('Papas con Queso', 'Papas fritas banadas en salsa de queso cheddar.',                      3.50,  'extras', false),
  ('Aros de Cebolla', 'Aros de cebolla empanizados y crocantes.',                             3.00,  'extras', false),
  ('Nuggets x6',      '6 nuggets de pollo con salsa a eleccion.',                             3.99,  'extras', false)
) as p(name, description, price, slug, featured)
join public.categories c on c.slug = p.slug
where not exists (
  select 1 from public.products x where x.name = p.name
);

-- Inventario inicial: 50 unidades para cada producto que aun no tenga.
insert into public.inventory (product_id, stock)
select pr.id, 50
from public.products pr
where not exists (
  select 1 from public.inventory i where i.product_id = pr.id
);
