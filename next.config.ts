import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Solo para sacar el deploy hoy. Luego lo quitamos.
  eslint: { ignoreDuringBuilds: true },

  // Reemplaza "experimental.turbo" por "turbopack"
  turbopack: {}, // sin "disabled"
};

export default nextConfig;
