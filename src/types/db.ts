// Tipos de las tablas de la base de datos de GUZZO.

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
};

export type OrderStatus =
  | "pendiente"
  | "preparando"
  | "listo"
  | "entregado"
  | "cancelado";

export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  cedula: string | null;
  role: string;
  created_at: string;
};

export type OrderType = "takeaway" | "dinein";
export type PaymentMethod = "efectivo" | "transferencia";

/** Pedido con sus productos, tal como lo usa el perfil. */
export type ProfileOrder = {
  id: string;
  total: number;
  status: OrderStatus;
  order_type: OrderType;
  payment_method: PaymentMethod;
  created_at: string;
  order_items: {
    quantity: number;
    unit_price: number;
    notes: string | null;
    products: { name: string } | null;
  }[];
};

/** Usuario tal como lo ve el panel de administracion. */
export type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  cedula: string | null;
  role: string;
  is_blocked: boolean;
  created_at: string;
};
