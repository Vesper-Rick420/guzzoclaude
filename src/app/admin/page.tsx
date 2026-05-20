import { redirect } from "next/navigation";

// El dashboard se construye en la Fase 10; por ahora va a Productos.
export default function AdminPage() {
  redirect("/admin/productos");
}
