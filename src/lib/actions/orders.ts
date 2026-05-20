"use server";

import { createClient } from "@/lib/supabase/server";

type CartLine = { id: string; quantity: number };

type CreateOrderResult =
  | { orderId: string; total: number }
  | { error: string };

/**
 * Crea un pedido en la base de datos.
 * Los precios se toman SIEMPRE de la BD, nunca del cliente,
 * para evitar manipulacion de precios.
 */
export async function createOrder(
  lines: CartLine[],
): Promise<CreateOrderResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión para hacer un pedido." };

  if (!Array.isArray(lines) || lines.length === 0) {
    return { error: "Tu carrito está vacío." };
  }

  // Precios reales desde la base de datos.
  const ids = lines.map((l) => l.id);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, is_active")
    .in("id", ids);

  if (productsError || !products) {
    return { error: "No se pudieron verificar los productos." };
  }

  const items: { product_id: string; quantity: number; unit_price: number }[] =
    [];
  let total = 0;

  for (const line of lines) {
    const product = products.find((p) => p.id === line.id);
    if (!product || !product.is_active) continue;
    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    const unitPrice = Number(product.price);
    total += unitPrice * quantity;
    items.push({ product_id: product.id, quantity, unit_price: unitPrice });
  }

  if (items.length === 0) {
    return { error: "No hay productos válidos en tu carrito." };
  }
  total = Math.round(total * 100) / 100;

  // Cabecera del pedido.
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({ user_id: user.id, total, status: "pendiente" })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "No se pudo crear el pedido. Intenta de nuevo." };
  }

  // Lineas del pedido.
  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items.map((it) => ({ ...it, order_id: order.id })));

  if (itemsError) {
    return { error: "No se pudieron guardar los productos del pedido." };
  }

  return { orderId: order.id, total };
}
