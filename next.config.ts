import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite abrir el servidor de desarrollo desde la red local
  // (por ejemplo, para probar la app en el celular).
  allowedDevOrigins: ["192.168.1.9", "192.168.1.1"],
};

export default nextConfig;
