import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite abrir el servidor de desarrollo desde la red local
  // (por ejemplo, para probar la app en el celular).
  allowedDevOrigins: ["192.168.1.9", "192.168.1.1"],

  // Optimizacion de imagenes: permite cargar las fotos de productos
  // alojadas en Supabase Storage.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
