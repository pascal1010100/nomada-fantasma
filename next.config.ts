import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {


  // Reemplaza "experimental.turbo" por "turbopack"
  turbopack: {}, // sin "disabled"
};

export default withNextIntl(nextConfig);
