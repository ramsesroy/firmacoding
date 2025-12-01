/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desactivar Turbopack temporalmente para evitar problemas de parsing
  experimental: {
    turbo: false,
  },
};

export default nextConfig;

