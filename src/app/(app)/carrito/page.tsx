import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Carrito | GUZZO",
};

export default function CarritoPage() {
  return <CartView />;
}
