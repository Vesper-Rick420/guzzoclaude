"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getExtraById,
  getSauceById,
  isValidIngredient,
  formatCustomizationNotes,
} from "@/lib/burger-options";

type CartLine = {
  productId: string;
  quantity: number;
  extraIds?: string[];
  removedIngredients?: string[];
  sauceIds?: string[];
};

type CreateOrderInput = {
  lines: CartLine[];
  orderType: "takeaway" | "dinein";
  paymentMethod: "efectivo" | "tarjeta";
};

type CreateOrderResult =
  | { orderId: string; total: number }
  | { error: string };

/**
 * Crea un pedido en la base de datos.
 * Los precios se toman SIEMPRE de la BD y de la lista canonica de extras,
 * nunca del cliente, para evitar manipulacion.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Debes iniciar sesión para hacer un pedido." };

  if (
    !Array.isArray(input.lines) ||
    input.lines.length === 0
  ) {
    return { error: "Tu carrito está vacío." };
  }
  if (input.orderType !== "takeaway" && input.orderType !== "dinein") {
    return { error: "Tipo de pedido inválido." };
  }
  if (
    input.paymentMethod !== "efectivo" &&
    input.paymentMethod !== "tarjeta"
  ) {
    return { error: "Método de pago inválido." };
  }

  const ids = input.lines.map((l) => l.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, price, is_active")
    .in("id", ids);

  if (productsError || !products) {
    return { error: "No se pudieron verificar los productos." };
  }

  const items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    notes: string | null;
  }[] = [];
  let total = 0;

  for (const line of input.lines) {
    const product = products.find((p) => p.id === line.productId);
    if (!product || !product.is_active) continue;

    const quantity = Math.max(1, Math.floor(Number(line.quantity) || 1));
    const basePrice = Number(product.price);

    // Resolver extras desde la lista canonica (precio real, no del cliente).
    const validExtras = (line.extraIds ?? [])
      .map((id) => getExtraById(id))
      .filter((e): e is NonNullable<ReturnType<typeof getExtraById>> =>
        Boolean(e),
      );
    const extrasTotal = validExtras.reduce((s, e) => s + e.price, 0);
    const unitPrice = Math.round((basePrice + extrasTotal) * 100) / 100;

    // Validar ingredientes quitados.
    const removed = (line.removedIngredients ?? []).filter(isValidIngredient);

    // Resolver salsas desde la lista canonica.
    const validSauces = (line.sauceIds ?? [])
      .map((id) => getSauceById(id))
      .filter((s): s is NonNullable<ReturnType<typeof getSauceById>> =>
        Boolean(s),
      );

    const notes = formatCustomizationNotes({
      removedIngredients: removed,
      extras: validExtras,
      sauces: validSauces,
    });

    total += unitPrice * quantity;
    items.push({
      product_id: product.id,
      quantity,
      unit_price: unitPrice,
      notes,
    });
  }

  if (items.length === 0) {
    return { error: "No hay productos válidos en tu carrito." };
  }
  total = Math.round(total * 100) / 100;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total,
      status: "pendiente",
      order_type: input.orderType,
      payment_method: input.paymentMethod,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "No se pudo crear el pedido. Intenta de nuevo." };
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items.map((it) => ({ ...it, order_id: order.id })));

  if (itemsError) {
    return { error: "No se pudieron guardar los productos del pedido." };
  }

  return { orderId: order.id, total };
}
